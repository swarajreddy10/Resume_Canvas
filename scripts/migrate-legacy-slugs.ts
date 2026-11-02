/**
 * Rewrite resume slugs created in the old `name/N` format to one URL segment
 * (`name-N`), so links of the form /resume/<slug> resolve. Idempotent: a second run
 * finds nothing to change. Runs on deploy after db:sync-indexes.
 *
 *   MONGODB_URI=... bun run db:migrate-slugs
 */
import mongoose from 'mongoose';

export interface SlugChange {
  from: string;
  to: string;
}

export async function migrateLegacySlugs(): Promise<SlugChange[]> {
  const resumes = mongoose.connection.collection('resumes');
  const legacy = await resumes
    .find({ slug: { $regex: '/' } }, { projection: { slug: 1 } })
    .toArray();

  const changes: SlugChange[] = [];
  for (const doc of legacy) {
    const from = String(doc.slug);
    let to = from.replace(/\//g, '-');
    if (await resumes.findOne({ slug: to }, { projection: { _id: 1 } })) {
      to = `${to}-${String(doc._id).slice(-6)}`;
    }
    await resumes.updateOne({ _id: doc._id, slug: from }, { $set: { slug: to } });
    changes.push({ from, to });
  }
  return changes;
}

if (import.meta.main) {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required');
  await mongoose.connect(uri);
  try {
    const changes = await migrateLegacySlugs();
    for (const c of changes) console.log(`${c.from} -> ${c.to}`);
    console.log(`${changes.length} slug(s) rewritten`);
  } finally {
    await mongoose.disconnect();
  }
}
