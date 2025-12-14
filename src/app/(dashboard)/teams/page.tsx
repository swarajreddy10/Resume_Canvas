'use client';

import TeamWorkspace from '@/components/team/TeamWorkspace';

export default function TeamsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
        <p className="text-gray-600">
          Work together on resumes and share feedback
        </p>
      </div>

      <TeamWorkspace />
    </div>
  );
}
