import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createUser(user) {
    const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
    return result;
}
export async function deleteUser() {
    await db.delete(users);
    console.log("Table truncated successfully");
}
export async function getUser(email) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
}
