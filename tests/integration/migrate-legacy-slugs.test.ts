import { afterAll, beforeAll, expect, test } from 'bun:test';
import { startMongo, stopMongo } from '../helpers/mongo';

let migrate: typeof import('../../scripts/migrate-legacy-slugs').migrateLegacySlugs;
let resumes: import('mongodb').Collection;

beforeAll(async () => {
  await startMongo();
  const { default: connectDB } = await import('@/lib/db/connection');
  const conn = await connectDB();
  resumes = conn.connection.collection('resumes');
  ({ migrateLegacySlugs: migrate } = await import('../../scripts/migrate-legacy-slugs'));
}, 60_000);

afterAll(stopMongo);

test('legacy name/N slugs become one URL segment, and a second run changes nothing', async () => {
  await resumes.insertMany([
    { userEmail: 'a@example.com', title: 'A', slug: 'john/1' },
    { userEmail: 'b@example.com', title: 'B', slug: 'mary/2' },
    { userEmail: 'c@example.com', title: 'C', slug: 'john-abc123-1' },
  ]);

  const changes = await migrate();
  expect(changes).toEqual([
    { from: 'john/1', to: 'john-1' },
    { from: 'mary/2', to: 'mary-2' },
  ]);
  const slugs = (await resumes.find({}).toArray()).map((d) => d.slug).sort();
  expect(slugs).toEqual(['john-1', 'john-abc123-1', 'mary-2']);
  expect(await migrate()).toEqual([]);
});
