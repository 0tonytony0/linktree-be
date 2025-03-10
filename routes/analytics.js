const express = require("express");
const router = express.Router();
const Analytics = require("../models/Analytics");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");


// 1) Track a click/view
router.post("/track", async (req, res) => {
  try {
    const { linkId } = req.body;

    // Get IP
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Cookie ID if using cookie-parser
    const cookieId = req.cookies?.trackingId || null;

    // Referrer
    const referrer = req.headers.referer || "direct";

    // Geo lookup
    const geo = geoip.lookup(ip) || {};
    const country = geo.country || "Unknown";
    const city = geo.city || "Unknown";

    // User Agent => device type
    const parser = new UAParser(req.headers["user-agent"]);
    const uaResult = parser.getResult();
    let deviceType = "desktop";
    if (uaResult.device.type === "mobile") deviceType = "mobile";
    else if (uaResult.device.type === "tablet") deviceType = "tablet";

    // If you want to count *every* click, remove this check.
    // const existing = await Analytics.findOne({ linkId, ip, cookieId });
    // if (!existing) {
    //   await Analytics.create({
    //     linkId,
    //     ip,
    //     cookieId,
    //     userAgent: req.headers["user-agent"],
    //     deviceType,
    //     country,
    //     city,
    //     referrer,
    //   });
    // }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2) Get aggregated analytics
router.get("/dashboard", async (req, res) => {
  try {
    // parse date range from query
    const { startDate, endDate } = req.query;
    let matchStage = {};

    if (startDate && endDate) {
      matchStage = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    // Promise.all to run multiple aggregations in parallel
    const [trafficByDevice, trafficByReferrer, clicksOverTime] =
      await Promise.all([
        // a) Group by deviceType
        Analytics.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: "$deviceType",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),

        // b) Group by referrer
        Analytics.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: "$referrer",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),

        // c) Group by month (clicks over time)
        Analytics.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
      ]);

    res.json({
      success: true,
      data: {
        trafficByDevice,
        trafficByReferrer,
        clicksOverTime,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
