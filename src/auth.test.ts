import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "../src/auth";
import { UnauthorizedError } from "../src/api/errors";
import { config } from "../src/config";

describe("Password Hashing", () =>
{
    const password1 = "correctPassword123!";
    const password2 = "incorrectPassword123!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });

    it("should return false for the incorrect hash/password", async () => {
        const result = await checkPasswordHash(password1, hash2);
        expect(result).toBe(false);
    });
});

describe("JWT", () => {
    const userID1 = "df7c3d50-8959-491b-9dc1-9902474b47f0";
    const secret1 = "qv#*SMBnAqK_iMhbxN[>GQ+!+AWC$dt1";
    const secret2 = "qv#*SMBnAqK_iMhbxN[>GQ+!+AWC$dt2";
    let token1: string;

    beforeAll(async () => {
        token1 = makeJWT(userID1, config.jwt.expiresIn, secret1);
    });

    it("should return the userID for the correct token", () => {
        const result = validateJWT(token1, secret1);
        expect(result).toBe(userID1);
    });

    it("should throw an error for the incorrect secret", () => {
        expect(() => validateJWT(token1, secret2)).toThrow(UnauthorizedError);
    });
});