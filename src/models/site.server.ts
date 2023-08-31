import { eq, or } from "drizzle-orm";
import { ISite, IStory, IUser, IWorkspace, sites } from "~/drizzle/schema";
import { db } from "~/drizzle/client";

export interface SiteWithRelations extends ISite {
  stories: IStory[];
  workspace: IWorkspace;
  extra: {
    settings: {
      metadata: {
        title: string;
        description: string;
      };
    };
  };
}

export class Site {
  static async create(
    data: Pick<
      ISite,
      "id" | "subdomain" | "name" | "database" | "workspaceId" | "userId"
    >,
  ) {
    return db.insert(sites).values({
      id: data.id,
      name: data.name,
      subdomain: data.subdomain,
      domain: null,
      database: data.database,
      settings: JSON.stringify({
        metadata: {
          title: data.name,
          description: "A minimal powerful stories blog.",
        },
      }),
      workspaceId: data.workspaceId,
      userId: data.userId,
      updatedAt: new Date().toISOString(), // FIXME: Remove this.
    });
  }

  static async destroy(id: ISite["id"]) {
    return db.delete(sites).where(eq(sites.id, id));
  }

  static async update(
    id: ISite["id"],
    data: {
      title: String;
      description: String;
      domain: ISite["domain"];
    },
  ) {
    return db
      .update(sites)
      .set({
        domain: data.domain,
        settings: JSON.stringify({
          metadata: {
            title: data.title,
            description: data.description,
          },
        }),
      })
      .where(eq(sites.id, id));
  }

  static async firstByUser(uid: IUser["id"]) {
    const data = await db.query.sites.findFirst({
      where: eq(sites.userId, uid),
      with: {
        workspace: true,
        stories: true,
      },
    });

    return data ? this.mapToModel(data) : null;
  }

  static async lookup(domOrSub: string) {
    const data = await db.query.sites.findFirst({
      where: or(eq(sites.domain, domOrSub), eq(sites.subdomain, domOrSub)),
      with: {
        stories: true,
        workspace: true,
      },
    });

    return data ? this.mapToModel(data) : null;
  }

  static mapToModel(
    site: ISite & { workspace: IWorkspace; stories: IStory[] },
  ): SiteWithRelations {
    const settings = JSON.parse(
      site.settings,
    ) as SiteWithRelations["extra"]["settings"];

    return {
      id: site.id,
      name: site.name,
      createdAt: site.createdAt,
      database: site.database,
      domain: site.domain,
      settings: site.settings,
      subdomain: site.subdomain,
      updatedAt: site.updatedAt,
      userId: site.userId,
      workspaceId: site.workspaceId,
      stories: site.stories,
      workspace: site.workspace,
      extra: {
        settings,
      },
    };
  }
}
