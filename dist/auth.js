import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
export async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password);
        return hash;
    }
    catch (err) {
        throw new Error("Hashing Error");
    }
}
export async function checkPasswordHash(password, hash) {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        throw new Error("Error Verfiying");
    }
}
export function makeJWT(userID, expiresIn, secret) {
    const payload = {
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
    };
    const options = {
        expiresIn: expiresIn,
    };
    return jwt.sign(payload, secret, options);
}
export function validateJWT(tokenString, secret) {
    try {
        const decoded = jwt.verify(tokenString, secret);
        return decoded.sub || "";
    }
    catch {
        return "";
    }
}
export function getBearerToken(req) {
    const token = req.get("Authorization")?.trim();
    if (token == undefined) {
        return "";
    }
    const split = token.split(/\s+/);
    if (split.length !== 2 || split[0].toLowerCase() !== "bearer") {
        return "";
    }
    return split[1].trim();
}
export function makeRefreshToken() {
    const buf = randomBytes(256).toString('hex');
    return buf;
}
