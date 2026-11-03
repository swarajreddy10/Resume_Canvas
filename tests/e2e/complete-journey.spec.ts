import fs from 'fs';
import { test, expect } from './fixtures';

test.describe('Resume journey', () => {
  test('a signed-in user creates, publishes and downloads a resume', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: 'Create New Resume' }).click();
    await page.waitForURL(/\/builder\/.+/);

    // The template carousel loops, so once Embla mounts both arrows can scroll.
    await expect(
      page.getByRole('button', { name: 'Next slide' })
    ).toBeEnabled();
    await expect(
      page.getByRole('button', { name: 'Previous slide' })
    ).toBeEnabled();

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

    const created = page.waitForResponse(
      (r) => r.url().endsWith('/api/resumes') && r.request().method() === 'POST'
    );
    await page.getByRole('button', { name: 'Publish Resume' }).click();
    await expect(
      page.getByText(/Resume (created|saved) successfully!/)
    ).toBeVisible();
    const { resume } = await (await created).json();

    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download PDF' }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    const pdf = fs.readFileSync(await download.path());
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');

    // Make it public and visit it once; the owner's views show the stored count, and no
    // figure is shown that the app does not measure.
    await page.getByRole('button', { name: 'Share' }).click();
    const share = page
      .getByRole('dialog', { name: 'Share Resume' })
      .getByRole('switch', { name: 'Make Public' });
    await share.click();
    await expect(share).toBeChecked();
    await page.keyboard.press('Escape');
    const visit = await page.request.get(`/api/resume/public/${resume._id}`);
    expect(visit.status()).toBe(200);

    await page.goto(`/builder/${resume._id}`);
    const views = page.getByRole('region', { name: 'Resume Analytics' });
    await expect(views).toContainText(/Total Views\s*1(?!\d)/);
    await expect(views).not.toContainText('Downloads');

    await page.goto('/analytics');
    const main = page.getByRole('main');
    await expect(main).toContainText(/Total Views\s*1(?!\d)/);
    await expect(main).not.toContainText('Downloads');
    await expect(main).not.toContainText('from last month');

    await page.goto('/dashboard');
    await expect(page.getByText('My Resumes')).toBeVisible();
  });
});
