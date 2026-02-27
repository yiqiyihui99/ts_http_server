import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { getChirps } from "../db/queries/chirps.js";

export async function handlerGetChirps(_: Request, res: Response): Promise<void> {
    const chirpsArray = await getChirps();
    respondWithJSON(res, 200, chirpsArray);
}