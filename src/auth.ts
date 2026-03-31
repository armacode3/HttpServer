import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string) {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        throw new Error("Hashing Error");
    }
}

export async function checkPasswordHash(password: string, hash: string) {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw new Error("Error Verfiying");
    }
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const payload = {
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
    };

    const options = {
        expiresIn: expiresIn,
    };

    return jwt.sign(payload, secret, options);
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const decoded = jwt.verify(tokenString, secret) as JwtPayload;
        return decoded.sub || "";
    } catch {
        console.error("JWT Validation Error");
        return "";
    }
}

function getBearerToken(req: Request): string {
    const 
}