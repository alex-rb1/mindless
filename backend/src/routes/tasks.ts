import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { createTaskItem } from "../controllers/taskController.js";

const router = Router();

router.post("/", requireAuth, createTaskItem);

export default router;