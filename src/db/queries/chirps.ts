import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { eq, asc } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
    return result;
}

export async function getChirps() {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
    return result;
}

export async function getChirpById(chirpId: string) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId))
        .limit(1);
    return result;
}