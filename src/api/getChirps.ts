import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { db } from "../db/index.js";
import { chirps } from "../db/schema.js";

export async function handlerGetChirps(req: Request, res: Response): Promise<void> {
    const chirpsArray = await db.select().from(chirps).orderBy((chirps.createdAt));
    respondWithJSON(res, 200, chirpsArray);
}