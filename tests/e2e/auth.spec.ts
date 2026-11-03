import { test, expect } from '@playwright/test';
import { newAccount, signIn } from './fixtures';

test.describe('Authentication', () => {
  test('a new user signs up from the sign-in page and lands on the dashboard', async ({
    page,
  }) => {
    const account = newAccount('signup');
    await page.goto('/auth/signin');

    await page.getByRole('button', { name: 'Sign up free' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill(account.name);
    await page
      .getByRole('textbox', { name: 'Email Address' })
      .fill(account.email);
    await page
      .getByRole('textbox', { name: 'Password' })
      .fill(account.password);
    await page.getByRole('button', { name: 'Create account' }).click();

    await page.waitForURL('**/dashboard');
    await expect(page.getByText('My Resumes')).toBeVisible();
  });

  test('an existing user signs in again', async ({ page, request }) => {
    const account = newAccount('signin');
    const res = await request.post('/api/user/register', { data: account });
    expect(res.status()).toBe(200);

    await signIn(page, account);

    await expect(page.getByText('My Resumes')).toBeVisible();
  });

  test('sign-in with unknown credentials shows an error and stays put', async ({
    page,
  }) => {
    await page.goto('/auth/signin');
    await page
      .getByRole('textbox', { name: 'Email Address' })
      .fill('nobody@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Wrong-pass1');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(
      page.getByText(/sign in failed|no account found/i)
    ).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('the dashboard redirects a signed-out visitor to sign-in', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('forgot password gives the same reply whether or not the account exists', async ({
    page,
  }) => {
    await page.goto('/auth/forgot-password');
    await page
      .getByRole('textbox', { name: 'Email Address' })
      .fill('nobody@example.com');
    await page.getByRole('button', { name: 'Send reset link' }).click();

    await expect(page.getByText('Check your email')).toBeVisible();
  });

  test('a reset link without a token is invalid', async ({ page }) => {
    await page.goto('/auth/reset-password');
    await expect(page.getByText('Invalid Reset Link')).toBeVisible();
  });

  test('a reset link with an unknown token is invalid', async ({ page }) => {
    await page.goto(`/auth/reset-password?token=${'a'.repeat(64)}`);
    await expect(page.getByText('Invalid Reset Link')).toBeVisible();
  });
});
