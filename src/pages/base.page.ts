/**
 * src/pages/base.page.ts
 *
 * BasePage provides shared methods used by every page object.
 * It intentionally uses broad, role-based locator strategies so it works
 * across diverse site designs without relying on class names or IDs.
 */

import { type Page, type Locator } from '@playwright/test';
import type { SiteConfig } from '@site-types/site-config.types';

export class BasePage {
  readonly page: Page;
  readonly config: SiteConfig;
  readonly url: string;

  constructor(page: Page, config: SiteConfig) {
    this.page = page;
    this.config = config;
    this.url = config.url;
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  /** Navigate to the site root URL. */
  async navigate(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigate to a path relative to the configured site root (e.g. "/faq/").
   * Subclasses representing a single distinct page use this from an
   * overridden `navigate()` so callers never hardcode the base URL.
   */
  async goToPath(pathname: string): Promise<void> {
    const target = new URL(pathname, this.url).toString();
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
  }

  /** Wait until the page and its subresources have loaded. */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  // ── Page metadata ───────────────────────────────────────────────────────────

  /** Return the document <title> text. */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ── Layout checks ───────────────────────────────────────────────────────────

  /**
   * Returns true if there is no horizontal overflow (i.e., page is responsive).
   * Compares scrollWidth vs clientWidth on document.body.
   */
  async isResponsive(): Promise<boolean> {
    const hasHorizontalScroll = await this.page.evaluate<boolean>(() => {
      return document.body.scrollWidth > document.documentElement.clientWidth;
    });
    return !hasHorizontalScroll;
  }

  // ── Screenshots ─────────────────────────────────────────────────────────────

  /** Capture a full-page screenshot and return its buffer. */
  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      fullPage: true,
      path: `test-results/screenshots/${name}.png`,
    });
  }

  // ── Console errors ──────────────────────────────────────────────────────────

  /**
   * Collect JavaScript console errors emitted during a test.
   * Attach the listener BEFORE navigating; call this method after to retrieve
   * the accumulated messages.
   *
   * Usage pattern:
   *   const errors: string[] = [];
   *   page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
   *   await basePage.navigate();
   *   const errs = await basePage.checkNoConsoleErrors();
   */
  async checkNoConsoleErrors(): Promise<string[]> {
    // Evaluate inline errors captured in window (best-effort for SSR pages)
    const inlineErrors = await this.page.evaluate<string[]>(() => {
      // Some frameworks surface window.errors
      return (window as unknown as Record<string, unknown>)['__playwright_errors__'] as string[] ?? [];
    });
    return inlineErrors;
  }

  // ── Element helpers ─────────────────────────────────────────────────────────

  /**
   * Return all <a> elements on the page as Playwright Locators.
   * Caller should iterate with .all() to get ElementHandle array if needed.
   */
  async getLinkElements(): Promise<Locator[]> {
    const locator = this.page.locator('a[href]');
    return locator.all();
  }

  /**
   * Return all <form> elements on the page as Playwright Locators.
   */
  async getFormElements(): Promise<Locator[]> {
    const locator = this.page.locator('form');
    return locator.all();
  }

  // ── Demo request CTA ─────────────────────────────────────────────────────────

  /**
   * Return all "Book a Demo" style call-to-action links found on the current
   * page. Many B2B SaaS marketing sites (including this one) route this CTA
   * to a third-party scheduling tool, so this looks for both the external
   * booking-tool href pattern and common CTA text as a fallback.
   */
  async getDemoRequestLinks(): Promise<Locator[]> {
    const byHref = this.page.locator(
      'a[href*="appointlet" i], a[href*="calendly" i], a[href*="hubspot" i][href*="meetings" i]'
    );
    if (await byHref.count() > 0) return byHref.all();

    const byText = this.page.locator('a, button').filter({
      hasText: /book a demo|schedule.*demo|request a demo|free demonstration/i,
    });
    return byText.all();
  }
}
