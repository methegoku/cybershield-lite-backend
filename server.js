import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { generateSecurity } from "./controllers/aiController.controller.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// AI Routes
app.use("/api/ai/generate/website/security", generateSecurity);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
