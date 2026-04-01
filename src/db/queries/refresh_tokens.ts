import { db } from "../index.js";
import { NewRefreshToken, refresh_tokens } from "../schema.js";
import { eq } from "drizzle-orm";

export async function insertRefreshToken(token: NewRefreshToken) {
    const [result] = await db.insert(refresh_tokens).values(token).returning()
    return result;
}

export async function getRefreshToken(token: string) {
    const [result] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token));
    return result;
}

export async function updateRefreshToken(token: string) {
    await db.update(refresh_tokens).set({ revokedAt: new Date(), updatedAt: new Date() }).where(eq(refresh_tokens.token, token));
}   