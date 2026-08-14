/**
 * src/pages/products.page.ts
 *
 * ProductsPage models the /products/ index page (three-product suite:
 * EVOLVE, ALTITUDE, SWITCHBOARD) as well as each individual product detail
 * page, which share a common layout: a heading, a "Core Features" section,
 * and a "Book A Demo" CTA.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export type ProductSlug = 'evolve' | 'altitude' | 'switchboard';

export interface ProductCardInfo {
  name: string;
  href: string;
}

export const PRODUCT_SLUGS: ProductSlug[] = ['evolve', 'altitude', 'switchboard'];

export class ProductsPage extends BasePage {
  // ── Navigation ──────────────────────────────────────────────────────────────

  /** Navigate to the /products/ index page. */
  async navigate(): Promise<void> {
    await this.goToPath('/products/');
  }

  /** Navigate to a specific product's detail page (evolve, altitude, switchboard). */
  async navigateToProduct(slug: ProductSlug): Promise<void> {
    await this.goToPath(`/products/${slug}/`);
  }

  // ── Index page: product cards ───────────────────────────────────────────────

  /**
   * Return the product cards/links on the /products/ index page.
   * Matches links pointing at any of the known product detail URLs.
   */
  async getProductCards(): Promise<ProductCardInfo[]> {
    const links = this.page.locator(
      PRODUCT_SLUGS.map((slug) => `a[href*="/products/${slug}"]`).join(', ')
    );
    const count = await links.count();
    const seen = new Set<string>();
    const cards: ProductCardInfo[] = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = (await link.getAttribute('href')) ?? '';
      if (!href || seen.has(href)) continue;
      seen.add(href);
      const name = ((await link.textContent()) ?? '').trim();
      cards.push({ name, href });
    }

    return cards;
  }

  // ── Detail page: heading + features ─────────────────────────────────────────

  /** Return the text of the product detail page's main heading (h1). */
  async getProductHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) {
      return (await h1.textContent())?.trim() ?? '';
    }
    return '';
  }

  /**
   * Return the labels of the "Core Features" list on a product detail page.
   * Looks for headings/list items under a features heading first, falling
   * back to any element that looks like a feature card.
   */
  async getFeatureListItems(): Promise<string[]> {
    const candidates: Locator[] = [
      this.page.locator('[class*="feature"] h2, [class*="feature"] h3, [class*="feature"] h4'),
      this.page.locator('[class*="feature-card"], [class*="feature-item"]'),
      this.page.locator('section').filter({ hasText: /core features/i }).locator('h2, h3, h4, li'),
    ];

    for (const candidate of candidates) {
      const count = await candidate.count();
      if (count > 0) {
        const texts: string[] = [];
        for (let i = 0; i < count; i++) {
          const text = ((await candidate.nth(i).textContent()) ?? '').trim();
          if (text) texts.push(text);
        }
        if (texts.length > 0) return texts;
      }
    }

    return [];
  }

  // ── CTA ──────────────────────────────────────────────────────────────────────

  /** Return the "Learn More" links pointing to each product's detail page. */
  async getLearnMoreLinks(): Promise<Locator[]> {
    const links = this.page.locator('a').filter({ hasText: /learn more/i });
    return links.all();
  }
}
