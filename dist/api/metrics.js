import { config } from "../config.js";
import { deleteUser } from "../db/queries/users.js";
export function middlewareMetricsInc(req, res, next) {
    config.apiConfig.fileServerHits += 1;
    next();
}
export function handlerMetrics(req, res) {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.apiConfig.fileServerHits} times!</p>
  </body>
</html>`);
}
export async function handlerReset(req, res) {
    if (config.apiConfig.platform !== "dev") {
        res.status(403).send("Forbidden");
        return;
    }
    config.apiConfig.fileServerHits = 0;
    await deleteUser();
    res.send();
}
