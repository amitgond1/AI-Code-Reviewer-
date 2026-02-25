import crypto from "crypto";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

const tokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax"
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage,
  totalReviews: user.totalReviews,
  averageScore: user.averageScore,
  createdAt: user.createdAt
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken({ id: user._id }, true);

  res.cookie("token", token, {
    ...tokenCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(201).json({
    message: "Signup successful",
    token,
    user: sanitizeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe = false } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ id: user._id }, rememberMe);
  const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  res.cookie("token", token, {
    ...tokenCookieOptions,
    maxAge
  });

  return res.status(200).json({
    message: "Login successful",
    token,
    user: sanitizeUser(user)
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", tokenCookieOptions);
  return res.status(200).json({ message: "Logout successful" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires");
  if (!user) {
    return res.status(200).json({ message: "If your email exists, you will receive a reset link" });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 15;
  await user.save();

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your AI Code Reviewer password",
    html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 15 minutes.</p>`
  });

  return res.status(200).json({
    message: "If your email exists, you will receive a reset link",
    ...(process.env.NODE_ENV !== "production" ? { devResetToken: rawToken } : {})
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token || req.body.token;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  }).select("+resetPasswordToken +resetPasswordExpires +password");

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return res.status(200).json({ message: "Password reset successful" });
});

