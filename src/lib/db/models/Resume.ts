import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      github: String,
      website: String,
      summary: String,
    },
    education: [
      {
        school: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        gpa: String,
        location: String,
      },
    ],
    experience: [
      {
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
        bullets: [String],
      },
    ],
    skills: [String],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        url: String,
        startDate: String,
        endDate: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        url: String,
      },
    ],
    templateId: {
      type: String,
      enum: ['modern', 'classic', 'minimal'],
      default: 'modern',
    },
    isPublic: { type: Boolean, default: false },
    atsScore: Number,
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

resumeSchema.index({ slug: 1 }, { unique: true });

export const Resume =
  mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
