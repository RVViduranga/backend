
import mongoose, { Schema, Document, Model } from "mongoose";

export type JobStatus = "Active" | "Inactive" | "Pending Review" | "Closed";

export interface IJob extends Document {
  title: string;
  company: mongoose.Types.ObjectId; // Reference to Company
  location: string;
  jobType: string;
  postedDate: Date;
  industry?: string;
  experienceLevel?: string;
  status?: JobStatus;
  views?: number;
  applicationsCount?: number;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  salaryRange: string;
  applicationDeadline: string;
}

const JobSchema: Schema<IJob> = new Schema({
  title: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
  industry: { type: String },
  experienceLevel: { type: String },
  status: { type: String, enum: ["Active", "Inactive", "Pending Review", "Closed"], default: "Active" },
  views: { type: Number, default: 0 },
  applicationsCount: { type: Number, default: 0 },
  description: { type: String, required: true },
  responsibilities: { type: [String], default: [] },
  qualifications: { type: [String], default: [] },
  salaryRange: { type: String, required: true },
  applicationDeadline: { type: String, required: true },
});

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
export default Job;
