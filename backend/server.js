import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import destinations from "./data/destinations.js";
import countries from "./data/countries.js";
import aiRoutes from "./routes/ai.js";

console.log("API KEY loaded:", process.env.OPENAI_API_KEY?.slice(0, 10));

const app = express();

app.use(cors());
app.use(express.json());

app.get("/destinations", (req, res) => {
  res.json(destinations);
});

app.get("/countries", (req, res) => {
  res.json(countries);
});

app.use("/ai", aiRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Travel API running on http://localhost:${PORT}`);
});