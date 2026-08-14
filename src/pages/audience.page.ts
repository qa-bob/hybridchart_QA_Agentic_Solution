/**
 * src/pages/audience.page.ts
 *
 * AudiencePage models the /for/ index page ("Who It's For"), which presents
 * a card grid of the target audience segments HybridChart serves (Doctors
 * and Surgeons, EHRs, Medical Billers, Practice Consultants, Private Equity,
 * Transitional Care, etc.), each linking to a dedicated landing page.
 */

import { BasePage } from '@pages/base.page';

export interface AudienceCardInfo {
  name: string;
  href: string;
}

export class AudiencePage extends BasePage {
  /** Navigate to the /for/ ("Who It's For") index page. */
  async navigate(): Promise<void> {
    await this.goToPath('/for/');
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
   * Return audience segment cards. Matches links whose href sits under
   * /for/<segment>/ (i.e. one path segment deeper than the index itself).
   */
  async getAudienceCards(): Promise<AudienceCardInfo[]> {
    const links = this.page.locator('a[href*="/for/"]').filter({ hasNotText: /^\s*$/ });
    const count = await links.count();
    const seen = new Set<string>();
    const cards: AudienceCardInfo[] = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = (await link.getAttribute('href')) ?? '';
      // Skip the index page itself and duplicate/anchor links
      if (!href || href.endsWith('/for/') || href.endsWith('/for') || seen.has(href)) continue;
      seen.add(href);
      const name = ((await link.textContent()) ?? '').trim();
      if (name) cards.push({ name, href });
    }

    return cards;
  }

  /** Return the count of distinct audience-segment links discovered. */
  async getAudienceCardCount(): Promise<number> {
    return (await this.getAudienceCards()).length;
  }
}
