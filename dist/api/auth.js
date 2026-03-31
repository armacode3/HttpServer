import argon2 from "argon2";
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
