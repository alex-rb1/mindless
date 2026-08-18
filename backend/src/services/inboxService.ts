import prisma from "../db/prisma.js";
import type { Priority } from "../generated/prisma/client.js";

export async function createInboxItem(
  userId: number,
  title: string,
  priority?: Priority
) {
  return prisma.inboxItem.create({
    data: {
        userId,
        title,
        priority: priority ?? null,
    },
  });
}

export async function getInboxItems(userId: number) {
  return prisma.inboxItem.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findInboxItemById(
  id: number,
  userId: number
) {
  return prisma.inboxItem.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function updateInboxItem(
  id: number,
  title: string,
  priority: Priority | null
) {
  return prisma.inboxItem.update({
    where: {
      id,
    },
    data: {
      title,
      priority,
    },
  });
}

export async function deleteInboxItem(id: number) {
  return prisma.inboxItem.delete({
    where: {
      id,
    },
  });
}