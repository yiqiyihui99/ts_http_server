import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";
import { User } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllUsers() {
  await db.delete(users).execute();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [result] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result ?? null;
}