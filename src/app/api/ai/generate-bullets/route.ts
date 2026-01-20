import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/ai.service';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { resumeCache } from '@/lib/cache/memory-cache';
import crypto from 'crypto';

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { jobTitle, company, description, skills } = sanitizeInput(body);

      if (!jobTitle || !company || !description) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Create cache key from input hash
      const inputHash = crypto
        .createHash('md5')
        .update(JSON.stringify({ jobTitle, company, description, skills }))
        .digest('hex');
      const cacheKey = `ai:bullets:${inputHash}`;

      // Check cache first (24 hour cache for AI responses)
      const cached = resumeCache.get(cacheKey);
      if (cached) {
        return NextResponse.json(
          { bulletPoints: cached },
          {
            headers: {
              'Cache-Control': 'public, max-age=86400',
              'X-Cache': 'HIT',
            },
          }
        );
      }

      const bulletPoints = await aiService.generateBulletPoints({
        jobTitle,
        company,
        description,
        skills,
      });

      // Cache for 24 hours
      resumeCache.set(cacheKey, bulletPoints, 86400000);

      return NextResponse.json(
        { bulletPoints },
        {
          headers: {
            'Cache-Control': 'public, max-age=86400',
            'X-Cache': 'MISS',
          },
        }
      );
    } catch (error) {
      console.error(
        JSON.stringify({ level: 'error', msg: 'AI generation failed', error })
      );
      return NextResponse.json(
        { error: 'Failed to generate bullet points' },
        { status: 500 }
      );
    }
  })
);
