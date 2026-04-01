import { db } from "../index.js";
import { refresh_tokens } from "../schema.js";
import { eq } from "drizzle-orm";
export async function insertRefreshToken(token) {
    const [result] = await db.insert(refresh_tokens).values(token).returning();
    return result;
}
export async function getRefreshToken(token) {
    const [result] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token));
    return result;
}
export async function updateRefreshToken(token) {
    await db.update(refresh_tokens).set({ revokedAt: new Date(), updatedAt: new Date() }).where(eq(refresh_tokens.token, token));
}
