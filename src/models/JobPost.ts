import mongoose, { Document, Schema } from "mongoose";

export interface IJobPost extends Document {
  job: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const JobPostSchema: Schema<IJobPost> = new Schema({
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const JobPost = mongoose.model<IJobPost>("JobPost", JobPostSchema);
export default JobPost;