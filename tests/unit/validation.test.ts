import { test, expect, describe } from 'bun:test';
import {
  PersonalInfoSchema,
  EducationSchema,
  ExperienceSchema,
  ProjectSchema,
  CertificationSchema,
} from '@/lib/validation/resume.schemas';
import { EMAIL_REGEX } from '@/lib/validation/email.regex';

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

  // The store is MongoDB through Mongoose and output is escaped, so an apostrophe is data
  // (McDonald's, L'Oréal); what the allow-list still refuses is the statement syntax.
  test('rejects SQL injection attempts', () => {
    const sqlInjections = [
      "'; DROP TABLE users--",
      "1' OR '1'='1",
      'admin";--',
    ];
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

// Names, employers, schools and places in any script, with the punctuation they carry.
// https://www.w3.org/International/questions/qa-personal-names
describe('international input', () => {
  const person = (name: string) => ({
    name,
    email: 'zoe@example.com',
    summary: 'Backend engineer with two years of Go, PostgreSQL and AWS.',
  });
  const job = (company: string, location = 'Zürich') => ({
    company,
    position: 'Software Engineer',
    location,
    startDate: '2024',
    endDate: 'Present',
    description: 'Built a job ingestion pipeline in Go and PostgreSQL.',
    bullets: [
      'Cut a nightly batch from 30 to 4 minutes with COPY.',
      'Added dead-letter recovery for failed messages.',
    ],
  });

  test.each([
    'José García',
    'Zoë Ñúñez-Øberg',
    '李小龙',
    'Nguyễn Văn An',
    'O’Brien',
    'Zoë Müller', // decomposed: e and u followed by a combining diaeresis
  ])('accepts the name %s', (name) => {
    expect(PersonalInfoSchema.safeParse(person(name)).success).toBe(true);
  });

  test.each([
    'Café Ünïcode GmbH',
    'Société Générale',
    "McDonald's",
    'L’Oréal',
    '株式会社トヨタ',
  ])('accepts the employer %s', (company) => {
    expect(ExperienceSchema.safeParse(job(company)).success).toBe(true);
  });

  test.each(['São Paulo', 'Coeur d’Alene', 'München, Bayern', '東京'])(
    'accepts the location %s',
    (location) => {
      expect(ExperienceSchema.safeParse(job('Acme', location)).success).toBe(
        true
      );
    }
  );

  test('accepts a school outside the ASCII range', () => {
    expect(
      EducationSchema.safeParse({
        school: 'Universität Zürich',
        degree: 'BSc',
        field: 'Informatik',
        startDate: '2018',
        endDate: '2022',
        location: 'Zürich',
      }).success
    ).toBe(true);
  });

  test('still refuses markup and digits in a name', () => {
    expect(PersonalInfoSchema.safeParse(person('Zoë<script>')).success).toBe(
      false
    );
    expect(PersonalInfoSchema.safeParse(person('Zoë 2')).success).toBe(false);
  });

  // Persian compounds need U+200C (ZWNJ) to break joining, and Indic clusters take U+200C or
  // U+200D (ZWJ) after the virama, both inside words (W3C Arabic and Persian layout
  // requirements; Unicode Indic FAQ). Outside a word they are only invisible noise.
  test.each([
    ['a Persian name with a non-joiner', 'علی‌رضا'],
    ['a Devanagari name with a joiner', 'क्‍ष'],
  ])('accepts %s', (_, name) => {
    expect(PersonalInfoSchema.safeParse(person(name)).success).toBe(true);
  });

  // Before Unicode 5.1 the five Malayalam chillus were written consonant + virama + ZWJ, so
  // the joiner can end a word, and older data still holds that form (Unicode 17, section
  // 12.9, Table 12-42: "implementations must be prepared to handle both kinds of data").
  const VIRAMA = String.fromCharCode(0x0d4d);
  const ZWJ = String.fromCharCode(0x200d);
  const ZWNJ = String.fromCharCode(0x200c);
  const school = (school: string, location = 'Kochi') => ({
    school,
    degree: 'BTech',
    field: 'Computer Science',
    startDate: '2018',
    endDate: '2022',
    location,
  });
  // Every field the script patterns check: name, school, employer, and both locations.
  const fields = [
    ['name', (v: string) => PersonalInfoSchema.safeParse(person(v)).success],
    ['school', (v: string) => EducationSchema.safeParse(school(v)).success],
    [
      'school location',
      (v: string) => EducationSchema.safeParse(school('CUSAT', v)).success,
    ],
    ['employer', (v: string) => ExperienceSchema.safeParse(job(v)).success],
    [
      'job location',
      (v: string) => ExperienceSchema.safeParse(job('Acme', v)).success,
    ],
  ] as const;

  test.each([
    ['nna', 'ണ'],
    ['na', 'ന'],
    ['rra', 'ര'],
    ['la', 'ല'],
    ['lla', 'ള'],
  ])('accepts a legacy chillu %s at the end of a word', (_, consonant) => {
    const value = `മോഹ${consonant}${VIRAMA}${ZWJ} കുമാർ`;
    for (const [, accepts] of fields) expect(accepts(value)).toBe(true);
  });

  test.each([
    ['after a consonant the table does not list (ka)', `മോഹക${VIRAMA}${ZWJ}`],
    ['as a non-joiner', `മോഹന${VIRAMA}${ZWNJ}`],
    ['twice', `മോഹന${VIRAMA}${ZWJ}${ZWJ}`],
    ['twice before a letter', `മോഹന${VIRAMA}${ZWJ}${ZWJ}ക`],
    ['then a non-joiner before a letter', `മോഹന${VIRAMA}${ZWJ}${ZWNJ}ക`],
    ['with no virama', `മോഹന${ZWJ}`],
  ])('refuses a Malayalam joiner %s', (_, value) => {
    for (const [, accepts] of fields) expect(accepts(value)).toBe(false);
  });

  // A pattern rule for legacy chillus that overlapped the between-letters joiner rule let
  // each joiner match two ways: 22 of them before a refused character took over a second.
  test.each(fields)(
    'refuses a long run of legacy chillus in the %s in linear time',
    (_, accepts) => {
      // Plain chillus, and chillus each followed by a second joiner, which stay as written.
      for (const unit of [`ന${VIRAMA}${ZWJ}`, `ന${VIRAMA}${ZWJ}${ZWJ}`]) {
        const start = performance.now();
        expect(accepts(unit.repeat(22) + 'ന<')).toBe(false);
        expect(performance.now() - start).toBeLessThan(250);
      }
    }
  );

  test('accepts a non-joiner inside an employer and a location', () => {
    expect(
      ExperienceSchema.safeParse(job('نرم‌افزار', 'تهران‌پارس')).success
    ).toBe(true);
  });

  test.each([
    ['after the last letter', 'Zoë‌'],
    ['before the first letter', '‍Zoë'],
    ['between spaces', 'Zoë ‌ Ñúñez'],
  ])('refuses a joiner %s', (_, name) => {
    expect(PersonalInfoSchema.safeParse(person(name)).success).toBe(false);
  });
});

// The models check this on every save, and job-application contacts reach it with no
// length limit before it, so it must reject in linear time.
describe('EMAIL_REGEX', () => {
  test.each([
    'zoe@example.com',
    'first.last+tag@mail.example.co.uk',
    'zoë@exämple.de',
  ])('accepts %s', (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(true);
  });

  test.each([
    '',
    'zoe',
    'zoe@example',
    '@example.com',
    'zoe@example.',
    'zoe@@example.com',
    'zo e@example.com',
  ])('refuses %j', (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(false);
  });

  test('refuses a long run of dots in linear time', () => {
    const start = performance.now();
    expect(EMAIL_REGEX.test(`a@${'.'.repeat(50_000)}@`)).toBe(false);
    expect(performance.now() - start).toBeLessThan(250);
  });
});
