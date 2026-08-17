import { Router } from "express";
import { createItem, getItems } from "../controllers/inboxController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/", requireAuth, createItem);
router.get("/", requireAuth, getItems);

export default router;