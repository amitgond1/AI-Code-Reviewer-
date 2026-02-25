import Review from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [summary] = await Review.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageScore: { $avg: "$score" },
        bestScore: { $max: "$score" },
        worstScore: { $min: "$score" }
      }
    }
  ]);

  const reviewsPerDay = await Review.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 },
        avgScore: { $avg: "$score" }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", count: 1, avgScore: { $round: ["$avgScore", 2] } } }
  ]);

  const languagesUsed = await Review.aggregate([
    { $match: { userId } },
    { $group: { _id: "$language", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, language: "$_id", count: 1 } }
  ]);

  return res.status(200).json({
    summary: {
      totalReviews: summary?.totalReviews || 0,
      averageScore: summary?.averageScore ? Number(summary.averageScore.toFixed(2)) : 0,
      bestScore: summary?.bestScore || 0,
      worstScore: summary?.worstScore || 0
    },
    reviewsPerDay,
    languagesUsed
  });
});
