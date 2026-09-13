import jwt from "jsonwebtoken";

export const authCheck = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "key");

    req.decoded = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: err.message,
      message: "Invalid or expired token",
    });
  }
};