import mongoose from 'mongoose';

const jobSearchSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    title: String,
    company: String,
    location: String,
    salary: String,
    description: String,
    url: String,
    source: {
      type: String,
      enum: ['manual', 'linkedin', 'indeed'],
      default: 'manual',
    },
    status: {
      type: String,
      enum: ['saved', 'applied', 'interview', 'rejected', 'offer'],
      default: 'saved',
    },
    appliedDate: Date,
    notes: String,
    resumeUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  },
  { timestamps: true }
);

export const JobSearch =
  mongoose.models.JobSearch || mongoose.model('JobSearch', jobSearchSchema);
