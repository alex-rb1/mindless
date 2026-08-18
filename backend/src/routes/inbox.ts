import { Router } from "express";
import { createItem, getItems, updateItem } from "../controllers/inboxController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/", requireAuth, createItem);
router.get("/", requireAuth, getItems);
router.patch("/:id", requireAuth, updateItem);

export default router;