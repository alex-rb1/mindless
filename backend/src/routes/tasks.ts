import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { createTaskItem, getTaskItems } from "../controllers/taskController.js";

const router = Router();

router.post("/", requireAuth, createTaskItem);

router.get("/", requireAuth, getTaskItems);

export default router;