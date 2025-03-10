const { verifyToken } = require("../services/auth");
const { findUserById } = require("../services/user");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authMiddleware;
