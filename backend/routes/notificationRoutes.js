import express from "express";
import {
  createSystemNotification,
  getNotifications,
  markNotificationRead
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/notifications", protect, getNotifications);
router.post("/notifications", protect, createSystemNotification);
router.patch("/notifications/:id/read", protect, markNotificationRead);

export default router;
