const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link", 
    required: true,
  },
  ip: String,
  cookieId: String,
  userAgent: String,
  deviceType: String, // 'mobile', 'desktop', 'tablet'
  country: String,
  city: String,
  referrer: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
