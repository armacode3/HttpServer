import { Response, Request } from "express";
import { BadRequest } from "./errors.js";
import { createChirp, getChirps, getChirp } from "../db/queries/chirps.js";
import { error } from "node:console";

export async function handlerChirpsCreate(req: Request, res: Response) {
    const profane = ["kerfuffle", "sharbert", "fornax"];
    
    let cleanedBody: string[] = [];

    if (req.body.body.length > 140) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }

    const splitBody = req.body.body.split(" ");

    for (let word of splitBody) {
        let lowWord = word.toLowerCase();

        if (profane.includes(lowWord)) {
            cleanedBody.push("****");
        } else {
            cleanedBody.push(word);
        }
    }

    const newBody = cleanedBody.join(" ");

    const result = await createChirp({ body: newBody, user_id: req.body.userId});

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
        res.status(404);
        return;
    }

    res.status(200).send(result);
}