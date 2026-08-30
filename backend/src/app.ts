import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import inboxRouter from "./routes/inbox.js";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/tasks.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requireAuth } from "./middleware/requireAuth.js";

const FRONTEND_URL =
  process.env.FRONTEND_URL ?? "http://localhost:3000";

const app = express();

// General middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/inbox", inboxRouter);
app.use("/tasks", taskRouter);

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);

app.get("/protected", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated.",
    user: {
      id: req.user!.id,
      name: req.user!.name,
      email: req.user!.email,
    },
  });
});

// Error middleware — last
app.use(errorHandler);

export default app;