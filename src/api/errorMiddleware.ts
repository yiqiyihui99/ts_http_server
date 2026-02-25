import type { Request, Response, NextFunction } from "express";
import { respondWithError } from "./json.js";

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.log("Error occurred: ", err);
    respondWithError(res, 500, "Something went wrong on our end");
}