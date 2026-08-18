import type { Request, Response, NextFunction } from "express";
import { createInboxItem, getInboxItems, findInboxItemById, updateInboxItem, deleteInboxItem } from "../services/inboxService.js";

const validPriorities = ["LOW", "MEDIUM", "HIGH"];

export async function createItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, priority } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            error: "Title is required.",
        });
    }

    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({
            error: "Invalid priority value.",
        });
    }

    const item = await createInboxItem(
        req.user!.id,
        title.trim(),
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

export async function updateItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const { title, priority } = req.body;

    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "Invalid inbox item ID.",
        });
    }

    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({
            error: "Invalid priority value.",
        });
    }

    const existingItem = await findInboxItemById(
        id,
        req.user!.id
    );

    if (!existingItem) {
        return res.status(404).json({
            error: "Inbox item not found.",
        });
    }

    if (!title || !title.trim()) {
        return res.status(400).json({
            error: "Title is required.",
        });
    }

    const updatedItem = await updateInboxItem(
        id,
        title.trim(),
        priority ?? null
    );

    return res.status(200).json({
        item: updatedItem,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "Invalid inbox item ID.",
      });
    }

    const existingItem = await findInboxItemById(
      id,
      req.user!.id
    );

    if (!existingItem) {
      return res.status(404).json({
        error: "Inbox item not found.",
      });
    }

    await deleteInboxItem(id);

    return res.status(200).json({
      message: "Inbox item deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}