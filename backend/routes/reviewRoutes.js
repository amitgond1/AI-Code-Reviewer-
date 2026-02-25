import express from "express";
import {
  createReview,
  deleteReview,
  exportReviewPdf,
  getReviewById,
  getReviews,
  reviewGithubRepo
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadCodeFile } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/review", protect, uploadCodeFile.single("file"), createReview);
router.post("/review/github", protect, reviewGithubRepo);
router.get("/reviews", protect, getReviews);
router.get("/review/:id", protect, getReviewById);
router.delete("/review/:id", protect, deleteReview);
router.get("/review/:id/export", protect, exportReviewPdf);

export default router;
