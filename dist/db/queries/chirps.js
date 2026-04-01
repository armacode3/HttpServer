import { db } from "../index.js";
import { chirps } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createChirp(chirp) {
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
}
export async function getChirps() {
    const result = await db.select().from(chirps).orderBy(chirps.createdAt);
    return result;
}
export async function getChirp(chirpId) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    return result;
}
export async function deleteChirp(chirpId) {
    await db.delete(chirps).where(eq(chirps.id, chirpId));
}
