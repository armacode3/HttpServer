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
export async function updateUser(userId, email, hashedPassword) {
    const [result] = await db.update(users).set({ email: email, hashedPassword: hashedPassword, updatedAt: new Date() }).where(eq(users.id, userId)).returning({ id: users.id, email: users.email, createdAt: users.createdAt, updatedAt: users.updatedAt });
    return result;
}
