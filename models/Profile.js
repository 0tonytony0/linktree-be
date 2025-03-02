const mongoose = require("mongoose");

const linksSchema = new mongoose.Schema({
  title: {
    type: string,
    required: true,
  },
  url: {
    type: string,
    required: true,
  },
});

const shopSchema = new mongoose.Schema({
  title: {
    type: string,
    required: true,
  },
  url: {
    type: string,
    required: true,
  },
});

const profileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    background_color: {
      type: String,
    },
    links: [linksSchema],
    shops: [shopSchema],
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
