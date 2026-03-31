export class BadRequest extends Error {
    constructor(message) {
        super(message);
    }
}
export class Unauthorized extends Error {
    constructor(message) {
        super(message);
    }
}
export class Forbidden extends Error {
    constructor(message) {
        super(message);
    }
}
export class NotFound extends Error {
    constructor(message) {
        super(message);
    }
}
export function middlewareError(err, req, res, next) {
    if (err instanceof BadRequest) {
        res.status(400).send({ error: err.message });
    }
    else if (err instanceof Unauthorized) {
        res.status(401).send({ error: err.message });
    }
    else if (err instanceof Forbidden) {
        res.status(403).send({ error: err.message });
    }
    else if (err instanceof NotFound) {
        res.status(404).send({ error: err.message });
    }
    else {
        res.status(500).send({ error: "Internal Server Error" });
    }
}
