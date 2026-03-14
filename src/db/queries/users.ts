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

export async function updateUserPassword(userId: string, email: string, newHashedPassword: string) {
  await db.update(users).set({ email: email, hashedPassword: newHashedPassword }).where(eq(users.id, userId));
  return db.select().from(users).where(eq(users.id, userId)).limit(1).then(result => result[0]);
}

export async function deleteAllUsers() {
  await db.delete(users).execute();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [result] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result ?? null;
}