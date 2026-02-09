import mongoose, { Document, Schema } from "mongoose";

export interface EducationModel {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface ExperienceModel {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface CVModel {
  id: string;
  fileName: string;
  name?: string; // Display name (user-provided name)
  uploadDate: string;
  url: string;
  sizeKB: number;
  isPrimary?: boolean; // Primary flag for CVs
}

export interface MediaFileModel {
  id: string;
  fileName: string;
  name?: string; // Display name (optional)
  fileType: "Profile Photo";
  uploadDate: string;
  url: string;
  sizeKB: number;
  isPrimary?: boolean; // Primary flag for Profile Photos
}

export interface ProjectFileModel {
  id: string;
  fileName: string;
  fileType: "Project Image" | "Project Document";
  uploadDate: string;
  url: string;
  sizeKB: number;
}

export interface ProjectModel {
  id: string;
  title: string;
  description?: string;
  category?: string;
  platform?: "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload";
  isFeatured?: boolean;
  projectLink?: string; // External link URL (one per project)
  files: ProjectFileModel[]; // Array of uploaded files
  uploadedDate: string;
}

export interface IProfile extends Document {
  // Core identification fields
  user: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  avatarUrl: string;
  cvUploaded: boolean;
  
  // Array fields
  education: EducationModel[];
  experience: ExperienceModel[];
  cvs: CVModel[]; // CVs stored in separate array
  mediaFiles: MediaFileModel[]; // Only Profile Photos now
  projects: ProjectModel[]; // Projects and work samples
  
  // Additional address and personal details
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  nationality?: string;
  state?: string;
  zipCode?: string;
}

const EducationSchema = new Schema<EducationModel>({
  institution: String,
  degree: String,
  fieldOfStudy: String,
  startDate: String,
  endDate: String,
}, { _id: false });

const ExperienceSchema = new Schema<ExperienceModel>({
  title: String,
  company: String,
  location: String,
  startDate: String,
  endDate: { type: String, default: null },
  description: String,
}, { _id: false });

const CVSchema = new Schema<CVModel>({
  id: String,
  fileName: String,
  name: String, // Display name (optional)
  uploadDate: String,
  url: String,
  sizeKB: Number,
  isPrimary: { type: Boolean, default: false }, // Primary flag for CVs
}, { _id: false });

const MediaFileSchema = new Schema<MediaFileModel>({
  id: String,
  fileName: String,
  name: String, // Display name (optional)
  fileType: { type: String, enum: ["Profile Photo"] },
  uploadDate: String,
  url: String,
  sizeKB: Number,
  isPrimary: { type: Boolean, default: false }, // Primary flag for Profile Photos
}, { _id: false });

const ProjectFileSchema = new Schema<ProjectFileModel>({
  id: String,
  fileName: String,
  fileType: { type: String, enum: ["Project Image", "Project Document"] },
  uploadDate: String,
  url: String,
  sizeKB: Number,
}, { _id: false });

const ProjectSchema = new Schema<ProjectModel>({
  id: String,
  title: String,
  description: String,
  category: String,
  platform: { type: String, enum: ["GitHub", "Behance", "Dribbble", "Personal Website", "Other", "File Upload"], default: "File Upload" },
  isFeatured: { type: Boolean, default: false },
  projectLink: String,
  files: [ProjectFileSchema],
  uploadedDate: String,
}, { _id: false });

const ProfileSchema: Schema<IProfile> = new Schema({
  // Core identification fields (appear first in database)
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  headline: { type: String },
  location: { type: String },
  avatarUrl: { type: String },
  cvUploaded: { type: Boolean, default: false },
  
  // Array fields (education, experience, cvs, mediaFiles, projects)
  education: [EducationSchema],
  experience: [ExperienceSchema],
  cvs: [CVSchema], // CVs stored in separate array
  mediaFiles: [MediaFileSchema], // Only Profile Photos now
  projects: [ProjectSchema], // Projects and work samples
  
  // Additional address and personal details (appear after arrays in database)
  address: { type: String },
  city: { type: String },
  country: { type: String },
  dateOfBirth: { type: String },
  nationality: { type: String },
  state: { type: String },
  zipCode: { type: String },
});

const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
export default Profile;