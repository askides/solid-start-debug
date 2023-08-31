import { IWorkspace, workspaces } from "~/drizzle/schema";
import { db } from "~/drizzle/client";
import { eq } from "drizzle-orm";

export class Workspace {
  static async findOrFail(id: IWorkspace["id"]) {
    const item = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });

    if (!item) throw new Error("Workspace not found.");

    return item;
  }

  static async findManyByUser(uid: IWorkspace["userId"]) {
    return db.query.workspaces.findMany({
      where: eq(workspaces.userId, uid),
    });
  }

  static async createOrUpdate(
    data: Omit<IWorkspace, "createdAt" | "updatedAt">,
  ) {
    return db
      .insert(workspaces)
      .values({
        id: data.id,
        name: data.name,
        accessToken: data.accessToken,
        tokenType: data.tokenType,
        userId: data.userId,
        updatedAt: new Date().toISOString(), // FIXME: Remove this
      })
      .onConflictDoUpdate({
        target: workspaces.id,
        set: {
          name: data.name,
          accessToken: data.accessToken,
          tokenType: data.tokenType,
        },
      });
  }
}
