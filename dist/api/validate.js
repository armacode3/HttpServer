import { BadRequest } from "./errors.js";
export async function handlerValidate(req, res) {
    const profane = ["kerfuffle", "sharbert", "fornax"];
    let cleanedBody = [];
    if (req.body.body.length > 140) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }
    const splitBody = req.body.body.split(" ");
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
    res.status(200).send({ cleanedBody: newBody });
}
