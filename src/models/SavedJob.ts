import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedJob extends Document {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  savedAt: Date;
}

const SavedJobSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ISavedJob>('SavedJob', SavedJobSchema);
