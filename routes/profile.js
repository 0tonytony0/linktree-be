const express = require("express");
const {
  createUserProfile,
  updateUserProfile,
  getProfileData,
  getProfileDataFromId,
  updateLinkData,
  getProfileAnalytics,
} = require("../controllers/profileController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Profile Routes
router.post("/", authMiddleware, createUserProfile);
router.put("/", authMiddleware, updateUserProfile);
router.get("/", authMiddleware, getProfileData);
router.get("/analytics", authMiddleware, getProfileAnalytics);

router.get("/:id", getProfileDataFromId);
router.put("/link/:id", authMiddleware, updateLinkData);
module.exports = router;
