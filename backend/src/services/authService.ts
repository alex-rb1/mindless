import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";
import { randomBytes } from "crypto";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email: email
    }
  });
}

export async function hashPassword(password: string) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
) {
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash
    }
  });
}

export async function comparePassword(
  password: string,
  passwordHash: string
) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(userId: number) {
    const token = randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return prisma.session.create({
        data: {
            token,
            userId,
            expiresAt
        }
    });
}