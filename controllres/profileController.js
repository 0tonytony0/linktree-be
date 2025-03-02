const express = require("express");
const Profile = require("../models/Profile");

const router = express.Router();

// **1. Add a Link to a Profile**
router.post("/:profileId/links", async (req, res) => {
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
});

// **2. Edit a Link**
router.put("/:profileId/links/:linkId", async (req, res) => {
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
});

// **3. Delete a Link**
router.delete("/:profileId/links/:linkId", async (req, res) => {
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
});

// **4. List All Links of a Profile**
router.get("/:profileId/links", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.profileId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile.links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **5. Add a Shop Link**
router.post("/:profileId/shops", async (req, res) => {
  try {
    const { title, url } = req.body;
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.shops.push({ title, url });
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **6. Edit a Shop Link**
router.put("/:profileId/shops/:shopId", async (req, res) => {
  try {
    const { title, url } = req.body;
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const shop = profile.shops.id(req.params.shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    shop.title = title || shop.title;
    shop.url = url || shop.url;
    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **7. Delete a Shop Link**
router.delete("/:profileId/shops/:shopId", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.profileId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.shops = profile.shops.filter(
      (shop) => shop._id.toString() !== req.params.shopId
    );
    await profile.save();

    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **8. List All Shop Links of a Profile**
router.get("/:profileId/shops", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.profileId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile.shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
