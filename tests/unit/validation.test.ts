import { test, expect, describe } from 'bun:test';
import {
  PersonalInfoSchema,
  EducationSchema,
  ExperienceSchema,
  ProjectSchema,
  CertificationSchema,
} from '@/lib/validation/resume.schemas';

describe('PersonalInfoSchema - Edge Cases', () => {
  test('validates correct personal info', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      summary: 'Experienced software engineer with 5+ years of expertise',
    };
    expect(() => PersonalInfoSchema.parse(data)).not.toThrow();
  });

  test('rejects invalid email formats', () => {
    const invalidEmails = [
      'invalid',
      '@example.com',
      'test@',
      'test..@example.com',
      'test @example.com',
    ];
    invalidEmails.forEach((email) => {
      expect(() =>
        PersonalInfoSchema.parse({
          name: 'John Doe',
          email,
          phone: '+1234567890',
          summary: 'Experienced software engineer with 5+ years of expertise',
        })
      ).toThrow();
    });
  });

  test('rejects names with invalid characters', () => {
    const invalidNames = ['John123', 'John@Doe', 'John<script>'];
    invalidNames.forEach((name) => {
      expect(() =>
        PersonalInfoSchema.parse({
          name,
          email: 'john@example.com',
          phone: '+1234567890',
          summary: 'Experienced software engineer with 5+ years of expertise',
        })
      ).toThrow();
    });
  });

  test('accepts valid name variations', () => {
    const validNames = ['John Doe', 'Mary-Jane Smith', 'Dr. Smith'];
    validNames.forEach((name) => {
      expect(() =>
        PersonalInfoSchema.parse({
          name,
          email: 'john@example.com',
          phone: '+1234567890',
          summary: 'Experienced software engineer with 5+ years of expertise',
        })
      ).not.toThrow();
    });
  });

  test('rejects XSS attempts in fields', () => {
    const xssAttempts = [
      "<script>alert('xss')</script>",
      'javascript:alert(1)',
      '<img src=x onerror=alert(1)>',
    ];
    xssAttempts.forEach((xss) => {
      expect(() =>
        PersonalInfoSchema.parse({
          name: xss,
          email: 'john@example.com',
          phone: '+1234567890',
          summary: 'Experienced software engineer with 5+ years of expertise',
        })
      ).toThrow();
    });
  });

  test('rejects summary below minimum length', () => {
    expect(() =>
      PersonalInfoSchema.parse({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        summary: 'Short',
      })
    ).toThrow();
  });

  test('rejects summary above maximum length', () => {
    expect(() =>
      PersonalInfoSchema.parse({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        summary: 'a'.repeat(1001),
      })
    ).toThrow();
  });

  test('validates international phone numbers', () => {
    const validPhones = ['+1234567890', '+919876543210'];
    validPhones.forEach((phone) => {
      expect(() =>
        PersonalInfoSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
          phone,
          summary: 'Experienced software engineer with 5+ years of expertise',
        })
      ).not.toThrow();
    });
  });

  test('rejects invalid URLs', () => {
    const invalidUrls = [
      'not-a-url',
      'ftp://example.com',
      '//example.com',
      'javascript:void(0)',
    ];
    invalidUrls.forEach((url) => {
      expect(() =>
        PersonalInfoSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          linkedin: url,
          summary: 'Experienced software engineer with 5+ years of expertise',
        })
      ).toThrow();
    });
  });

  test('accepts valid HTTPS URLs', () => {
    const validUrls = [
      'https://linkedin.com/in/johndoe',
      'https://github.com/johndoe',
      'https://johndoe.com',
    ];
    validUrls.forEach((url) => {
      expect(() =>
        PersonalInfoSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          linkedin: url,
          summary: 'Experienced software engineer with 5+ years of expertise',
        })
      ).not.toThrow();
    });
  });
});

describe('EducationSchema - Edge Cases', () => {
  test('validates boundary GPA values', () => {
    const validGPAs = ['0.0/4.0', '4.0/4.0', '10.0/10.0', '3.5'];
    validGPAs.forEach((gpa) => {
      expect(() =>
        EducationSchema.parse({
          school: 'MIT',
          degree: 'BS',
          field: 'CS',
          startDate: '2015',
          endDate: '2019',
          gpa,
          location: 'Cambridge, MA',
        })
      ).not.toThrow();
    });
  });

  test('rejects invalid GPA values', () => {
    const invalidGPAs = ['11.0', '-1.0', 'abc'];
    invalidGPAs.forEach((gpa) => {
      expect(() =>
        EducationSchema.parse({
          school: 'MIT',
          degree: 'BS',
          field: 'CS',
          startDate: '2015',
          endDate: '2019',
          gpa,
          location: 'Cambridge, MA',
        })
      ).toThrow();
    });
  });

  test('accepts all valid date formats', () => {
    const validDates = [
      '01/2015',
      '2015',
      'Jan 2015',
      'January 2015',
      'Present',
    ];
    validDates.forEach((date) => {
      expect(() =>
        EducationSchema.parse({
          school: 'MIT',
          degree: 'BS',
          field: 'CS',
          startDate: date,
          endDate: 'Present',
          location: 'Cambridge, MA',
        })
      ).not.toThrow();
    });
  });

  test('rejects invalid date formats', () => {
    const invalidDates = ['2015-01', '01-01-2015', '32/2015', '13/2015', 'abc'];
    invalidDates.forEach((date) => {
      expect(() =>
        EducationSchema.parse({
          school: 'MIT',
          degree: 'BS',
          field: 'CS',
          startDate: date,
          endDate: '2019',
          location: 'Cambridge, MA',
        })
      ).toThrow();
    });
  });

  test('rejects SQL injection attempts', () => {
    const sqlInjections = ["'; DROP TABLE users--", "1' OR '1'='1", "admin'--"];
    sqlInjections.forEach((sql) => {
      expect(() =>
        EducationSchema.parse({
          school: sql,
          degree: 'BS',
          field: 'CS',
          startDate: '2015',
          endDate: '2019',
          location: 'Cambridge, MA',
        })
      ).toThrow();
    });
  });
});

