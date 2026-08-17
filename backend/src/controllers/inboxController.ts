import type { Request, Response, NextFunction } from "express";
import { createInboxItem } from "../services/inboxService.js";

export async function createItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, priority } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Title is required.",
        });
    }

    const item = await createInboxItem(
        req.user!.id,
        title,
        priority
    );

    return res.status(201).json({
        item,
    });
  } catch (error) {
    next(error);
  }
}