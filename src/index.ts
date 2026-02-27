import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/middleware.js";
import { handlerServerHitsCount } from "./api/metrics.js";
import { handlerResetUsersCount } from "./api/users.js";
import { middlewareMetricsInc, errorMiddleware } from "./api/middleware.js";
import { handlerCreateChirps, handlerGetChirps, handlerGetChirpById } from "./api/chirps.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { config } from "./config.js";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerCreateUser } from "./api/users.js";

// Run migrations via drizzle ORM before starting the server
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use(express.json()); // express.json() lets us not have to parse JSON bodies ourselves (str buffer)

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.get("/admin/metrics", async (req, res, next) => {
    Promise.resolve(handlerServerHitsCount(req, res)).catch(next);
}, express.static("./admin/metrics"));

app.post("/admin/reset", async (req, res, next) => {
    Promise.resolve(handlerResetUsersCount(req, res)).catch(next);
});

app.post("/api/users", async (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
});

app.post("/api/chirps", async (req, res, next) => {
    Promise.resolve(handlerCreateChirps(req, res)).catch(next);
});

app.get("/api/chirps", async (req, res, next) => {
    Promise.resolve(handlerGetChirps(req, res)).catch(next);
});

app.get("/api/chirps/:chirpId", async (req, res, next) => {
    Promise.resolve(handlerGetChirpById(req, res)).catch(next);
});


app.use(errorMiddleware);



app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});

