import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";

type Chirp = {
    body: string;
}

export async function handlerValidateChirp(req: Request, res: Response): Promise<void> {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body);
            if (!('body' in parsedBody && typeof parsedBody.body === 'string')) {
                throw new Error("Invalid Chirp, missing text field");
            } else if (parsedBody.body.length > 140) {
                throw new Error("Chirp is too long");
            } else {
                respondWithJSON(res, 200, { "valid": true });
            }

        } catch (e) {
            e instanceof Error ? respondWithError(res, 400, e.message)
                : respondWithError(res, 400, "Something went wrong");
        }
    });
}