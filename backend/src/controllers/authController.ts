import type { Request, Response, NextFunction } from "express";
import { findUserByEmail, hashPassword, createUser, comparePassword, createSession } from "../services/authService.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required.",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await createUser(name, email, passwordHash);

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const passwordMatches = await comparePassword(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const session = await createSession(user.id);

    res.cookie("sessionToken", session.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: session.expiresAt,
    });

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function me(
  req: Request,
  res: Response
) {
  return res.status(200).json({
    user: {
      id: req.user!.id,
      name: req.user!.name,
      email: req.user!.email,
    },
  });
}