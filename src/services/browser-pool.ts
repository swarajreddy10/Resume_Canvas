import puppeteer, { Browser } from 'puppeteer';
import { appConfig } from '@/lib/config/app.config';
import { logger } from '@/lib/utils/logger';

class BrowserPool {
  private pool: Browser[] = [];
  private maxSize = 3;
  private creating = 0;

  async acquire(): Promise<Browser> {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }

    while (this.creating >= this.maxSize) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.creating++;
    try {
      const launchArgs = [
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
      ];

      if (!appConfig.security.puppeteer.sandbox) {
        launchArgs.push('--no-sandbox', '--disable-setuid-sandbox');
      }

      const browser = await puppeteer.launch({
        headless: true,
        args: launchArgs,
        timeout: appConfig.security.puppeteer.timeout,
      });

      return browser;
    } finally {
      this.creating--;
    }
  }

  async release(browser: Browser): Promise<void> {
    try {
      const pages = await browser.pages();
      await Promise.all(pages.map((page) => page.close().catch(() => {})));

      if (this.pool.length < this.maxSize) {
        this.pool.push(browser);
      } else {
        await browser.close();
      }
    } catch (error) {
      logger.error('Failed to release browser', { error });
      await browser.close().catch(() => {});
    }
  }

  async destroy(): Promise<void> {
    await Promise.all(this.pool.map((b) => b.close().catch(() => {})));
    this.pool = [];
  }
}

export const browserPool = new BrowserPool();
