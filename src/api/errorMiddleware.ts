import type { Request, Response, NextFunction } from "express";
import { respondWithError } from "./json.js";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "./errors.js";

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof BadRequestError) {
        respondWithError(res, 400, err.message);
    } else if (err instanceof UnauthorizedError) {
        respondWithError(res, 401, err.message);
    } else if (err instanceof ForbiddenError) {
        respondWithError(res, 403, err.message);
    } else if (err instanceof NotFoundError) {
        respondWithError(res, 404, err.message);
    } else {
        console.log("Error occurred: ", err);
        respondWithError(res, 500, "Something went wrong on our end");
    }
}