import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 120
    },
    message: {
      type: String,
      required: true,
      maxlength: 500
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info"
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
