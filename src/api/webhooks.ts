import { Response, Request } from "express";
import { NotFound, Unauthorized } from "./errors.js";
import { upgradeUser } from "../db/queries/users.js";
import { config } from "../config.js";
import { getAPIKey } from "../auth.js";

export async function handlerUpgrade(req: Request, res: Response) {
     const apiKey = getAPIKey(req);

    if (apiKey !== config.apiConfig.polkakey) {
        throw new Unauthorized("Unauthorized");
    }
    
    const params = req.body;

    if (params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }

    const user = await upgradeUser(params.data.userId);

    if (!user) {
        throw new NotFound("User not found");
    }

    res.status(204).send();
}