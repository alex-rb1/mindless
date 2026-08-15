import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);

export default app;