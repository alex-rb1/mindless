import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { createTaskItem, getTaskItems, updateTaskItem, deleteTaskItem, processInboxItemToTask } from "../controllers/taskController.js";

const router = Router();

router.get("/", requireAuth, getTaskItems);
router.post("/", requireAuth, createTaskItem);
router.patch("/:id", requireAuth, updateTaskItem);
router.delete("/:id", requireAuth, deleteTaskItem);

router.post(
    "/process/:id",
    requireAuth,
    processInboxItemToTask
)

export default router;