/**
 * Query shapes shared by the routes. Indexes are declared in the Mongoose schemas
 * (src/lib/db/models) and built by `bun run db:sync-indexes`, never from here.
 */
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
