import mongoose from 'mongoose';
import { EMAIL_REGEX } from '@/lib/validation/email.regex';

const jobApplicationSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: EMAIL_REGEX,
    },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    location: { type: String, trim: true, maxlength: 200 },
    jobUrl: { type: String, trim: true, maxlength: 500 },
    description: { type: String, trim: true, maxlength: 5000 },
    salary: { type: String, trim: true, maxlength: 100 },
    status: {
      type: String,
      enum: [
        'applied',
        'screening',
        'interview',
        'offer',
        'rejected',
        'withdrawn',
      ],
      default: 'applied',
    },
    appliedDate: { type: Date, default: Date.now },
    notes: { type: String, trim: true, maxlength: 2000 },
    contacts: [
      {
        name: { type: String, trim: true, maxlength: 100 },
        email: {
          type: String,
          lowercase: true,
          trim: true,
          match: EMAIL_REGEX,
        },
        role: { type: String, trim: true, maxlength: 100 },
      },
    ],
    interviews: [
      {
        type: { type: String, enum: ['phone', 'video', 'onsite', 'technical'] },
        date: Date,
        duration: { type: Number, min: 0, max: 480 },
        interviewer: { type: String, trim: true, maxlength: 100 },
        notes: { type: String, trim: true, maxlength: 2000 },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// GET /api/applications filters on userEmail and sorts on createdAt; equality key first,
// then the sort key, so the list streams from the index with no in-memory SORT.
// https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/
jobApplicationSchema.index({ userEmail: 1, createdAt: -1 });

export const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model('JobApplication', jobApplicationSchema);
