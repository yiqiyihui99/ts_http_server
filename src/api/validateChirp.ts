import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BannedWords, BadRequestError } from "./types.js";

export async function handlerValidateChirp(req: Request, res: Response): Promise<void> {
    type Chirp = {
        body: string;
    }
    const chirp: Chirp = req.body;
    if (!chirp.body || typeof chirp.body !== "string") {
        throw new BadRequestError("Body is missing or is not a string");
    }

    if (chirp.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const words = chirp.body.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (BannedWords.includes(words[i].toLowerCase())) {
            words[i] = "****";
        }
    }

    respondWithJSON(res, 200, { "cleanedBody": words.join(" ") });
}