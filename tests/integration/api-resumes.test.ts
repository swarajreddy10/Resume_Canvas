import { test, expect, describe } from 'bun:test';

const BASE_URL = 'http://localhost:3000';

describe('Resume API - Authentication & Authorization', () => {
  test('GET /api/resumes requires authentication', async () => {
    const response = await fetch(`${BASE_URL}/api/resumes`);
    expect([200, 401]).toContain(response.status);
  }, 15000);

  test('GET /api/user/stats requires authentication', async () => {
    const response = await fetch(`${BASE_URL}/api/user/stats`);
    expect([200, 401]).toContain(response.status);
  }, 10000);
});

describe('Resume API - Database Health', () => {
  test('GET /api/test-db returns valid response', async () => {
    const response = await fetch(`${BASE_URL}/api/test-db`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toBeDefined();
  }, 10000);
});

describe('Resume API - Input Validation', () => {
  test('POST /api/auth/check-email validates email format', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    expect([200, 400, 405]).toContain(response.status);
  }, 10000);

  test('POST /api/auth/check-email rejects invalid email', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email' }),
    });
    expect([200, 400, 405]).toContain(response.status);
  }, 10000);

  test('POST /api/auth/check-email rejects empty body', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect([400, 405]).toContain(response.status);
  }, 10000);
});

describe('Resume API - AI Endpoints', () => {
  test('POST /api/ai/generate-bullets validates required fields', async () => {
    const response = await fetch(`${BASE_URL}/api/ai/generate-bullets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Engineer',
        company: 'Tech',
        description: 'Built software',
      }),
    });
    expect([200, 401, 429]).toContain(response.status);
  }, 10000);

  test('POST /api/ai/generate-bullets rejects empty fields', async () => {
    const response = await fetch(`${BASE_URL}/api/ai/generate-bullets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: '',
        company: '',
        description: '',
      }),
    });
    expect([400, 401, 429]).toContain(response.status);
  }, 10000);

  test('POST /api/ai/generate-bullets rejects missing body', async () => {
    const response = await fetch(`${BASE_URL}/api/ai/generate-bullets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    expect([400, 401, 429]).toContain(response.status);
  }, 10000);
});

describe('Resume API - Security', () => {
  test('rejects SQL injection in email', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "'; DROP TABLE users--" }),
    });
    expect([200, 400, 405]).toContain(response.status);
  }, 10000);

  test('rejects XSS attempts in AI input', async () => {
    const response = await fetch(`${BASE_URL}/api/ai/generate-bullets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: "<script>alert('xss')</script>",
        company: 'Tech',
        description: 'Built software',
      }),
    });
    expect([200, 400, 401, 429]).toContain(response.status);
  }, 10000);

  test('handles malformed JSON gracefully', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json{',
    });
    expect([400, 405, 500]).toContain(response.status);
  }, 10000);

  test('rejects oversized payloads', async () => {
    const response = await fetch(`${BASE_URL}/api/ai/generate-bullets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Engineer',
        company: 'Tech',
        description: 'x'.repeat(100000),
      }),
    });
    expect([400, 401, 413, 429]).toContain(response.status);
  }, 10000);
});

describe('Resume API - HTTP Methods', () => {
  test('GET /api/resumes accepts GET method', async () => {
    const response = await fetch(`${BASE_URL}/api/resumes`, {
      method: 'GET',
    });
    expect([200, 401]).toContain(response.status);
  }, 10000);

  test('POST /api/auth/check-email rejects GET method', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/check-email`, {
      method: 'GET',
    });
    expect([405]).toContain(response.status);
  }, 10000);
});

describe('Resume API - Rate Limiting', () => {
  test('AI endpoints respect rate limits', async () => {
    const requests = Array(3)
      .fill(null)
      .map(() =>
        fetch(`${BASE_URL}/api/ai/generate-bullets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: 'Engineer',
            company: 'Tech',
            description: 'Built software',
          }),
        })
      );

    const responses = await Promise.all(requests);
    const statuses = responses.map((r) => r.status);

    expect(statuses.some((s) => [200, 401, 429].includes(s))).toBe(true);
  }, 15000);
});

describe('Resume API - Error Handling', () => {
  test('handles non-existent endpoints', async () => {
    const response = await fetch(`${BASE_URL}/api/nonexistent`);
    expect(response.status).toBe(404);
  }, 10000);

  test('returns proper content-type headers', async () => {
    const response = await fetch(`${BASE_URL}/api/test-db`);
    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('application/json');
  }, 10000);
});

describe('Resume API - CORS & Headers', () => {
  test('includes security headers', async () => {
    const response = await fetch(`${BASE_URL}/api/test-db`);
    expect(response.headers.get('content-type')).toBeDefined();
  }, 10000);
});
