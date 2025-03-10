const mongoose = require("mongoose");

const linksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  device: {
    Tablet: { type: Number, default: 0 },
    Mobile: { type: Number, default: 0 },
    Desktop: { type: Number, default: 0 },
  },
  clickTimestamps: [{ type: Date }],
});

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  device: {
    Tablet: { type: Number, default: 0 },
    Mobile: { type: Number, default: 0 },
    Desktop: { type: Number, default: 0 },
  },
  clickTimestamps: [{ type: Date }],
});

const appreanceSchema = new mongoose.Schema({
  layout: {
    type: String,
  },
  buttonStyle: {
    type: String,
  },
  buttonColor: {
    type: String,
  },
  buttonFontColor: {
    type: String,
  },
  font: {
    type: String,
  },
  fontColor: {
    type: String,
  },
  theme: {
    type: String,
  },
  backgroundColor: {
    type: String,
  },
});

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
    },
    avatar: {
      type: String,
    },
    background_color: {
      type: String,
    },
    links: [linksSchema],
    shops: [shopSchema],
    appreance: appreanceSchema,
    banner: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
