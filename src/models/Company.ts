import mongoose, { Document, Schema } from "mongoose";

export interface ICompany extends Document {
  name: string;
  description: string;
  location: string;
  website?: string;
  logoUrl?: string;
  headerImageUrl?: string;
  headquarters?: string;
  establishedYear?: number;
  employeeCountRange?: string;
  industry?: string;
  activeJobsCount?: number;
  totalApplicationsReceived?: number;
}

const CompanySchema: Schema<ICompany> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  website: { type: String },
  logoUrl: { type: String },
  headerImageUrl: { type: String },
  headquarters: { type: String },
  establishedYear: { type: Number },
  employeeCountRange: { type: String },
  industry: { type: String },
  activeJobsCount: { type: Number, default: 0 },
  totalApplicationsReceived: { type: Number, default: 0 },
});

const Company = mongoose.model<ICompany>("Company", CompanySchema);
export default Company;