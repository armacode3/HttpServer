import { Response, Request } from "express";
import { createUser, getUser } from "../db/queries/users.js"
import { BadRequest, Unauthorized } from "./errors.js";
import { hashPassword, checkPasswordHash } from "../auth.js";

export async function handlerUsers(req: Request, res: Response) {
    const { password, email } = req.body;

    if (email === undefined || password === undefined) {
        throw new BadRequest("Error occurred in adding user");
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({email, hashedPassword});
    if (user === undefined) {
        throw new BadRequest("Error occurred in adding user");
    }
    res.status(201).send({ id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt });
}


export async function handlerLogin(req: Request, res: Response) {
    const { password, email } = req.body;


    const user = await getUser(email);

    if (user == undefined) {
        throw new Unauthorized("Incorrect email or password");
    }
    
    if (await checkPasswordHash(password, user.hashedPassword)) {
        res.status(200).send({ id: user.id, createdAt: user.createdAt, updatedAt: user.updatedAt, email: user.email })
    } else {
        throw new Unauthorized("Incorrect email or password");
    }
}
