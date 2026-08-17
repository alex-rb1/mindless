import type { Request, Response, NextFunction } from "express";
import { createInboxItem, getInboxItems } from "../services/inboxService.js";

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

export async function getItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const items = await getInboxItems(req.user!.id);

    return res.status(200).json({
      items,
    });
  } catch (error) {
    next(error);
  }
}