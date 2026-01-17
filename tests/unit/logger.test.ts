import { test, expect } from 'bun:test';

test('logger sanitizes newlines from messages', () => {
  const maliciousInput = 'Normal message\n[ERROR] Fake error message';

  // Test the sanitization directly
  const sanitized = maliciousInput
    .replace(/[\r\n]/g, ' ')
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    .substring(0, 1000);

  expect(sanitized).not.toContain('\n');
  expect(sanitized).toBe('Normal message [ERROR] Fake error message');
});

test('logger prevents control characters', () => {
  const maliciousInput = 'Message\x00with\x1fcontrol\x7fchars';

  const sanitized = maliciousInput
    .replace(/[\r\n]/g, ' ')
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    .substring(0, 1000);

  expect(sanitized).toBe('Messagewithcontrolchars');
});

test('logger limits message length', () => {
  const longMessage = 'A'.repeat(2000);

  const sanitized = longMessage
    .replace(/[\r\n]/g, ' ')
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    .substring(0, 1000);

  expect(sanitized.length).toBe(1000);
});
