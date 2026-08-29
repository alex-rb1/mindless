import type { Request, Response, NextFunction } from "express";
import { createTask } from "../services/taskService.js";
import { create } from "node:domain";

const validPriorities = ["LOW", "MEDIUM", "HIGH"];
const validStatuses = ["TODO", "IN_PROGRESS", "COMPLETED"];

export async function createTaskItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
    } = req.body;

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

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status value.",
      });
    }

    let parsedDueDate: Date | undefined;

    if (dueDate) {
      parsedDueDate = new Date(dueDate);

      if (Number.isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({
          error: "Invalid due date.",
        });
      }
    }

    const task = await createTask({
      userId: req.user!.id,
      title: title.trim(),
      
      ...(description !== undefined && { description }),
      ...(parsedDueDate !== undefined && { dueDate: parsedDueDate }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
    });

    res.status(201).json({
      task,
    });

  } catch (error) {
    next(error);
  }
}