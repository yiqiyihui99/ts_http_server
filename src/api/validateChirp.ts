import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BannedWords } from "../config.js";


export async function handlerValidateChirp(req: Request, res: Response): Promise<void> {
    type Chirp = {
        body: string;
    }
    const chirp: Chirp = req.body;
    if (!chirp.body || typeof chirp.body !== "string") {
        // typically would be a mroe specific 400 error but we're using 500 error waterfall via middleware
        throw new Error("Body is missing or is not a string");
    }

    if (chirp.body.length > 140) {
        throw new Error("Chirp is too long");
    }

    const words = chirp.body.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (BannedWords.includes(words[i].toLowerCase())) {
            words[i] = "****";
        }
    }

    respondWithJSON(res, 200, { "cleanedBody": words.join(" ") });
}