// errorHandler.ts

import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  return res.status(500).json({
    error: "Internal server error.",
  });
};