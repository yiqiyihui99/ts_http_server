import { Request, Response, } from "express";
import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";;
import { respondWithJSON } from "./json.js";

export async function handlerCreateUser(req: Request, res: Response): Promise<void> {
    if (!req.body.email || typeof req.body.email !== "string") {
        throw new BadRequestError("Email is missing or is not a string");
    }

    const user = await createUser({ email: req.body.email });
    if (!user) {
        throw new Error("Failed to create user");
    }
    respondWithJSON(res, 201, user);
}