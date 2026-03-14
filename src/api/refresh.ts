import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { config } from "../config.js";
import { getRefreshTokenUserId, revokeRefreshToken } from "../db/queries/refresh.js";

export async function handlerRefresh(req: Request, res: Response): Promise<void> {
    const refreshToken = getBearerToken(req);
    const userId = await getRefreshTokenUserId(refreshToken);
    if (!userId) {
        respondWithError(res, 401, "Invalid refresh token");
        return;
    }
    const newJWT = makeJWT(userId, 3600, config.jwtSecret);
    respondWithJSON(res, 200, { token: newJWT });
}

export async function handlerRevoke(req: Request, res: Response): Promise<void> {
    const refreshToken = getBearerToken(req);
    await revokeRefreshToken(refreshToken);
    res.status(204).send();
}