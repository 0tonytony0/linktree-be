const Profile = require("../models/Profile");
const {
  getProfileByUserId,
  createProfile,
  getProfileById,
  updateLinkById,
  getAnalyticsData,
} = require("../services/profile");
const apiResponse = require("../utils/apiResponse");
const catchAsyncErrors = require("../utils/catchAsyncErrors");

/**
 * @desc    Add a Link to a Profile
 * @route   POST /api/profile/:profileId/link
 * @access  Private
 */
const addLink = catchAsyncErrors(async (req, res) => {
  const { title, url } = req.body;
  const profile = await Profile.findById(req.params.profileId);

  if (!profile) {
    return apiResponse(res, 404, false, "Profile not found");
  }

  profile.links.push({ title, url });
  await profile.save();

  return apiResponse(res, 201, true, "Link added successfully", profile);
});

/**
 * @desc    Edit a Link
 * @route   PUT /api/profile/:profileId/link/:linkId
 * @access  Private
 */
const editLink = catchAsyncErrors(async (req, res) => {
  const { title, url } = req.body;
  const profile = await Profile.findById(req.params.profileId);

  if (!profile) {
    return apiResponse(res, 404, false, "Profile not found");
  }

  const link = profile.links.id(req.params.linkId);
  if (!link) {
    return apiResponse(res, 404, false, "Link not found");
  }

  link.title = title || link.title;
  link.url = url || link.url;
  await profile.save();

  return apiResponse(res, 200, true, "Link updated successfully", profile);
});

/**
 * @desc    Delete a Link
 * @route   DELETE /api/profile/:profileId/link/:linkId
 * @access  Private
 */
const deleteLink = catchAsyncErrors(async (req, res) => {
  const profile = await Profile.findById(req.params.profileId);

  if (!profile) {
    return apiResponse(res, 404, false, "Profile not found");
  }

  profile.links = profile.links.filter(
    (link) => link._id.toString() !== req.params.linkId
  );
  await profile.save();

  return apiResponse(res, 200, true, "Link deleted successfully");
});

/**
 * @desc    List All Links
 * @route   GET /api/profile/:profileId/links
 * @access  Private
 */
const listLinks = catchAsyncErrors(async (req, res) => {
  const profile = await Profile.findById(req.params.profileId);
  if (!profile) {
    return apiResponse(res, 404, false, "Profile not found");
  }

  return apiResponse(res, 200, true, "Links fetched successfully", profile.links);
});

/**
 * @desc    Create User Profile
 * @route   POST /api/profile
 * @access  Private
 */
const createUserProfile = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  const profileData = req.body;
  const profile = await createProfile({ ...profileData, user: user.id });

  return apiResponse(res, 201, true, "Profile created successfully", profile);
});

/**
 * @desc    Update User Profile
 * @route   PUT /api/profile
 * @access  Private
 */
const updateUserProfile = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  const profile = await Profile.findOneAndUpdate(
    { user: user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!profile) {
    return apiResponse(res, 404, false, "Profile not found");
  }

  return apiResponse(res, 200, true, "Profile updated successfully", profile);
});

/**
 * @desc    Get Profile Data (Logged-in user)
 * @route   GET /api/profile
 * @access  Private
 */
const getProfileData = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  const profile = await getProfileByUserId(user.id);

  if (!profile) {
    return apiResponse(res, 404, false, "Profile not found");
  }

  return apiResponse(res, 200, true, "Profile fetched successfully", profile);
});

/**
 * @desc    Get Profile Data by ID (Public)
 * @route   GET /api/profile/:id
 * @access  Public
 */
const getProfileDataFromId = catchAsyncErrors(async (req, res) => {
  const profile = await getProfileById(req.params.id);

  if (!profile) {
    return apiResponse(res, 404, false, "Profile not found");
  }

  return apiResponse(res, 200, true, "Profile fetched successfully", profile);
});

/**
 * @desc    Update Link Analytics (Clicks, Devices)
 * @route   POST /api/profile/link/:id/click
 * @access  Public
 */
const updateLinkData = catchAsyncErrors(async (req, res) => {
  const linkId = req.params.id;
  const user = req.user;
  const { device, isLink } = req.body;

  const updatedProfileData = await updateLinkById(
    user.id,
    linkId,
    device,
    isLink
  );

  return apiResponse(res, 200, true, "Link analytics updated", updatedProfileData);
});

/**
 * @desc    Get Profile Analytics Data
 * @route   GET /api/profile/analytics
 * @access  Private
 */
const getProfileAnalytics = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  const analyticsData = await getAnalyticsData(user.id);

  return apiResponse(res, 200, true, "Analytics data fetched successfully", analyticsData);
});

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
