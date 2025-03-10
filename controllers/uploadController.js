const { cloudinary } = require("../config/cloudinary");

const uploadImage = async (req, res, next) => {
  try {
    console.log("inside uploadImage");
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("uploading to cloudinary ");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    res
      .status(200)
      .json({ message: "Image uploaded", imageUrl: result.secure_url });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    next(err);
  }
};

module.exports = { uploadImage };
