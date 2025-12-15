import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    personalInfo: {
      name: { type: String, trim: true, maxlength: 100 },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      phone: { type: String, trim: true, maxlength: 20 },
      address: { type: String, trim: true, maxlength: 200 },
      linkedin: { type: String, trim: true, maxlength: 200 },
      github: { type: String, trim: true, maxlength: 200 },
      website: { type: String, trim: true, maxlength: 200 },
      summary: { type: String, trim: true, maxlength: 1000 },
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
    skills: [{ type: String, trim: true, maxlength: 100 }],
    projects: [
      {
        name: { type: String, trim: true, maxlength: 100 },
        description: { type: String, trim: true, maxlength: 1000 },
        technologies: [{ type: String, trim: true, maxlength: 50 }],
        url: { type: String, trim: true, maxlength: 200 },
        startDate: { type: String, trim: true },
        endDate: { type: String, trim: true },
      },
    ],
    certifications: [
      {
        name: { type: String, trim: true, maxlength: 100 },
        issuer: { type: String, trim: true, maxlength: 100 },
        date: { type: String, trim: true },
        url: { type: String, trim: true, maxlength: 200 },
      },
    ],
    templateId: {
      type: String,
      enum: ['executive', 'tech', 'corporate', 'creative', 'academic'],
      default: 'tech',
    },
    isPublic: { type: Boolean, default: false },
    atsScore: { type: Number, min: 0, max: 100 },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for performance
resumeSchema.index({ slug: 1 }, { unique: true });
resumeSchema.index({ userEmail: 1, updatedAt: -1 });
resumeSchema.index({ userEmail: 1, isPublic: 1 });
resumeSchema.index({ createdAt: 1 });
resumeSchema.index({ atsScore: -1 });
resumeSchema.index({ userEmail: 1, templateId: 1 });

export const Resume =
  mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
