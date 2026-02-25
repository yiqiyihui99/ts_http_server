import type { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";
import { BannedWords } from "../config.js";


export async function handlerValidateChirp(req: Request, res: Response): Promise<void> {
    type Chirp = {
        body: string;
    }
    try {
        const chirp: Chirp = req.body;
        if (!chirp.body || typeof chirp.body !== "string") {
            respondWithError(res, 400, "Something went wrong");
            return;
        }

        if (chirp.body.length > 140) {
            respondWithError(res, 400, "Chirp is too long");
            return;
        }

        const words = chirp.body.split(" ");
        for (let i = 0; i < words.length; i++) {
            if (BannedWords.includes(words[i].toLowerCase())) {
                words[i] = "****";
            }
        }

        respondWithJSON(res, 200, { "cleanedBody": words.join(" ") });
    } catch (e) { // TODO: Potentially make more robust error handling
        e instanceof Error ? respondWithError(res, 400, e.message)
            : respondWithError(res, 400, "Something went wrong");
        return;
    }
}