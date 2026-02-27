import { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./types.js";
import { respondWithJSON } from "./json.js";
import { deleteAllUsers } from "../db/queries/users.js";

export async function handlerResetUsersCount(req: Request, res: Response): Promise<void> {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("Forbidden Request");
    }
    config.api.fileserverHits = 0;

    await deleteAllUsers();
    respondWithJSON(res, 200, { message: "Users count reset" });
}