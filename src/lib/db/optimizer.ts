/**
 * Database Performance Optimizer
 * Advanced indexing and query optimization
 */

import mongoose from 'mongoose';

export async function optimizeDatabase() {
  const db = mongoose.connection.db;
  if (!db) return;

  try {
    // Resume collection optimizations
    await db.collection('resumes').createIndexes([
      // Primary queries
      { key: { userEmail: 1, updatedAt: -1 }, background: true },
      { key: { userEmail: 1, _id: 1 }, background: true },
      { key: { slug: 1 }, unique: true, sparse: true, background: true },

      // Analytics queries
      { key: { userEmail: 1, viewCount: -1 }, background: true },
      { key: { userEmail: 1, isPublic: 1 }, background: true },
      { key: { userEmail: 1, atsScore: -1 }, background: true },

      // Compound indexes for complex queries
      { key: { userEmail: 1, isPublic: 1, viewCount: -1 }, background: true },
    ]);

    // User collection optimizations
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true, background: true },
      { key: { email: 1, updatedAt: -1 }, background: true },
    ]);

    // Applications collection (if exists)
    try {
      await db.collection('applications').createIndexes([
        { key: { userEmail: 1, createdAt: -1 }, background: true },
        { key: { userEmail: 1, status: 1 }, background: true },
      ]);
    } catch {
      // Collection might not exist yet
    }

    console.log('Database indexes optimized');
  } catch (error) {
    console.error('Database optimization failed:', error);
  }
}

// Query optimization helpers
export const optimizedQueries = {
  getUserResumes: (userEmail: string) => [
    { userEmail },
    {
      title: 1,
      'personalInfo.name': 1,
      updatedAt: 1,
      atsScore: 1,
      viewCount: 1,
      templateId: 1,
      isPublic: 1,
      slug: 1,
    },
  ],

  getAnalyticsData: (userEmail: string) => [
    { userEmail },
    {
      title: 1,
      viewCount: 1,
      atsScore: 1,
      isPublic: 1,
    },
  ],

  getUserStats: (userEmail: string) => [
    { userEmail },
    {
      viewCount: 1,
      isPublic: 1,
    },
  ],
};
