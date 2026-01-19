import mongoose, { Schema, Document } from 'mongoose';

export interface ICoverLetter extends Document {
  userEmail: string;
  resumeId: mongoose.Types.ObjectId;
  company: string;
  position: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoverLetterSchema = new Schema<ICoverLetter>(
  {
    userEmail: { type: String, required: true, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

CoverLetterSchema.index({ userEmail: 1, createdAt: -1 });

export default mongoose.models.CoverLetter ||
  mongoose.model<ICoverLetter>('CoverLetter', CoverLetterSchema);
