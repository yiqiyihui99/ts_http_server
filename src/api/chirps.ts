import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BannedWords, BadRequestError, NotFoundError } from "./errors.js";
import { createChirp, getChirps, getChirpById } from "../db/queries/chirps.js";

type Chirp = {
    body: string;
    userId: string;
}

function validateChirp(chirp: Chirp): Chirp {
    if (!chirp.body || typeof chirp.body !== "string") {
        throw new BadRequestError("Body is missing or is not a string");
    } else if (!chirp.userId || typeof chirp.userId !== "string") {
        throw new BadRequestError("userId is missing or is not a string");
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

    return { userId: chirp.userId, body: words.join(" ") };
}

export async function handlerCreateChirps(req: Request, res: Response): Promise<void> {
    const { body, userId } = req.body ?? {};
    const sanitizedChirp = validateChirp({ body, userId });
    const chirp = await createChirp(sanitizedChirp);
    respondWithJSON(res, 201, chirp);
}

export async function handlerGetChirps(_: Request, res: Response): Promise<void> {
    const chirpsArray = await getChirps();
    respondWithJSON(res, 200, chirpsArray);
}

export async function handlerGetChirpById(req: Request, res: Response): Promise<void> {
    const { chirpId } = req.params;

    if (!chirpId || typeof chirpId !== "string") {
        throw new BadRequestError("Chirp ID is missing or is not a string");
    }

    const chirp = await getChirpById(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }
    respondWithJSON(res, 200, chirp);
}