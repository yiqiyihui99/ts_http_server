import { Request, Response } from "express";
import { BadRequestError, ForbiddenError } from "./errors.js";
import { createUser, deleteAllUsers } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
import { hashPassword } from "../auth.js";
import { NewUser } from "../db/schema.js";

// token is optional because it's not required for the user creation or login
export type UserResponse = Omit<NewUser, "hashedPassword"> & { token?: string };;

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
