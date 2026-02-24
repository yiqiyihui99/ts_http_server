import { Response } from "express";

export function respondWithJSON(res: Response, statusCode: number, data: any): void {
    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(statusCode).send(JSON.stringify(data));
}

export function respondWithError(res: Response, statusCode: number, message: string): void {
    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(statusCode).send(JSON.stringify({ "error": message }));
}