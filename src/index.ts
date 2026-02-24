import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/middleware.js";
import { handlerServerHitsCount } from "./api/serverHitsCount.js";
import { handlerResetServerHitsCount } from "./api/resetServerHitsCount.js";
import { middlewareMetricsInc } from "./api/middleware.js";
import { handlerValidateChirp } from "./api/validateChirp.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerServerHitsCount, express.static("./admin/metrics"));
app.post("/admin/reset", handlerResetServerHitsCount);
app.post("/api/validate_chirp", handlerValidateChirp);



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

