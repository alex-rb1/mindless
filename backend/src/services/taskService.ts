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