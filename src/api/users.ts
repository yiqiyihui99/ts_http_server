import { Request, Response, } from "express";
import { BadRequestError, ForbiddenError } from "./errors.js";
import { createUser, deleteAllUsers } from "../db/queries/users.js";;
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";

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

export async function handlerResetUsersCount(_: Request, res: Response): Promise<void> {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("Forbidden Request");
    }
    config.api.fileserverHits = 0;

    await deleteAllUsers();
    respondWithJSON(res, 200, { message: "Users count reset" });
}