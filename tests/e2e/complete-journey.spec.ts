import fs from 'fs';
import { test, expect } from './fixtures';

test.describe('Resume journey', () => {
  test('a signed-in user creates, publishes and downloads a resume', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: 'Create New Resume' }).click();
    await page.waitForURL(/\/builder\/.+/);

    await page.getByRole('textbox', { name: 'John Doe' }).fill('Jane Tester');
    await page
      .getByRole('textbox', { name: 'john@example.com' })
      .fill('jane@example.com');
    await page.getByRole('textbox', { name: 'Phone' }).fill('+1234567890');
    await page
      .getByRole('textbox', { name: 'Location' })
      .fill('San Francisco, CA');
    await page
      .getByRole('textbox', { name: 'Professional Summary *' })
      .fill('Software engineer with five years of web development experience.');

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
      .fill('Led a development team of five engineers.');

    await page.getByRole('button', { name: 'Publish Resume' }).click();
    await expect(
      page.getByText(/Resume (created|saved) successfully!/)
    ).toBeVisible();

    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download PDF' }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    const pdf = fs.readFileSync(await download.path());
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');

    await page.goto('/dashboard');
    await expect(page.getByText('My Resumes')).toBeVisible();
  });
});
