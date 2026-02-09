import mongoose, { Document, Schema } from "mongoose";

export interface IUpload extends Document {
  user: mongoose.Types.ObjectId;
  fileUrl: string;
  uploadedAt: Date;
}

const UploadSchema: Schema<IUpload> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Upload = mongoose.model<IUpload>("Upload", UploadSchema);
export default Upload;