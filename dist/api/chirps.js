import { BadRequest, Unauthorized } from "./errors.js";
import { createChirp, getChirps, getChirp } from "../db/queries/chirps.js";
import { validateJWT, getBearerToken } from "../auth.js";
import { config } from "../config.js";
export async function handlerChirpsCreate(req, res) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.apiConfig.secret);
    if (!userId) {
        throw new Unauthorized("Error: Could not validate user");
    }
    const { body } = req.body;
    if (typeof body !== "string") {
        throw new BadRequest("Chirp is required");
    }
    const profane = ["kerfuffle", "sharbert", "fornax"];
    let cleanedBody = [];
    if (body.length > 140) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }
    const splitBody = body.split(" ");
    for (let word of splitBody) {
        let lowWord = word.toLowerCase();
        if (profane.includes(lowWord)) {
            cleanedBody.push("****");
        }
        else {
            cleanedBody.push(word);
        }
    }
    const newBody = cleanedBody.join(" ");
    const result = await createChirp({ body: newBody, user_id: userId });
    res.status(201).send({ id: result.id, createdAt: result.createdAt, updatedAt: result.updatedAt, body: result.body, userId: result.user_id });
}
export async function handlerChirps(req, res) {
    const result = await getChirps();
    res.status(200).send(result);
}
export async function handlerGetChirp(req, res) {
    const { chirpId } = req.params;
    if (typeof chirpId !== "string") {
        throw new BadRequest("chirpId is of type string[] not string");
    }
    const result = await getChirp(chirpId);
    if (!result) {
        res.status(404);
        return;
    }
    res.status(200).send(result);
}
