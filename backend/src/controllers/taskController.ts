import type { Request, Response, NextFunction } from "express";
import { createTask, getTasks, findTaskById, updateTask, deleteTask } from "../services/taskService.js";
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

export async function getTaskItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tasks = await getTasks(req.user!.id);

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTaskItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "Invalid task ID.",
      });
    }

    const existingTask = await findTaskById(
      id, 
      req.user!.id
    );

    if (!existingTask) {
      return res.status(404).json({
        error: "Task not found.",
      });
    }

    const {
      title,
      description,
      dueDate,
      priority,
      status,
    } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        error: "Title cannot be empty.",
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

    let parsedDueDate: Date | null | undefined;

    if (dueDate === null) {
      parsedDueDate = null;
    } else if (dueDate !== undefined) {
      parsedDueDate = new Date(dueDate);

      if (Number.isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({
          error: "Invalid due date."
        })
      }
    }

    const task = await updateTask(id, {
      ...(title !== undefined && {title: title.trim() }),
      ...(description !== undefined && { description }),
      ...(parsedDueDate !== undefined && { dueDate: parsedDueDate }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
    })

    return res.status(200).json({
      task,
    });

  } catch (error) {
    next(error);
  }
}

export async function deleteTaskItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "Invalid task ID.",
      });
    }

    const existingTask = await findTaskById(
      id,
      req.user!.id
    );

    if (!existingTask) {
      return res.status(404).json({
        error: "Task not found.",
      });
    }

    await deleteTask(id);

    return res.status(200).json({
      message: "Task deleted.",
    });
  } catch (error) {
    next(error);
  }
}