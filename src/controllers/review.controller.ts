import { Request, Response } from "express";
import { reviewCode } from "../services/ai.service";

export const reviewController = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      error: "Code is required"
    });
  }
  const review = await reviewCode(code);

  return res.json({
    message: "AI review generated,",
    review,
  });
  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
};