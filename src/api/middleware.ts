import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "./errors.js";
import { respondWithError } from "./json.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode < 200 || statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
    next();
}

export function middlewareMetricsInc(_: Request, __: Response, next: NextFunction): void {
    config.api.fileserverHits++;
    next();
}

export function errorMiddleware(err: Error, _: Request, res: Response, __: NextFunction): void {
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