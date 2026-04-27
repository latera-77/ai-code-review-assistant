import { Request, Response } from "express";

export const reviewController = (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      error: "Code is required"
    });
  }

  return res.json({
    message: "Code received successfully",
    code
  });
};