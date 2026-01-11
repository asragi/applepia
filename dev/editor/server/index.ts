import cors from "cors";
import express from "express";
import mastersRouter from "./routes/masters.ts";
import relationsRouter from "./routes/relations.ts";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/masters", mastersRouter);
app.use("/api/relations", relationsRouter);

app.listen(PORT, () => {
	console.log(`API server running on http://localhost:${PORT}`);
});
