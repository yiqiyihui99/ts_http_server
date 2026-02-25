import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/middleware.js";
import { handlerServerHitsCount } from "./api/serverHitsCount.js";
import { handlerResetServerHitsCount } from "./api/resetServerHitsCount.js";
import { middlewareMetricsInc } from "./api/middleware.js";
import { handlerValidateChirp } from "./api/validateChirp.js";
import { errorMiddleware } from "./api/errorMiddleware.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json()); // express.json() lets us not have to parse JSON bodies ourselves (str buffer)
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/admin/metrics", handlerServerHitsCount, express.static("./admin/metrics"));
app.post("/admin/reset", handlerResetServerHitsCount);
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", async (req, res, next) => {
    try {
        await handlerValidateChirp(req, res);
    } catch (e) {
        next(e);
    }
});
app.use(errorMiddleware);



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

