import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "./api/errors.js";
import { Request } from "express";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
    return await argon2.verify(hash, password);
}


// .sign() and .verify() are synchronous so no need to make async or handle w/ try/catch
export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const currTime = Math.floor(Date.now() / 1000);
  const payload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: currTime,
    exp: currTime + expiresIn,
  };

  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const verified = jwt.verify(tokenString, secret) as JwtPayload;
    if (!verified.sub) {
      throw new UnauthorizedError("Invalid token");
    }
    return verified.sub;
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  } 
}

export function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization");
  const headerParts = authHeader?.split(" ");
  if (!authHeader || headerParts?.[0] !== "Bearer" || headerParts?.length !== 2) {
    throw new BadRequestError("Authorization header is missing or is not in the correct format");
  }
  // has format: "Bearer <token>"
  return headerParts[1];
}