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