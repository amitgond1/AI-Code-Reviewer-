import express from "express";
import { changePassword, deleteAccount, getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProfileImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, uploadProfileImage.single("profileImage"), updateProfile);
router.put("/change-password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

export default router;
