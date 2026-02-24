import { Request, Response } from "express";
import { config } from "../config.js";

export function handlerResetServerHitsCount(req: Request, res: Response): void {
    config.fileserverHits = 0;
    res.send(`Hits reset: ${config.fileserverHits}`);
}