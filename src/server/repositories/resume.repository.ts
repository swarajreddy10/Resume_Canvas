import { Resume } from '@/lib/db/models/Resume';
import type { ResumeData } from '@/types/resume.unified';
import { safeKvGet, safeKvSet, safeKvDel } from '@/lib/cache/quota-aware';

export class ResumeRepository {
  async findByUser(email: string) {
    const cacheKey = `resumes:${email}`;
    const cached = await safeKvGet<unknown[]>(cacheKey);
    if (cached) return cached;

    const resumes = await Resume.find({ userEmail: email })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    await safeKvSet(cacheKey, resumes, 300);
    return resumes;
  }

  async findById(id: string) {
    return Resume.findById(id).lean().exec() as Promise<{
      userEmail: string;
      [key: string]: unknown;
    } | null>;
  }

  async findBySlug(slug: string, userEmail?: string) {
    const query: Record<string, unknown> = { slug };
    if (userEmail) query.userEmail = userEmail;
    return Resume.findOne(query).lean().exec();
  }

  async create(
    data: Partial<ResumeData> & {
      userEmail: string;
      title: string;
      slug: string;
    }
  ) {
    const resume = new Resume(data);
    const saved = await resume.save();
    await safeKvDel(`resumes:${data.userEmail}`);
    return saved;
  }

  async update(id: string, data: Partial<ResumeData>) {
    const resume = await Resume.findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
    if (resume && 'userEmail' in resume) {
      await safeKvDel(`resumes:${resume.userEmail}`);
    }
    return resume;
  }

  async delete(id: string) {
    return Resume.findByIdAndDelete(id).exec();
  }

  async incrementViewCount(id: string) {
    return Resume.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
  }
}
