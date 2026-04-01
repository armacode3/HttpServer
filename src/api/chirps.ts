import { Response, Request } from "express";
import { BadRequest, Unauthorized, NotFound, Forbidden } from "./errors.js";
import { createChirp, getChirps, getChirp, deleteChirp } from "../db/queries/chirps.js";
import { validateJWT, getBearerToken } from "../auth.js"
import { config } from "../config.js";

export async function handlerChirpsCreate(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.apiConfig.secret);

    if (!userId) {
        throw new Unauthorized("Error: Could not validate user")
    }

    const { body } = req.body;

    if (typeof body !== "string") {
        throw new BadRequest("Chirp is required");
    }

    const profane = ["kerfuffle", "sharbert", "fornax"];
    
    let cleanedBody: string[] = [];

    if (body.length > 140) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }

    const splitBody = body.split(" ");

    for (let word of splitBody) {
        let lowWord = word.toLowerCase();

        if (profane.includes(lowWord)) {
            cleanedBody.push("****");
        } else {
            cleanedBody.push(word);
        }
    }

    const newBody = cleanedBody.join(" ");

    const result = await createChirp({ body: newBody, user_id: userId});

    res.status(201).send({ id: result.id, createdAt: result.createdAt, updatedAt: result.updatedAt, body: result.body, userId: result.user_id });
}

export async function handlerChirps(req: Request, res: Response) {
    const result = await getChirps();

    res.status(200).send(result);
}

export async function handlerGetChirp(req: Request, res: Response) {
    const { chirpId } = req.params;

    if (typeof chirpId !== "string") {
        throw new BadRequest("chirpId is of type string[] not string");
    }
    
    const result = await getChirp(chirpId);

    if (!result) {
        throw new NotFound("Chirp not found");
    }

    res.status(200).send(result);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
    const { chirpId } = req.params;

    if (typeof chirpId !== "string") {
        throw new BadRequest("Error occurred in chirp Id");
    }

    const token = getBearerToken(req);
    if (!token) {
        throw new Unauthorized("Missing or malformed access token");
    }

    const userId = validateJWT(token, config.apiConfig.secret);
    if (!userId) {
        throw new Unauthorized("Missing or malformed access token");
    }

    const chirp = await getChirp(chirpId);
    if (!chirp) {
        throw new NotFound("Chirp not found");
    }

    if(chirp.user_id !== userId) {
        throw new Forbidden("You cannot delete this chirp");
    }

    await deleteChirp(chirpId);

    res.status(204).send();
}