describe('ExperienceSchema - Edge Cases', () => {
  test('validates minimum bullet requirements', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Google',
        position: 'Engineer',
        location: 'CA',
        startDate: '2020',
        endDate: 'Present',
        description:
          'Developed scalable web applications using modern technologies',
        bullets: ['a'.repeat(25), 'b'.repeat(25)],
      })
    ).not.toThrow();
  });

  test('rejects single bullet', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Google',
        position: 'Engineer',
        location: 'CA',
        startDate: '2020',
        endDate: 'Present',
        description:
          'Developed scalable web applications using modern technologies',
        bullets: ['Only one bullet point here'],
      })
    ).toThrow();
  });

  test('rejects more than 5 bullets', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Google',
        position: 'Engineer',
        location: 'CA',
        startDate: '2020',
        endDate: 'Present',
        description:
          'Developed scalable web applications using modern technologies',
        bullets: Array(6).fill('a'.repeat(25)),
      })
    ).toThrow();
  });

  test('rejects bullets below minimum length', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Google',
        position: 'Engineer',
        location: 'CA',
        startDate: '2020',
        endDate: 'Present',
        description:
          'Developed scalable web applications using modern technologies',
        bullets: ['Short', 'Also short'],
      })
    ).toThrow();
  });

  test('rejects bullets above maximum length', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Google',
        position: 'Engineer',
        location: 'CA',
        startDate: '2020',
        endDate: 'Present',
        description:
          'Developed scalable web applications using modern technologies',
        bullets: ['a'.repeat(201), 'b'.repeat(25)],
      })
    ).toThrow();
  });

  test('rejects description below minimum', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Google',
        position: 'Engineer',
        location: 'CA',
        startDate: '2020',
        endDate: 'Present',
        description: 'Short',
        bullets: ['a'.repeat(25), 'b'.repeat(25)],
      })
    ).toThrow();
  });

  test('rejects description above maximum', () => {
    expect(() =>
      ExperienceSchema.parse({
        company: 'Google',
        position: 'Engineer',
        location: 'CA',
        startDate: '2020',
        endDate: 'Present',
        description: 'a'.repeat(501),
        bullets: ['a'.repeat(25), 'b'.repeat(25)],
      })
    ).toThrow();
  });
});

describe('ProjectSchema - Edge Cases', () => {
  test('validates minimum technology length', () => {
    expect(() =>
      ProjectSchema.parse({
        name: 'Project',
        description: 'a'.repeat(25),
        technologies: 'React',
        url: '',
        startDate: '2021',
        endDate: '2021',
      })
    ).not.toThrow();
  });

  test('rejects technologies below minimum', () => {
    expect(() =>
      ProjectSchema.parse({
        name: 'Project',
        description: 'a'.repeat(25),
        technologies: 'JS',
        url: '',
        startDate: '2021',
        endDate: '2021',
      })
    ).toThrow();
  });

  test('accepts empty URL', () => {
    expect(() =>
      ProjectSchema.parse({
        name: 'Project',
        description: 'a'.repeat(25),
        technologies: 'React',
        url: '',
        startDate: '2021',
        endDate: '2021',
      })
    ).not.toThrow();
  });

  test('rejects invalid URL protocols', () => {
    expect(() =>
      ProjectSchema.parse({
        name: 'Project',
        description: 'a'.repeat(25),
        technologies: 'React',
        url: 'ftp://example.com',
        startDate: '2021',
        endDate: '2021',
      })
    ).toThrow();
  });
});

describe('CertificationSchema - Edge Cases', () => {
  test('validates complete certification', () => {
    expect(() =>
      CertificationSchema.parse({
        name: 'AWS Certified',
        issuer: 'Amazon',
        date: '03/2022',
        url: 'https://aws.amazon.com/certification',
      })
    ).not.toThrow();
  });

  test('rejects empty required fields', () => {
    expect(() =>
      CertificationSchema.parse({
        name: '',
        issuer: 'Amazon',
        date: '03/2022',
        url: '',
      })
    ).toThrow();
  });

  test('validates without URL', () => {
    expect(() =>
      CertificationSchema.parse({
        name: 'AWS Certified',
        issuer: 'Amazon',
        date: '03/2022',
        url: '',
      })
    ).not.toThrow();
  });
});
