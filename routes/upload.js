const express = require("express");
const { uploadImage } = require("../controllers/uploadController");
const authMiddleware = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");
const { compressImage } = require("../middlewares/imageCompressMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  compressImage,
  upload.single("image"),
  uploadImage
);

module.exports = router;
