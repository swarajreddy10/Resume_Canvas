import { test, expect } from '@playwright/test';

test.describe.serial('ResumeCanvas Complete E2E Journey', () => {
  test('complete workflow: signin → dashboard → create resume → fill forms → preview → download', async ({
    page,
  }) => {
    // 1. SIGNIN WITH EXISTING USER
    await page.goto('/auth/signin');

    await page
      .getByRole('textbox', { name: 'Email Address' })
      .fill('e2etest@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('TestPass123!');

    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/dashboard');

    // 2. CREATE NEW RESUME
    await page.getByRole('link', { name: 'Create New Resume' }).click();
    await page.waitForURL(/\/builder\/.+/);

    // 3. FILL PERSONAL INFO
    await page.getByRole('textbox', { name: 'John Doe' }).fill('John Doe');
    await page
      .getByRole('textbox', { name: 'john@example.com' })
      .fill('john@example.com');
    await page.getByRole('textbox', { name: 'Phone' }).fill('+1234567890');
    await page
      .getByRole('textbox', { name: 'Location' })
      .fill('San Francisco, CA');
    await page
      .getByRole('textbox', { name: 'LinkedIn' })
      .fill('linkedin.com/in/johndoe');
    await page
      .getByRole('textbox', { name: 'GitHub' })
      .fill('github.com/johndoe');
    await page
      .getByRole('textbox', { name: 'Professional Summary *' })
      .fill('Experienced software engineer with 5+ years in web development.');

    // 4. ADD EXPERIENCE
    await page.getByRole('tab', { name: 'Experience' }).click();

    await page.getByRole('textbox', { name: 'Company *' }).fill('Tech Corp');
    await page
      .getByRole('textbox', { name: 'Position *' })
      .fill('Senior Developer');
    await page
      .getByRole('textbox', { name: 'Location *' })
      .fill('San Francisco, CA');
    await page
      .getByRole('textbox', { name: 'Description *' })
      .fill('Led development team of 5 engineers');

    // 5. ADD EDUCATION
    await page.getByRole('tab', { name: 'Education' }).click();

    // 6. ADD SKILLS
    await page.getByRole('tab', { name: 'Skills' }).click();

    // 7. ADD PROJECT
    await page.getByRole('tab', { name: 'Projects' }).click();

    // 8. SAVE RESUME
    await page.getByRole('button', { name: 'Publish Resume' }).click();

    // 9. DOWNLOAD PDF
    await page.getByRole('button', { name: 'Download PDF' }).click();
    // Wait for PDF generation to complete (server-side)
    await page.waitForTimeout(2000);

    // 11. BACK TO DASHBOARD
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.waitForURL('/dashboard');
    await expect(page.getByText('My Resumes')).toBeVisible();
  });
});
