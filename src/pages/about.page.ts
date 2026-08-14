/**
 * src/pages/about.page.ts
 *
 * AboutPage models the /about/ page: HybridChart's origin story, founder
 * bio, and a row of key outcome statistics (e.g. "Increase Revenues Up To
 * 15%", "Daily Time Savings 1.7 Hrs/Wk", "Patient Retention Rate 12%").
 */

import { BasePage } from '@pages/base.page';

export class AboutPage extends BasePage {
  /** Navigate to the /about/ page. */
  async navigate(): Promise<void> {
    await this.goToPath('/about/');
  }

  /** Return the main heading of the page. */
  async getHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) {
      return (await h1.textContent())?.trim() ?? '';
    }
    return '';
  }

  /**
   * Return text fragments that look like key outcome statistics — headings
   * or emphasized text containing a percentage or a number-with-unit
   * (e.g. "15%", "1.7 Hrs/Wk").
   */
  async getKeyStats(): Promise<string[]> {
    const candidates = this.page.locator('h2, h3, h4, [class*="stat"], strong');
    const count = await candidates.count();
    const statPattern = /\d+(\.\d+)?\s*(%|hrs?|hours?|wk|week)/i;
    const stats: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = ((await candidates.nth(i).textContent()) ?? '').trim();
      if (text && statPattern.test(text)) {
        stats.push(text);
      }
    }

    return stats;
  }

  /** Return true if the page body mentions a named founder/leadership bio. */
  async hasFounderBio(): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return /founder|ceo|m\.?d\.?/i.test(bodyText);
  }
}
