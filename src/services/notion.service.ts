import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import {
  createArticleAuthors,
  createArticleCover,
  createArticleExcerpt,
  createArticlePublishedAt,
  createArticleSlug,
  createArticleTags,
  createArticleTitle,
} from "~/utils/notion";
import { IWorkspace, stories } from "~/drizzle/schema";
import { SiteWithRelations } from "~/models/site.server";
import { db } from "~/drizzle/client";
import { eq } from "drizzle-orm";

interface CreatedStory {
  id: string;
  tags: string;
  slug: string;
  title: string;
  cover: string;
  excerpt: string;
  content: string;
  authors: string;
  siteId: string;
  createdAt: string;
  updatedAt: string;
}

export class Notion {
  static async findDatabasesByWorkspace(ws: IWorkspace) {
    const response = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ws.accessToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        filter: {
          value: "database",
          property: "object",
        },
      }),
    });

    const json = await response.json();

    return json.results;
  }

  static async import(site: SiteWithRelations) {
    const authToken = site.workspace.accessToken;

    const notion = new Client({
      auth: authToken,
    });

    const elements = await notion.databases.query({
      database_id: site.database,
      filter: {
        property: "PublishedAt",
        date: {
          is_not_empty: true,
        },
      },
      sorts: [
        {
          property: "PublishedAt",
          direction: "descending",
        },
      ],
    });

    console.time("Import Articles");

    const createdStories: CreatedStory[] = [];

    for (const element of elements.results) {
      const response = await notion.pages.retrieve({
        page_id: element.id,
      });

      if (isFullPage(response)) {
        const converter = new NotionToMarkdown({ notionClient: notion });
        const markdownBlocks = await converter.pageToMarkdown(response.id);
        const markdownString = converter.toMarkdownString(markdownBlocks);
        const content = markdownString.parent.trim();

        const tags = createArticleTags(response)
          .map((element) => element.name)
          .join(",");

        const authors = createArticleAuthors(response)
          .map((element) => element.fullName)
          .join(",");

        const createdStory = {
          id: response.id,
          tags: tags,
          slug: createArticleSlug(response)!,
          title: createArticleTitle(response)!,
          cover: createArticleCover(response)!,
          excerpt: createArticleExcerpt(response)!,
          content: content,
          authors: authors,
          siteId: site.id,
          createdAt: createArticlePublishedAt(response).toISOString(),
          updatedAt: new Date(response.last_edited_time).toISOString(),
        };

        createdStories.push(createdStory);

        console.info("# Created Story:", createdStory.title);
      }
    }

    console.info("# Starting DB Transaction");

    await db.transaction(async (tx) => {
      await tx.delete(stories).where(eq(stories.siteId, site.id));
      await tx.insert(stories).values(createdStories);
    });

    console.timeEnd("Import Articles");
  }
}
