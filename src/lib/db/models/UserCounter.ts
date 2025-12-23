import mongoose from 'mongoose';

const userCounterSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  resumeCount: {
    type: Number,
    default: 0,
    min: 0,
  },
});

userCounterSchema.index({ userEmail: 1 }, { unique: true });

export const UserCounter =
  mongoose.models.UserCounter ||
  mongoose.model('UserCounter', userCounterSchema);
