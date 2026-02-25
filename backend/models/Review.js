import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    linesOfCode: {
      type: Number,
      required: true
    },
    fileName: {
      type: String,
      default: ""
    },
    sourceType: {
      type: String,
      enum: ["paste", "upload", "github"],
      default: "paste"
    },
    githubRepo: {
      type: String,
      default: ""
    },
    bugs: {
      type: String,
      default: ""
    },
    improvements: {
      type: String,
      default: ""
    },
    time_complexity: {
      type: String,
      default: "Unknown"
    },
    space_complexity: {
      type: String,
      default: "Unknown"
    },
    better_code: {
      type: String,
      default: ""
    },
    code_smells: {
      type: String,
      default: ""
    },
    security_warnings: {
      type: String,
      default: ""
    },
    duplicate_code: {
      type: String,
      default: ""
    },
    performance_suggestions: {
      type: String,
      default: ""
    },
    naming_suggestions: {
      type: String,
      default: ""
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
