const sharp = require("sharp");

const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 800 }) // Resize to max width 800px
      .jpeg({ quality: 70 }) // Compress with 70% quality
      .toBuffer();

    req.file.buffer = buffer;
    next();
  } catch (err) {
    console.error("Image Compression Error:", err);
    res.status(500).json({ message: "Error processing image" });
  }
};

module.exports = { compressImage };
