"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.uploadCoverLetter = exports.uploadCV = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directories exist
const uploadDirs = [
    path_1.default.join(__dirname, '../uploads/cv'),
    path_1.default.join(__dirname, '../uploads/cover-letter'),
    path_1.default.join(__dirname, '../uploads/userprofileAvatar'),
    path_1.default.join(__dirname, '../uploads/companyLogo'),
];
uploadDirs.forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
// Storage for CVs
const cvStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../uploads/cv'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
// Storage for Cover Letters
const coverLetterStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../uploads/cover-letter'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
// Storage for User Profile Avatars
const avatarStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../uploads/userprofileAvatar'));
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-userId-originalname
        const userId = req.user?.userId || 'unknown';
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
        cb(null, `${timestamp}-${userId}-${originalName}`);
    }
});
// File filter for avatars (only images)
const avatarFileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed for profile photos'));
    }
};
exports.uploadCV = (0, multer_1.default)({ storage: cvStorage });
exports.uploadCoverLetter = (0, multer_1.default)({ storage: coverLetterStorage });
exports.uploadAvatar = (0, multer_1.default)({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    }
});
