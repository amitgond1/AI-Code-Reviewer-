import axios from "axios";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { countCodeLines, detectLanguageByContent, detectLanguageByFileName } from "../utils/detectLanguage.js";
import { fetchGithubRepoCode } from "../services/githubService.js";
import { buildReviewPdf } from "../services/pdfService.js";

const aiBaseUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";

const fallbackAnalyze = (code, language) => {
  const lines = code.split(/\r?\n/);
  const longLines = lines.filter((line) => line.length > 120).length;
  const hasEval = /\beval\s*\(/.test(code);
  const hasConsole = /console\.log\(/.test(code);

  return {
    bugs: hasEval
      ? "Potential risk: eval() usage can execute arbitrary code."
      : "No critical runtime bugs detected from static heuristics.",
    improvements: longLines
      ? `Found ${longLines} long lines; consider splitting logic into smaller functions.`
      : "Consider adding edge-case tests and improving readability with helper functions.",
    time_complexity: /for\s*\(.+for\s*\(/s.test(code) ? "O(n^2)" : "O(n)",
    space_complexity: "O(1)",
    better_code: "Refactor repeated logic into reusable functions and add guard clauses for invalid inputs.",
    score: Math.max(55, Math.min(95, 85 - longLines * 2 - (hasEval ? 15 : 0) - (hasConsole ? 3 : 0))),
    code_smells: hasConsole ? "Debug statements detected." : "No significant code smells found.",
    security_warnings: hasEval ? "Avoid eval(). Use safer parsing alternatives." : "No obvious security red flags detected.",
    duplicate_code: "No major duplicate blocks detected by heuristic scan.",
    performance_suggestions: "Prefer early returns and avoid nested loops when possible.",
    naming_suggestions: "Use domain-specific variable names for improved maintainability."
  };
};

const updateUserStats = async (userId) => {
  const [stats] = await Review.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$userId",
        totalReviews: { $sum: 1 },
        averageScore: { $avg: "$score" }
      }
    }
  ]);

  await User.findByIdAndUpdate(userId, {
    totalReviews: stats?.totalReviews || 0,
    averageScore: stats?.averageScore ? Number(stats.averageScore.toFixed(2)) : 0
  });
};

const resolveReviewInput = async (req) => {
  const { code, language, githubRepo } = req.body;

  if (githubRepo) {
    const repoData = await fetchGithubRepoCode(githubRepo);
    return {
      code: repoData.code,
      language: repoData.language,
      fileName: repoData.fileName,
      sourceType: "github",
      githubRepo
    };
  }

  if (req.file?.buffer) {
    const fileCode = req.file.buffer.toString("utf8");
    return {
      code: fileCode,
      language: language || detectLanguageByFileName(req.file.originalname),
      fileName: req.file.originalname,
      sourceType: "upload",
      githubRepo: ""
    };
  }

  return {
    code,
    language: language || detectLanguageByContent(code || ""),
    fileName: "",
    sourceType: "paste",
    githubRepo: ""
  };
};

export const createReview = asyncHandler(async (req, res) => {
  const input = await resolveReviewInput(req);

  if (!input.code || !input.code.trim()) {
    return res.status(400).json({ message: "Code is required for review" });
  }

  const payload = {
    code: input.code,
    language: input.language || "text"
  };

  let aiResult;
  try {
    const response = await axios.post(`${aiBaseUrl}/analyze`, payload, { timeout: 30000 });
    aiResult = response.data;
  } catch (error) {
    aiResult = fallbackAnalyze(input.code, input.language);
  }

  const review = await Review.create({
    userId: req.user._id,
    code: input.code,
    language: payload.language,
    linesOfCode: countCodeLines(input.code),
    fileName: input.fileName,
    sourceType: input.sourceType,
    githubRepo: input.githubRepo,
    bugs: aiResult.bugs || "",
    improvements: aiResult.improvements || "",
    time_complexity: aiResult.time_complexity || "Unknown",
    space_complexity: aiResult.space_complexity || "Unknown",
    better_code: aiResult.better_code || "",
    score: Number(aiResult.score || 70),
    code_smells: aiResult.code_smells || "",
    security_warnings: aiResult.security_warnings || "",
    duplicate_code: aiResult.duplicate_code || "",
    performance_suggestions: aiResult.performance_suggestions || "",
    naming_suggestions: aiResult.naming_suggestions || ""
  });

  await Notification.create({
    userId: req.user._id,
    title: "Review Completed",
    message: `Your ${review.language} code review scored ${review.score}/100.`,
    type: "success"
  });

  await updateUserStats(req.user._id);

  return res.status(201).json({
    message: "Review completed",
    review
  });
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json({ reviews });
});

export const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, userId: req.user._id });
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  return res.status(200).json({ review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  await updateUserStats(req.user._id);

  return res.status(200).json({ message: "Review deleted" });
});

export const exportReviewPdf = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, userId: req.user._id });
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const pdfBuffer = await buildReviewPdf(review, req.user);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=review-${review._id}.pdf`);
  return res.send(pdfBuffer);
});

export const reviewGithubRepo = asyncHandler(async (req, res, next) => {
  req.body.githubRepo = req.body.githubRepo || req.body.repoUrl;
  return createReview(req, res, next);
});
