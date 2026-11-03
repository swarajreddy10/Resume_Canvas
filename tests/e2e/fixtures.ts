/**
 * One signed-in account per Playwright worker, so parallel workers never share
 * server-side state. https://playwright.dev/docs/auth#moderate-one-account-per-parallel-worker
 *
 * The account is created through the app's own registration API, then signed in through
 * the sign-in page; the resulting cookies are saved once per worker and reused.
 */
import { test as base, expect, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export { expect };

export type Account = { name: string; email: string; password: string };

/** A fresh account no other test or worker uses. */
export function newAccount(label: string): Account {
  const id = `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    name: 'E2E Tester',
    email: `e2e-${id}@example.com`,
    password: 'E2e-Passw0rd!',
  };
}

export async function signIn(page: Page, account: Account): Promise<void> {
  await page.goto('/auth/signin');
  await page
    .getByRole('textbox', { name: 'Email Address' })
    .fill(account.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForURL('**/dashboard');
}

export const test = base.extend<
  { account: Account },
  { workerAccount: Account; workerStorageState: string }
>({
  account: ({ workerAccount }, provide) => provide(workerAccount),

  workerAccount: [
    async ({ playwright }, provide, workerInfo) => {
      const account = newAccount(`w${workerInfo.parallelIndex}`);
      const api = await playwright.request.newContext({
        baseURL: workerInfo.project.use.baseURL,
      });
      const res = await api.post('/api/user/register', { data: account });
      expect(res.status(), await res.text()).toBe(200);
      await api.dispose();
      await provide(account);
    },
    { scope: 'worker' },
  ],

  workerStorageState: [
    async ({ browser, workerAccount }, provide, workerInfo) => {
      const file = path.resolve(
        workerInfo.project.outputDir,
        `.auth/${workerInfo.parallelIndex}.json`
      );
      fs.mkdirSync(path.dirname(file), { recursive: true });
      const page = await browser.newPage({
        storageState: undefined,
        baseURL: workerInfo.project.use.baseURL,
      });
      await signIn(page, workerAccount);
      await page.context().storageState({ path: file });
      await page.close();
      await provide(file);
    },
    { scope: 'worker' },
  ],

  storageState: ({ workerStorageState }, provide) =>
    provide(workerStorageState),
});
