import { isFullUser } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import slugify from "slugify";

export function createArticleExcerpt(article: PageObjectResponse) {
  if (Object.hasOwn(article.properties, "Excerpt")) {
    if (article.properties.Excerpt.type === "rich_text") {
      return article.properties.Excerpt.rich_text
        .map((el) => el.plain_text)
        .join(" ");
    }
  }

  return null;
}

export function createArticlePublishedAt(article: PageObjectResponse) {
  if (Object.hasOwn(article.properties, "PublishedAt")) {
    const { PublishedAt } = article.properties;

    if (PublishedAt.type === "date") {
      if (PublishedAt.date && Object.hasOwn(PublishedAt.date, "start")) {
        return new Date(PublishedAt.date.start);
      }
    }
  }

  return new Date(); // Super edge case in case something goes wrong.
}

export function createArticleTitle(article: PageObjectResponse) {
  const entries = Object.values(article.properties);
  const title = entries.find((element) => element.type === "title");

  if (title && title.type === "title") {
    const rawContent = title["title"];
    if (Array.isArray(rawContent) && rawContent.length >= 1) {
      if (Object.hasOwn(rawContent[0], "plain_text")) {
        return rawContent[0].plain_text;
      }
    }
  }

  return null;
}

export function createArticleSlug(article: PageObjectResponse) {
  const title = createArticleTitle(article);

  if (!title) throw new Error("Missing title for article: " + article.id);

  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function createArticleCover(article: PageObjectResponse) {
  if (Object.hasOwn(article, "cover") && article.cover !== null) {
    if (article.cover.type === "file") {
      return article.cover.file.url;
    } else {
      return article.cover.external.url;
    }
  }

  return null;
}

export function createArticleTags(article: PageObjectResponse) {
  if (Object.hasOwn(article.properties, "Tags")) {
    if (article.properties.Tags.type === "multi_select") {
      return article.properties.Tags.multi_select.map((el) => {
        return {
          id: el.id,
          name: el.name,
        };
      });
    }
  }

  return [];
}

export function createArticleAuthors(article: PageObjectResponse) {
  if (Object.hasOwn(article.properties, "Authors")) {
    if (article.properties.Authors.type === "people") {
      return article.properties.Authors.people.filter(isFullUser).map((el) => {
        return {
          id: el.id,
          fullName: el.name,
          avatar: el.avatar_url,
        };
      });
    }
  }

  return [];
}
