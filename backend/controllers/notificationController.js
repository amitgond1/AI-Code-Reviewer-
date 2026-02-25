import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return res.status(200).json({ notifications, unreadCount });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  return res.status(200).json({ notification });
});

export const createSystemNotification = asyncHandler(async (req, res) => {
  const { title, message, type = "info" } = req.body;

  const notification = await Notification.create({
    userId: req.user._id,
    title: title || "Platform Update",
    message: message || "New feature added to AI Code Reviewer.",
    type
  });

  return res.status(201).json({ notification });
});
