import { Router } from "express";
import { reviewController } from "../controllers/review.controller";

const router = Router();

router.post("/", reviewController);

export default router;