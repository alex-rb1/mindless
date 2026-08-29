import type {
  Priority,
  TaskStatus,
} from "../generated/prisma/client.js";

import prisma from "../db/prisma.js";

type CreateTaskData = {
  userId: number;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  status?: TaskStatus;
};

export async function createTask(data: CreateTaskData) {
    return prisma.task.create({
        data: {
            userId: data.userId,
            title: data.title,
            description: data.description ?? null,
            dueDate: data.dueDate ?? null,
            priority: data.priority ?? null,
            ...(data.status && { status: data.status }),
        },
    });
}

export async function getTasks(userId: number) {
    return prisma.task.findMany({
        where: {
            userId,
        },
        orderBy: {
          createdAt: "desc",
        },
    });
}

type UpdateTaskData = {
  title?: string;
  description?: string | null;
  dueDate?: Date | null;
  priority?: Priority | null;
  status?: TaskStatus;
}

export async function findTaskById(id: number, userId: number) {
  return prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function updateTask(
  id: number,
  data: UpdateTaskData
) {
  return prisma.task.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteTask(id: number) {
  return prisma.task.delete({
    where: {
      id,
    },
  })
}

type ProcessInboxData = {
  userId: number;
  inboxItemId: number;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  status?: TaskStatus;
};

export async function processInboxItem(data: ProcessInboxData) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description ?? null,
        dueDate: data.dueDate ?? null,
        priority: data.priority ?? null,
        ...(data.status && { status: data.status }),
      },
    });

    await tx.inboxItem.delete({
      where: {
        id: data.inboxItemId,
      },
    });

    return task;
  });
}