/**
 * The indexes are declared once, in the Mongoose schemas, and they serve the list queries
 * the routes send. Runs against a real in-memory MongoDB.
 *
 * - Mongoose warns "Duplicate schema index" when a field option and schema.index() declare
 *   the same key. https://mongoosejs.com/docs/guide.html#indexes
 * - A non-unique, non-sparse index on a prefix of a compound index is redundant: "MongoDB
 *   uses the compound index in all of the situations that it would have used the prefix
 *   index." https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/
 * - A sort the index cannot provide becomes an in-memory SORT stage (Equality, Sort, Range).
 *   https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import type { Model } from 'mongoose';
import { startMongo, stopMongo } from '../helpers/mongo';

const warnings: string[] = [];
const onWarning = (w: Error) => warnings.push(w.message);
process.on('warning', onWarning);

const MODELS_DIR = join(import.meta.dir, '../../src/lib/db/models');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = Model<any>;
let models: AnyModel[] = [];

beforeAll(async () => {
  await startMongo();
  const { default: connectDB } = await import('@/lib/db/connection');
  await connectDB();
  const { default: mongoose } = await import('mongoose');
  for (const file of readdirSync(MODELS_DIR).filter((f) => f.endsWith('.ts'))) {
    await import(join(MODELS_DIR, file));
  }
  models = Object.values(mongoose.models) as AnyModel[];
  for (const m of models) await m.syncIndexes();
}, 60_000);

afterAll(async () => {
  process.off('warning', onWarning);
  await stopMongo();
});

const isPrefix = (a: string[], b: string[]) =>
  a.length < b.length && a.every((k, i) => b[i] === k);

describe('schema index declarations', () => {
  test('every model file registers a model', () => {
    const files = readdirSync(MODELS_DIR).filter((f) => f.endsWith('.ts'));
    expect(models.length).toBe(files.length);
  });

  test('no index is declared twice', async () => {
    warnings.length = 0;
    for (const m of models) await m.createIndexes();
    await new Promise((r) => setTimeout(r, 10)); // process.emitWarning dispatches on next tick
    expect(
      warnings.filter((w) => w.includes('Duplicate schema index'))
    ).toEqual([]);
  });

  test('the database matches the schemas after syncIndexes', async () => {
    for (const m of models) {
      expect({ model: m.modelName, diff: await m.diffIndexes() }).toEqual({
        model: m.modelName,
        diff: { toDrop: [], toCreate: [] },
      });
    }
  });

  test('no index is a redundant prefix of another', async () => {
    const redundant: string[] = [];
    for (const m of models) {
      const indexes = await m.collection.indexes();
      for (const a of indexes) {
        if (a.name === '_id_' || a.unique || a.sparse) continue;
        const ak = Object.keys(a.key);
        for (const b of indexes) {
          if (isPrefix(ak, Object.keys(b.key)))
            redundant.push(
              `${m.collection.collectionName}.${a.name} < ${b.name}`
            );
        }
      }
    }
    expect(redundant).toEqual([]);
  });
});

/** Every stage name anywhere in an explain plan tree (classic and SBE shapes). */
function stages(node: unknown, out: string[] = []): string[] {
  if (Array.isArray(node)) node.forEach((n) => stages(n, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'stage' && typeof v === 'string') out.push(v);
      else if (typeof v === 'object') stages(v, out);
    }
  }
  return out;
}

const winningStages = (explain: unknown) =>
  stages(
    (explain as { queryPlanner: { winningPlan: unknown } }).queryPlanner
      .winningPlan
  );

describe('list queries are served by an index in sort order', () => {
  const ME = 'owner@example.com';

  beforeAll(async () => {
    const { JobApplication } = await import('@/lib/db/models/JobApplication');
    const { Resume } = await import('@/lib/db/models/Resume');
    const apps = [];
    const resumes = [];
    for (let u = 0; u < 20; u++) {
      const userEmail = u === 0 ? ME : `user${u}@example.com`;
      for (let i = 0; i < 10; i++) {
        apps.push({
          userEmail,
          jobTitle: `SWE ${i}`,
          company: `Co ${i}`,
          status: i % 2 ? 'applied' : 'interview',
        });
        resumes.push({
          userEmail,
          title: `R ${i}`,
          slug: `u${u}/${i}`,
          isPublic: i % 3 === 0,
          templateId: 'tech',
        });
      }
    }
    await JobApplication.insertMany(apps);
    await Resume.insertMany(resumes);
  });

  test('GET /api/applications: find {userEmail} sort {createdAt: -1}', async () => {
    const { JobApplication } = await import('@/lib/db/models/JobApplication');
    // Same filter and sort as src/app/api/applications/route.ts GET.
    const s = winningStages(
      await JobApplication.find({ userEmail: ME })
        .sort({ createdAt: -1 })
        .explain('executionStats')
    );
    expect(s).toContain('IXSCAN');
    expect(s).not.toContain('SORT');
    expect(s).not.toContain('COLLSCAN');
  });

  test('GET /api/resumes: find {userEmail} sort {updatedAt: -1}', async () => {
    const { Resume } = await import('@/lib/db/models/Resume');
    const { optimizedQueries } = await import('@/lib/db/optimizer');
    const [query, projection] = optimizedQueries.getUserResumes(ME);
    const s = winningStages(
      await Resume.find(query, projection)
        .sort({ updatedAt: -1 })
        .explain('executionStats')
    );
    expect(s).toContain('IXSCAN');
    expect(s).not.toContain('SORT');
    expect(s).not.toContain('COLLSCAN');
  });
});

describe('connection', () => {
  test('production skips autoIndex and autoCreate; development and test keep them', async () => {
    const { connectionOptions } = await import('@/lib/db/connection');
    expect(connectionOptions('production')).toMatchObject({
      autoIndex: false,
      autoCreate: false,
    });
    expect(connectionOptions('development')).toMatchObject({
      autoIndex: true,
      autoCreate: true,
    });
    expect(connectionOptions('test')).toMatchObject({
      autoIndex: true,
      autoCreate: true,
    });
  });
});

describe('scripts/sync-indexes', () => {
  test('creates missing indexes, drops undeclared ones, and reports both', async () => {
    const { syncAllIndexes } = await import('../../scripts/sync-indexes');
    const { Resume } = await import('@/lib/db/models/Resume');
    await Resume.collection.dropIndex('userEmail_1_updatedAt_-1');
    await Resume.collection.createIndex({ title: 1 }, { name: 'title_1' });

    const report = await syncAllIndexes();
    expect(report.find((r) => r.model === 'Resume')).toEqual({
      model: 'Resume',
      collection: 'resumes',
      created: ['userEmail_1_updatedAt_-1'],
      dropped: ['title_1'],
    });
    for (const r of report.filter((x) => x.model !== 'Resume')) {
      expect({
        model: r.model,
        created: r.created,
        dropped: r.dropped,
      }).toEqual({ model: r.model, created: [], dropped: [] });
    }
  });
});
