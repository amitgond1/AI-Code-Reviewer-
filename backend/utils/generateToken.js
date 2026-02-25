import jwt from "jsonwebtoken";

export const generateToken = (payload, rememberMe = false) => {
  const expiresIn = rememberMe
    ? process.env.JWT_EXPIRES_IN_LONG || "7d"
    : process.env.JWT_EXPIRES_IN_SHORT || "1d";

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};
