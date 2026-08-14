/**
 * src/pages/challenges.page.ts
 *
 * ChallengesPage models the /challenges/ index page, which presents a card
 * grid of the business pain points HybridChart addresses (Complex
 * Workflows, Practice Efficiency, Lost Revenue, Patient Follow Up), each
 * linking to a dedicated solution page.
 */

import { BasePage } from '@pages/base.page';

export interface ChallengeCardInfo {
  name: string;
  href: string;
}

export class ChallengesPage extends BasePage {
  /** Navigate to the /challenges/ index page. */
  async navigate(): Promise<void> {
    await this.goToPath('/challenges/');
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
   * Return challenge cards. Matches links whose href sits under
   * /challenges/<challenge>/ (one path segment deeper than the index).
   */
  async getChallengeCards(): Promise<ChallengeCardInfo[]> {
    const links = this.page.locator('a[href*="/challenges/"]');
    const count = await links.count();
    const seen = new Set<string>();
    const cards: ChallengeCardInfo[] = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = (await link.getAttribute('href')) ?? '';
      if (!href || href.endsWith('/challenges/') || href.endsWith('/challenges') || seen.has(href)) {
        continue;
      }
      seen.add(href);
      const name = ((await link.textContent()) ?? '').trim();
      if (name) cards.push({ name, href });
    }

    return cards;
  }
}
