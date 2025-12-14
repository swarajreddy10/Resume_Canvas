import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    jobUrl: String,
    description: String,
    salary: String,
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
    notes: String,
    contacts: [
      {
        name: String,
        email: String,
        role: String,
      },
    ],
    interviews: [
      {
        type: { type: String, enum: ['phone', 'video', 'onsite', 'technical'] },
        date: Date,
        duration: Number,
        interviewer: String,
        notes: String,
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model('JobApplication', jobApplicationSchema);
