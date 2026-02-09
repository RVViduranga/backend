import mongoose, { Document, Schema } from "mongoose";

export interface IMatchingData extends Document {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  score: number;
}

const MatchingDataSchema: Schema<IMatchingData> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  score: { type: Number, required: true },
});

const MatchingData = mongoose.model<IMatchingData>("MatchingData", MatchingDataSchema);
export default MatchingData;