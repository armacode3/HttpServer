import { describe, it, expect, beforeAll, vi } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "../auth";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
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
});

describe("JWT Utilities", () => {
    const secret = "super-secret-key";
    const userID = "user-123";
    const expiresIn = 60;

    it("should generate a vlaid JWT and return the correct user ID", () => {
        const token = makeJWT(userID, expiresIn, secret);

        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);

        const result = validateJWT(token, secret);
        expect(result).toBe(userID);
    });

    it("should return an empty string for an invalid secret", () => {
        const token = makeJWT(userID, expiresIn, secret);
        const result = validateJWT(token, "wrong-secret");

        expect(result).toBe("");
    });

    it("should return an empty string for an expired token", () => {
        vi.useFakeTimers();

        const shortLivedToken = makeJWT(userID, 1, secret);

        vi.advanceTimersByTime(2000);

        const result = validateJWT(shortLivedToken, secret);
        expect(result).toBe("");

        vi.useRealTimers();
    });

    it("should return an empty string for a malformed token", () => {
        const result = validateJWT("not.a.real.token", secret);
        expect(result).toBe("");
    });
});