import express from "express";
import cors from "cors";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route (very important for checking)
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;