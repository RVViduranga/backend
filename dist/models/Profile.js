"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const EducationSchema = new mongoose_1.Schema({
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: String,
    endDate: String,
}, { _id: false });
const ExperienceSchema = new mongoose_1.Schema({
    title: String,
    company: String,
    location: String,
    startDate: String,
    endDate: { type: String, default: null },
    description: String,
}, { _id: false });
const MediaFileSchema = new mongoose_1.Schema({
    id: String,
    fileName: String,
    fileType: { type: String, enum: ["CV", "Portfolio Image", "Portfolio Document"] },
    uploadDate: String,
    url: String,
    sizeKB: Number,
}, { _id: false });
const ProfileSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    headline: { type: String },
    location: { type: String },
    avatarUrl: { type: String },
    cvUploaded: { type: Boolean, default: false },
    education: [EducationSchema],
    experience: [ExperienceSchema],
    mediaFiles: [MediaFileSchema],
});
const Profile = mongoose_1.default.model("Profile", ProfileSchema);
exports.default = Profile;
