import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";

const aiBaseUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";

export const chatWithAI = asyncHandler(async (req, res) => {
  const { question, code = "", language = "text" } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  try {
    const response = await axios.post(`${aiBaseUrl}/chat`, {
      question,
      code,
      language
    });

    return res.status(200).json({ answer: response.data.answer });
  } catch {
    return res.status(200).json({
      answer:
        "Focus on readability, edge-case handling, and consistent naming. Extract repeated logic into functions and add tests for boundary conditions."
    });
  }
});
