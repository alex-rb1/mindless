import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";

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