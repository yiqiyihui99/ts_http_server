import { config } from "src/config.js";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
import { and, eq, gt, isNull } from "drizzle-orm";


export async function saveRefreshToken(userId: string, token: string) {
    const [result] = await db.insert(
        refreshTokens
    ).values({
        token: token,
        userId: userId,
        expiresAt: new Date(Date.now() + config.refreshToken.expiresIn),
        revokedAt: null,
    }).returning();
    return result;
}

export async function getRefreshTokenUserId(token: string): Promise<string | null> {
    const [result] = await db.select({ userId: refreshTokens.userId })
        .from(refreshTokens)
        .where(and(eq(refreshTokens.token, token), isNull(refreshTokens.revokedAt), gt(refreshTokens.expiresAt, new Date())))
        .limit(1);
    return result?.userId ?? null;
}

export async function revokeRefreshToken(token: string): Promise<void> {
    const currTime = new Date();
    await db.update(refreshTokens)
        .set({ revokedAt: currTime, updatedAt: currTime })
        .where(eq(refreshTokens.token, token));
}