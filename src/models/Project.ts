import mongoose, { Document, Schema } from "mongoose";

export interface ProjectFileModel {
  id: string;
  fileName: string;
  fileType: "Project Image" | "Project Document";
  uploadDate: string;
  url: string;
  sizeKB: number;
}

export interface IProject extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category?: string;
  platform?: "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload";
  isFeatured?: boolean;
  projectLink?: string; // External link URL (one per project)
  files: ProjectFileModel[]; // Array of uploaded files
  uploadedDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectFileSchema = new Schema<ProjectFileModel>({
  id: String,
  fileName: String,
  fileType: { type: String, enum: ["Project Image", "Project Document"] },
  uploadDate: String,
  url: String,
  sizeKB: Number,
}, { _id: false });

const ProjectSchema: Schema<IProject> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  platform: { type: String, enum: ["GitHub", "Behance", "Dribbble", "Personal Website", "Other", "File Upload"], default: "File Upload" },
  isFeatured: { type: Boolean, default: false },
  projectLink: { type: String },
  files: [ProjectFileSchema],
  uploadedDate: { type: String, required: true },
}, { 
  timestamps: true,
  collection: 'projects' // Explicitly set collection name to 'projects'
});

// Mongoose automatically pluralizes "Project" to "projects" collection
const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
