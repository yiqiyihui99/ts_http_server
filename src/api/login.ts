import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { getUserByEmail } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { UserResponse } from "./users.js";
import { config } from "../config.js";

export async function handlerLogin(req: Request, res: Response): Promise<void> {
  if (!req.body.email || typeof req.body.email !== "string") {
    throw new BadRequestError("Email is missing or is not a string");
  }

  if (!req.body.password || typeof req.body.password !== "string") {
    throw new BadRequestError("Password is missing or is not a string");
  }

  const user = await getUserByEmail(req.body.email);
  if (!user) {
    throw new UnauthorizedError("incorrect email or password");
  }

  const isPasswordValid = await checkPasswordHash(
    req.body.password,
    user.hashedPassword ?? "",
  );
  if (!isPasswordValid) {
    throw new UnauthorizedError("incorrect email or password");
  }

  const maxExpirationTime = 3600;
  const expirationTime = req.body.expiresInSeconds
    && req.body.expiresInSeconds <= maxExpirationTime
    ? req.body.expiresInSeconds
    : maxExpirationTime;

  const token = makeJWT(user.id, expirationTime, config.jwtSecret);

  const sanitizedUser: UserResponse = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: token,
  } satisfies UserResponse;

  respondWithJSON(res, 200, sanitizedUser);
}
