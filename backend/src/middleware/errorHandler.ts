// errorHandler.ts

import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(error)

  return res.status(500).json({
    error: "Internal server error.",
  });
};