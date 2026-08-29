import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { createTaskItem, getTaskItems, updateTaskItem } from "../controllers/taskController.js";

const router = Router();

router.get("/", requireAuth, getTaskItems);
router.post("/", requireAuth, createTaskItem);
router.patch("/:id", requireAuth, updateTaskItem);

export default router;