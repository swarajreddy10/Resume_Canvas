'use client';

import CareerRecommendations from '@/components/ai/CareerRecommendations';

export default function CareerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Career Intelligence
        </h1>
        <p className="text-gray-600">
          AI-powered career guidance and skill development
        </p>
      </div>

      <CareerRecommendations />
    </div>
  );
}
