import { Router } from "express";
import { createItem } from "../controllers/inboxController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/", requireAuth, createItem);

export default router;