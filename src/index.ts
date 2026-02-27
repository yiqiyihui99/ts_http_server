import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/middleware.js";
import { handlerServerHitsCount } from "./api/serverHitsCount.js";
import { handlerResetUsersCount } from "./api/resetUsersCount.js";
import { middlewareMetricsInc } from "./api/middleware.js";
import { handlerCreateChirps } from "./api/createChirp.js";
import { handlerGetChirps } from "./api/getChirps.js";
import { errorMiddleware } from "./api/errorMiddleware.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { config } from "./config.js";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerCreateUser } from "./api/createUser.js";

// Run migrations via drizzle ORM before starting the server
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use(express.json()); // express.json() lets us not have to parse JSON bodies ourselves (str buffer)

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", async (req, res, next) => {
    Promise.resolve(handlerServerHitsCount(req, res)).catch(next);
}, express.static("./admin/metrics"));

app.post("/admin/reset", async (req, res, next) => {
    Promise.resolve(handlerResetUsersCount(req, res)).catch(next);
});

app.get("/api/healthz", async (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.post("/api/chirps", async (req, res, next) => {
    Promise.resolve(handlerCreateChirps(req, res)).catch(next);
});

app.get("/api/chirps", async (req, res, next) => {
    Promise.resolve(handlerGetChirps(req, res)).catch(next);
});

app.post("/api/users", async(req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
});


app.use(errorMiddleware);



app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});

