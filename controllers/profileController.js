const Profile = require("../models/Profile");
const {
  getProfileByUserId,
  createProfile,
  getProfileById,
  updateLinkById,
  getAnalyticsData,
} = require("../services/profile");

// **1. Add a Link to a Profile**
const addLink = async (req, res) => {
  try {
    const { title, url } = req.body;
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.links.push({ title, url });
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **2. Edit a Link**
const editLink = async (req, res) => {
  try {
    const { title, url } = req.body;
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const link = profile.links.id(req.params.linkId);
    if (!link) return res.status(404).json({ message: "Link not found" });

    link.title = title || link.title;
    link.url = url || link.url;
    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **3. Delete a Link**
const deleteLink = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.links = profile.links.filter(
      (link) => link._id.toString() !== req.params.linkId
    );
    await profile.save();

    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **4. List All Links**
const listLinks = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.profileId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile.links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **5. Create User Profile**
const createUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const profileData = req.body;
    const profile = await createProfile({ ...profileData, user: user.id });
    res.status(201).json(profile);
  } catch (error) {
    console.log("error ---- ", error);
    res.status(500).json({ error: error.message });
  }
};

// **6. Update User Profile**
const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const profile = await Profile.findOneAndUpdate(
      { user: user.id },
      req.body,
      {
        new: true,
      }
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **7. Get Profile Data**
const getProfileData = async (req, res) => {
  try {
    const user = req.user;
    const profile = await getProfileByUserId(user.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ message: "Profile fetched successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfileDataFromId = async (req, res) => {
  try {
    const profileId = req.params.id;
    console.log({ profileId });
    const profile = await getProfileById(profileId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ message: "Profile fetched successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLinkData = async (req, res) => {
  try {
    const linkId = req.params.id;
    const user = req.user;
    const { device, isLink } = req.body;

    console.log(req.body, "requested");
    const updatedProfileData = await updateLinkById(
      user.id,
      linkId,
      device,
      isLink
    );
    res
      .status(200)
      .json({ message: "Link Data Updated", profile: updatedProfileData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getProfileAnalytics = async (req, res) => {
  try {
    console.log("inisde analytics data");
    const user = req.user;
    const {
      totalLinkClicks,
      totalShopClicks,
      deviceClicks,
      siteClicks,
      linksData,
      monthlyClicks,
      shopsData,
    } = await getAnalyticsData(user.id);

    return res.status(200).json({
      message: "Data Fetched Successfully",
      totalLinkClicks,
      totalShopClicks,
      deviceClicks,
      siteClicks,
      linksData,
      monthlyClicks,
      shopsData,
    });
  } catch (err) {
    conosle.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addLink,
  editLink,
  deleteLink,
  listLinks,
  createUserProfile,
  updateUserProfile,
  getProfileData,
  getProfileDataFromId,
  updateLinkData,
  getProfileAnalytics,
};
