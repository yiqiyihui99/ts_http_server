import express, { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";


export async function handlerValidateChirp(req: Request, res: Response): Promise<void> {
    type Chirp = {
        body: string;
    }
    try {
        const chirp: Chirp = req.body;
        if (!chirp.body || typeof chirp.body !== "string") {
            respondWithJSON(res, 400, "Something went wrong");
        } else if (chirp.body.length > 140) {
            respondWithJSON(res, 400, "Chirp is too long");
        } else {
            respondWithJSON(res, 200, { "valid": true, "chirp": chirp });
        }
    } catch (e) { // TODO: Potentially make more robust error handling
        e instanceof Error ? respondWithError(res, 400, e.message)
            : respondWithError(res, 400, "Something went wrong");
    }
}