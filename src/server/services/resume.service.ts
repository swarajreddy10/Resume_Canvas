import { ResumeRepository } from '../repositories/resume.repository';
import type { ResumeData } from '@/types/resume.unified';

export class ResumeService {
  constructor(private repo = new ResumeRepository()) {}

  async getUserResumes(email: string) {
    return this.repo.findByUser(email);
  }

  async getResumeById(id: string) {
    return this.repo.findById(id);
  }

  async getResumeBySlug(slug: string, userEmail?: string) {
    return this.repo.findBySlug(slug, userEmail);
  }

  async createResume(
    data: Partial<ResumeData> & {
      userEmail: string;
      title: string;
      slug: string;
    }
  ) {
    return this.repo.create(data);
  }

  async updateResume(id: string, data: Partial<ResumeData>) {
    return this.repo.update(id, data);
  }

  async deleteResume(id: string) {
    return this.repo.delete(id);
  }

  async trackView(id: string) {
    return this.repo.incrementViewCount(id);
  }
}

export const resumeService = new ResumeService();
