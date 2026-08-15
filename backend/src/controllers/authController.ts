import type { Request, Response } from "express";
import { findUserByEmail, hashPassword, createUser } from "../services/authService.js";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser(name, email, passwordHash);


  if (!name || !email || !password) {
    return res.status(400).json({ 
        error: "Name, email, and password are required." 
    });
  }

  return res.status(201).json({
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
    },
  });
}