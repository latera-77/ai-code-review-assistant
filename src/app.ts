import express from "express";
import cors from "cors";
import reviewRoute from "./routes/review.route";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/api/review", reviewRoute);

// test route (very important for checking)
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;