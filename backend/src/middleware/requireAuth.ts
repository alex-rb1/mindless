import type { Request, Response, NextFunction } from "express";
import {
  findSessionByToken,
  findUserById,
} from "../services/authService.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionToken = req.cookies.sessionToken;

  // 1. Make sure a cookie was sent
  if (!sessionToken) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  // 2. Find the session
  const session = await findSessionByToken(sessionToken);

  if (!session) {
    return res.status(401).json({
      error: "Invalid session.",
    });
  }

  // 3. Make sure the session hasn't expired
  if (session.expiresAt < new Date()) {
    return res.status(401).json({
      error: "Session expired.",
    });
  }

  const user = await findUserById(session.userId);

  if (!user) {
    return res.status(401).json({
      error: "Invalid session.",
    });
  }

  req.user = user;

  next();
}