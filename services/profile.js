const Profile = require("../models/Profile");

const createProfile = async (profileData) => {
  return await Profile.create(profileData);
};

const getProfileByUserId = async (userId) => {
  return await Profile.findOne({ user: userId }).lean();
};

const getProfileById = async (profileId) => {
  return await Profile.findById(profileId).lean();
};

const updateLinkById = async (userId, linkId, deviceType, isLink) => {
  try {
    // Validate deviceType
    const validDevices = ["Tablet", "Mobile", "Desktop"];
    if (!validDevices.includes(deviceType)) {
      throw new Error("Invalid device type");
    }

    // Update in a single query
    let updatedProfile = {};

    if (isLink) {
      updatedProfile = await Profile.findOneAndUpdate(
        { user: userId, "links._id": linkId },
        {
          $inc: {
            "links.$.clicks": 1,
            [`links.$.device.${deviceType}`]: 1,
          },
          $push: { "links.$.clickTimestamps": new Date() },
        },
        { new: true }
      );
    } else {
      updatedProfile = await Profile.findOneAndUpdate(
        { user: userId, "shops._id": linkId },
        {
          $inc: {
            "shops.$.clicks": 1,
            [`shops.$.device.${deviceType}`]: 1,
          },
          $push: { "shops.$.clickTimestamps": new Date() },
        },
        { new: true }
      );
    }

    if (!updatedProfile) {
      throw new Error("Profile or Link not found");
    }

    return updatedProfile;
  } catch (error) {
    console.error("Error updating link:", error.message);
    throw error;
  }
};

const updateProfileData = async (profileId, profileData) => {
  return await Profile.findByIdAndUpdate(profileId, profileData, {
    new: true,
  }).lean();
};

const getAnalyticsData = async (userId) => {
  try {
    console.log({ userId });
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return { message: "Profile not found", success: false };
    }

    const totalLinkClicks = profile.links.reduce(
      (sum, link) => sum + link.clicks,
      0
    );

    const totalShopClicks = profile.shops.reduce(
      (sum, shop) => sum + shop.clicks,
      0
    );

    const deviceClicks = profile.links.concat(profile.shops).reduce(
      (acc, item) => {
        acc.Tablet += item.device.Tablet;
        acc.Mobile += item.device.Mobile;
        acc.Desktop += item.device.Desktop;
        return acc;
      },
      { Tablet: 0, Mobile: 0, Desktop: 0 }
    );

    const siteClicks = {};
    profile.links.concat(profile.shops).forEach(({ url, clicks }) => {
      try {
        const hostname = new URL(url).hostname.replace("www.", ""); // Extract domain
        siteClicks[hostname] = (siteClicks[hostname] || 0) + clicks;
      } catch (error) {
        console.error("Invalid URL:", url);
      }
    });

    const siteClicksArray = Object.entries(siteClicks).map(
      ([site, clicks]) => ({
        site,
        clicks,
      })
    );

    const linksData = profile.links.map((link) => ({
      name: link.name,
      url: link.url,
      clicks: link.clicks,
    }));

    const shopsData = profile.shops.map((shop) => ({
      name: shop.name,
      url: shop.url,
      clicks: shop.clicks,
    }));

    let monthlyClicks = new Array(12).fill(0);

    const allTimestamps = [
      ...profile.links.flatMap((link) => link.clickTimestamps),
      ...profile.shops.flatMap((shop) => shop.clickTimestamps),
    ];

    allTimestamps.forEach((timestamp) => {
      const month = new Date(timestamp).getMonth(); // Get month index (0 = Jan, 11 = Dec)
      monthlyClicks[month] += 1;
    });

    monthlyClicks = monthlyClicks.slice(0, new Date().getMonth() + 1);

    return {
      totalLinkClicks,
      totalShopClicks,
      deviceClicks,
      siteClicks: siteClicksArray,
      linksData,
      monthlyClicks,
      shopsData,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return { success: false, message: "Server error" };
  }
};

module.exports = {
  createProfile,
  getProfileByUserId,
  updateProfileData,
  getProfileById,
  updateLinkById,
  getAnalyticsData,
};
