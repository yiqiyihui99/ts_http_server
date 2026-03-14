import { Request, Response } from "express";
import { BadRequestError, ForbiddenError } from "./errors.js";
import { createUser, deleteAllUsers, updateUserPassword } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { config } from "../config.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
import { NewUser } from "../db/schema.js";

// token is optional because it's not required for the user creation or login
export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.body.email || typeof req.body.email !== "string") {
    throw new BadRequestError("Email is missing or is not a string");
  }

  if (!req.body.password || typeof req.body.password !== "string") {
    throw new BadRequestError("Password is missing or is not a string");
  }

  const hashedPassword = await hashPassword(req.body.password);
  const user = await createUser({
    email: req.body.email,
    hashedPassword: hashedPassword,
  });
  if (!user) {
    throw new Error("Failed to create user");
  }

  const sanitizedUser: UserResponse = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse;

  respondWithJSON(res, 201, sanitizedUser);
}

export async function handlerResetUsersCount(
  _: Request,
  res: Response,
): Promise<void> {
  if (config.api.platform !== "dev") {
    throw new ForbiddenError("Forbidden Request");
  }
  config.api.fileserverHits = 0;

  await deleteAllUsers();
  respondWithJSON(res, 200, { message: "Users count reset" });
}

export async function handlerUpdateUser(req: Request, res: Response): Promise<void> {
  if (!req.body.email || typeof req.body.email !== "string") {
    throw new BadRequestError("Email is missing or is not a string");
  }

  if (!req.body.password || typeof req.body.password !== "string") {
    throw new BadRequestError("Password is missing or is not a string");
  }
  try {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    
    const newHashedPassword = await hashPassword(req.body.password);
    const newUser = await updateUserPassword(userId, req.body.email, newHashedPassword);
    const sanitizedUser: UserResponse = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt ?? new Date(),
      updatedAt: newUser.updatedAt ?? new Date(),
  } satisfies UserResponse;
  respondWithJSON(res, 200, sanitizedUser);
  } catch (e) {
    respondWithError(res, 401, "Invalid token");
  }
}
