import User from "../models/User.js";
import Review from "../models/Review.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage,
  totalReviews: user.totalReviews,
  averageScore: user.averageScore,
  createdAt: user.createdAt
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.status(200).json({ user: sanitizeUser(user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }
    user.email = email;
  }

  if (req.file) {
    user.profileImage = `/uploads/${req.file.filename}`;
  }

  await user.save();

  return res.status(200).json({
    message: "Profile updated",
    user: sanitizeUser(user)
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Invalid password payload" });
  }

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  await Notification.create({
    userId: user._id,
    title: "Password Changed",
    message: "Your password was updated successfully.",
    type: "info"
  });

  return res.status(200).json({ message: "Password changed" });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await Promise.all([
    Review.deleteMany({ userId: req.user._id }),
    Notification.deleteMany({ userId: req.user._id }),
    User.findByIdAndDelete(req.user._id)
  ]);

  res.clearCookie("token");

  return res.status(200).json({ message: "Account deleted" });
});
