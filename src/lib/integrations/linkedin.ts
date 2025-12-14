interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  positions: LinkedInPosition[];
  educations: LinkedInEducation[];
  skills: string[];
}

interface LinkedInPosition {
  title: string;
  companyName: string;
  description: string;
  startDate: { month: number; year: number };
  endDate?: { month: number; year: number };
  location: string;
}

interface LinkedInEducation {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: { year: number };
  endDate: { year: number };
}

export class LinkedInIntegration {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getProfile(): Promise<LinkedInProfile | null> {
    try {
      // Mock implementation - in production, use LinkedIn API
      return {
        id: 'linkedin-123',
        firstName: 'John',
        lastName: 'Doe',
        headline: 'Senior Software Engineer at Tech Corp',
        summary:
          'Experienced software engineer with 5+ years in full-stack development...',
        positions: [
          {
            title: 'Senior Software Engineer',
            companyName: 'Tech Corp',
            description: 'Led development of scalable web applications...',
            startDate: { month: 1, year: 2022 },
            location: 'San Francisco, CA',
          },
        ],
        educations: [
          {
            schoolName: 'University of Technology',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            startDate: { year: 2016 },
            endDate: { year: 2020 },
          },
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      };
    } catch (error) {
      console.error('LinkedIn API error:', error);
      return null;
    }
  }

  convertToResumeFormat(profile: LinkedInProfile) {
    return {
      personalInfo: {
        name: `${profile.firstName} ${profile.lastName}`,
        summary: profile.summary,
      },
      experience: profile.positions.map((pos) => ({
        company: pos.companyName,
        position: pos.title,
        location: pos.location,
        startDate: `${pos.startDate.month}/${pos.startDate.year}`,
        endDate: pos.endDate
          ? `${pos.endDate.month}/${pos.endDate.year}`
          : 'Present',
        description: pos.description,
        bullets: [],
      })),
      education: profile.educations.map((edu) => ({
        school: edu.schoolName,
        degree: edu.degree,
        field: edu.fieldOfStudy,
        startDate: `${edu.startDate.year}`,
        endDate: `${edu.endDate.year}`,
        location: '',
        gpa: '',
      })),
      skills: profile.skills,
    };
  }
}
