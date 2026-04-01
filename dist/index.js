import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/responses.js";
import { middlewareMetricsInc, handlerMetrics, handlerReset } from "./api/metrics.js";
import { handlerChirpsCreate, handlerChirps, handlerGetChirp } from "./api/chirps.js";
import { middlewareError } from "./api/errors.js";
import { handlerUsers, handlerLogin, handlerRefesh, handlerRevoke } from "./api/users.js";
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(middlewareLogResponses);
app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.get("/api/chirps", async (req, res, next) => {
    try {
        await handlerChirps(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.get("/api/chirps/:chirpId", async (req, res, next) => {
    try {
        await handlerGetChirp(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerReset(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/api/chirps", async (req, res, next) => {
    try {
        await handlerChirpsCreate(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/api/users", async (req, res, next) => {
    try {
        await handlerUsers(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/api/login", async (req, res, next) => {
    try {
        await handlerLogin(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/api/refresh", async (req, res, next) => {
    try {
        await handlerRefesh(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post("/api/revoke", async (req, res, next) => {
    try {
        await handlerRevoke(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareError);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
