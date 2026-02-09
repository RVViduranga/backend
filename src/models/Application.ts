import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Application document interface
 */
export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  cvFilePath: string;
  appliedAt: Date;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
}

/**
 * Application schema
 */
const applicationSchema: Schema<IApplication> = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cvFilePath: {
      type: String,
      required: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: false, // appliedAt already handled manually
  }
);

/**
 * Application model
 */
const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", applicationSchema);

export default Application;
