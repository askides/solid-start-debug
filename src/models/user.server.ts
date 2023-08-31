import bcrypt from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";
import { db } from "~/drizzle/client";
import { IUser, users } from "~/drizzle/schema";
import { eq } from "drizzle-orm";

export class User {
  static async find(id: IUser["id"]) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  static async findByEmail(email: IUser["email"]) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  static async create(email: IUser["email"], password: string) {
    const hash = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({
        id: createId(),
        email: email,
        password: hash,
        updatedAt: new Date().toISOString(), // FIXME: Remove this
      })
      .returning();

    return user;
  }
}
