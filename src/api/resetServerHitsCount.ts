import { Request, Response } from "express";
import { config } from "../config.js";

export function handlerResetServerHitsCount(req: Request, res: Response) {
    config.api.fileserverHits = 0;
    res.write(`Hits reset to ${config.api.fileserverHits}`);
    res.end();
}