import { test, expect } from 'bun:test';
import { sanitizeString, sanitizeInput } from '@/lib/security/sanitize';

test('sanitizeString prevents XSS with script tags', () => {
  const malicious = '<script>alert("xss")</script>';
  const clean = sanitizeString(malicious);

  expect(clean).not.toContain('<script>');
  expect(clean).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
});

test('sanitizeString prevents javascript URLs', () => {
  const malicious = 'javascript:alert("xss")';
  const clean = sanitizeString(malicious);

  expect(clean).not.toContain('javascript:');
  expect(clean).toBe('alert(&quot;xss&quot;)');
});

test('sanitizeString prevents event handlers', () => {
  const malicious = 'onclick=alert("xss")';
  const clean = sanitizeString(malicious);

  expect(clean).not.toContain('onclick=');
  expect(clean).toBe('alert(&quot;xss&quot;)');
});

test('sanitizeString prevents data URLs', () => {
  const malicious = 'data:text/html,<script>alert(1)</script>';
  const clean = sanitizeString(malicious);

  expect(clean).not.toContain('data:');
});

test('sanitizeInput works recursively on objects', () => {
  const maliciousObj = {
    name: '<script>alert("xss")</script>',
    nested: {
      value: 'javascript:alert("nested")',
      safe: 'normal text',
    },
  };

  const clean = sanitizeInput(maliciousObj);

  expect(clean.name).toBe(
    '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
  );
  expect(clean.nested.value).toBe('alert(&quot;nested&quot;)');
  expect(clean.nested.safe).toBe('normal text');
});

test('sanitizeInput works on arrays', () => {
  const maliciousArray = [
    '<script>alert(1)</script>',
    'normal text',
    'javascript:alert(2)',
  ];

  const clean = sanitizeInput(maliciousArray);

  expect(clean[0]).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(clean[1]).toBe('normal text');
  expect(clean[2]).toBe('alert(2)');
});
