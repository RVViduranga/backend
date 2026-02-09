"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.deleteProfile = exports.updateProfile = exports.getProfileById = exports.getProfiles = exports.createProfile = void 0;
const Profile_1 = __importDefault(require("../models/Profile"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Create a new user profile
const createProfile = async (req, res, next) => {
    try {
        const profile = await Profile_1.default.create(req.body);
        res.status(201).json({ success: true, data: profile, message: 'Profile created successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.createProfile = createProfile;
// Get all profiles (or filter by user query parameter)
const getProfiles = async (req, res, next) => {
    try {
        const { user } = req.query;
        let profiles;
        if (user) {
            // Filter by user ID
            profiles = await Profile_1.default.find({ user });
        }
        else {
            // Get all profiles
            profiles = await Profile_1.default.find();
        }
        // Transform MongoDB documents to match frontend ProfileModel (id instead of _id)
        const transformedProfiles = profiles.map((profile) => ({
            id: profile._id.toString(),
            user: profile.user.toString(),
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone || '',
            headline: profile.headline || '',
            location: profile.location || '',
            avatarUrl: profile.avatarUrl || '',
            cvUploaded: profile.cvUploaded || false,
            education: profile.education || [],
            experience: profile.experience || [],
            mediaFiles: profile.mediaFiles || [],
        }));
        res.status(200).json({ success: true, data: transformedProfiles, message: 'Profiles fetched successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.getProfiles = getProfiles;
// Get profile by ID
const getProfileById = async (req, res, next) => {
    try {
        const profile = await Profile_1.default.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: profile, message: 'Profile fetched successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.getProfileById = getProfileById;
// Update profile
const updateProfile = async (req, res, next) => {
    try {
        const profile = await Profile_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!profile) {
            return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: profile, message: 'Profile updated successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfile = updateProfile;
// Delete profile
const deleteProfile = async (req, res, next) => {
    try {
        const profile = await Profile_1.default.findByIdAndDelete(req.params.id);
        if (!profile) {
            return res.status(404).json({ success: false, data: null, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: null, message: 'Profile deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProfile = deleteProfile;
// Upload profile avatar
const uploadAvatar = async (req, res, next) => {
    try {
        // Get userId from JWT token (set by auth middleware)
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
        }
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, data: null, message: 'No file uploaded' });
        }
        // Get user's profile
        let profile = await Profile_1.default.findOne({ user: userId });
        if (!profile) {
            // If profile doesn't exist, create it
            const User = (await import('../models/User')).default;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, data: null, message: 'User not found' });
            }
            // Create profile with avatar URL
            profile = await Profile_1.default.create({
                user: userId,
                fullName: user.fullName,
                email: user.email,
                phone: '',
                headline: '',
                location: '',
                avatarUrl: `/uploads/userprofileAvatar/${req.file.filename}`,
                cvUploaded: false,
                education: [],
                experience: [],
                mediaFiles: [],
            });
            // Transform to match frontend format
            const transformedProfile = {
                id: profile._id.toString(),
                user: profile.user.toString(),
                fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone || '',
                headline: profile.headline || '',
                location: profile.location || '',
                avatarUrl: profile.avatarUrl,
                cvUploaded: profile.cvUploaded || false,
                education: profile.education || [],
                experience: profile.experience || [],
                mediaFiles: profile.mediaFiles || [],
            };
            return res.status(200).json({
                success: true,
                data: {
                    avatarUrl: `/uploads/userprofileAvatar/${req.file.filename}`,
                    profile: transformedProfile,
                },
                message: 'Avatar uploaded successfully',
            });
        }
        // Delete old avatar if exists
        if (profile.avatarUrl) {
            const oldAvatarPath = path_1.default.join(__dirname, '../uploads/userprofileAvatar', path_1.default.basename(profile.avatarUrl));
            if (fs_1.default.existsSync(oldAvatarPath)) {
                fs_1.default.unlinkSync(oldAvatarPath);
            }
        }
        // Update profile with new avatar URL
        profile.avatarUrl = `/uploads/userprofileAvatar/${req.file.filename}`;
        await profile.save();
        // Transform to match frontend format
        const transformedProfile = {
            id: profile._id.toString(),
            user: profile.user.toString(),
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone || '',
            headline: profile.headline || '',
            location: profile.location || '',
            avatarUrl: profile.avatarUrl,
            cvUploaded: profile.cvUploaded || false,
            education: profile.education || [],
            experience: profile.experience || [],
            mediaFiles: profile.mediaFiles || [],
        };
        res.status(200).json({
            success: true,
            data: {
                avatarUrl: `/uploads/userprofileAvatar/${req.file.filename}`,
                profile: transformedProfile,
            },
            message: 'Avatar uploaded successfully',
        });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadAvatar = uploadAvatar;
