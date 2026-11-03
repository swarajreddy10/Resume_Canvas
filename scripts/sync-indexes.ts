/**
 * Make each collection's indexes match its Mongoose schema: build the declared indexes
 * that are missing and drop the ones no schema declares (`_id_` is never dropped).
 * Production instances start with autoIndex and autoCreate off, so this runs once per
 * deploy instead of on every cold start.
 *
 *   MONGODB_URI=... bun run db:sync-indexes
 *
 * https://mongoosejs.com/docs/api/model.html#Model.syncIndexes()
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import mongoose, { type Model } from 'mongoose';

const MODELS_DIR = join(import.meta.dir, '../src/lib/db/models');

export interface SyncReport {
  model: string;
  collection: string;
  created: string[];
  dropped: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = Model<any>;

/** Import every file in src/lib/db/models, so no model can be left out of the sync. */
export async function loadModels(): Promise<AnyModel[]> {
  for (const file of readdirSync(MODELS_DIR).filter((f) => f.endsWith('.ts'))) {
    await import(join(MODELS_DIR, file));
  }
  return Object.values(mongoose.models) as AnyModel[];
}

async function indexNames(model: AnyModel): Promise<string[]> {
  try {
    return (await model.collection.indexes()).map((i) => i.name ?? '');
  } catch (err) {
    if ((err as { codeName?: string }).codeName === 'NamespaceNotFound')
      return [];
    throw err;
  }
}

/** Sync every model on the current default connection; report what changed. */
export async function syncAllIndexes(): Promise<SyncReport[]> {
  const report: SyncReport[] = [];
  for (const model of await loadModels()) {
    const before = await indexNames(model);
    const dropped = (await model.syncIndexes()) ?? [];
    const created = (await indexNames(model)).filter(
      (n) => !before.includes(n)
    );
    report.push({
      model: model.modelName,
      collection: model.collection.collectionName,
      created,
      dropped,
    });
  }
  return report;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  // autoIndex off: syncIndexes() alone decides what is built, with nothing racing it.
  await mongoose.connect(uri, {
    autoIndex: false,
    serverSelectionTimeoutMS: 10000,
  });
  try {
    for (const r of await syncAllIndexes()) {
      console.log(
        `${r.model} (${r.collection}): created [${r.created.join(', ')}] dropped [${r.dropped.join(', ')}]`
      );
    }
  } finally {
    await mongoose.disconnect();
  }
}

if (import.meta.main) {
  main().catch((err) => {
    console.error('Index sync failed:', err);
    process.exit(1);
  });
}
