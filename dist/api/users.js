import { createUser, getUser } from "../db/queries/users.js";
import { insertRefreshToken, getRefreshToken, updateRefreshToken } from "../db/queries/refresh_tokens.js";
import { BadRequest, Unauthorized } from "./errors.js";
import { hashPassword, checkPasswordHash, makeJWT, makeRefreshToken, getBearerToken } from "../auth.js";
import { config } from "../config.js";
export async function handlerUsers(req, res) {
    const { password, email } = req.body;
    if (email === undefined || password === undefined) {
        throw new BadRequest("Error occurred in adding user");
    }
    const hashedPassword = await hashPassword(password);
    const user = await createUser({ email, hashedPassword });
    if (user === undefined) {
        throw new BadRequest("Error occurred in adding user");
    }
    res.status(201).send({ id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt });
}
export async function handlerLogin(req, res) {
    const { password, email } = req.body;
    if (email === undefined || password === undefined) {
        throw new BadRequest("Error occurred in logging in");
    }
    const expiresInSeconds = 3600;
    const user = await getUser(email);
    if (user == undefined) {
        throw new Unauthorized("Incorrect email or password");
    }
    const passwordMatches = await checkPasswordHash(password, user.hashedPassword);
    if (!passwordMatches) {
        throw new Unauthorized("Incorrect email or password");
    }
    const token = makeJWT(user.id, expiresInSeconds, config.apiConfig.secret);
    const refreshToken = makeRefreshToken();
    const result = await insertRefreshToken({ token: refreshToken, user_id: user.id, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), revokedAt: null });
    res.status(200).send({ id: user.id, createdAt: user.createdAt, updatedAt: user.updatedAt, email: user.email, token: token, refreshToken: refreshToken });
}
export async function handlerRefesh(req, res) {
    const token = getBearerToken(req);
    const refreshToken = await getRefreshToken(token);
    if ((refreshToken === undefined) || (refreshToken.expiresAt < new Date()) || (refreshToken.revokedAt !== null)) {
        throw new Unauthorized("Refresh token is not validated");
    }
    const newToken = makeJWT(refreshToken.user_id, 3600, config.apiConfig.secret);
    res.status(200).send({ token: newToken });
}
export async function handlerRevoke(req, res) {
    const token = getBearerToken(req);
    await updateRefreshToken(token);
    res.status(204).send();
}
