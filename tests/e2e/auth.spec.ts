import { test, expect } from '@playwright/test';

test.describe('ResumeCanvas E2E Flow', () => {
  test('create test account via sign in page', async ({ page }) => {
    await page.goto('/auth/signin');

    // Click "Sign up" button to switch to signup mode
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Fill signup form (embedded in same page)
    await page.getByRole('textbox', { name: 'Full Name' }).fill('Test User');
    await page
      .getByRole('textbox', { name: 'Email Address' })
      .fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Password123!');

    // Submit
    await page.getByRole('button', { name: 'Create account' }).click();

    // Should redirect to dashboard
    await page.waitForURL('/dashboard');
    await expect(page.getByText('My Resumes')).toBeVisible();
  });

  test('sign in shows error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin');

    // Fill invalid credentials
    await page
      .getByRole('textbox', { name: 'Email Address' })
      .fill('wrong@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');

    // Submit
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should show error message
    await expect(
      page.getByText('Sign in failed. Please check your credentials.')
    ).toBeVisible();
  });

  test('forgot password shows loading state', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    // Enter email
    await page
      .getByRole('textbox', { name: 'Email Address' })
      .fill('test@example.com');

    // Submit
    await page.getByRole('button', { name: 'Send Reset Link' }).click();

    // Check loading state
    await expect(
      page.getByRole('button', { name: 'Sending reset link...' })
    ).toBeVisible();
  });
});
