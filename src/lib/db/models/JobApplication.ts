import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
          match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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

jobApplicationSchema.index({ userEmail: 1, appliedDate: -1 });
jobApplicationSchema.index({ userEmail: 1, status: 1 });
jobApplicationSchema.index({ resumeId: 1 });
jobApplicationSchema.index({ company: 1, jobTitle: 1 });

export const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model('JobApplication', jobApplicationSchema);
