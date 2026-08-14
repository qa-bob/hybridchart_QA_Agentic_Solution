/**
 * src/pages/blog.page.ts
 *
 * BlogPage models the /blog/ listing page: a grid of post cards (title +
 * link + category tag), pagination controls, and a site-search box.
 * This page object only inspects the search field — it never submits a
 * search, consistent with the project's "never submit forms" rule.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface BlogPostInfo {
  title: string;
  href: string;
}

export class BlogPage extends BasePage {
  /** Navigate to the /blog/ page. */
  async navigate(): Promise<void> {
    await this.goToPath('/blog/');
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
   * Return blog post entries found on the listing page.
   * Looks for headings (h2/h3) that wrap or sit beside a link, which is the
   * common WordPress/blog-grid pattern.
   */
  async getPostLinks(): Promise<BlogPostInfo[]> {
    const headingLinks = this.page.locator('h2 a[href], h3 a[href], article a[href]');
    const count = await headingLinks.count();
    const seen = new Set<string>();
    const posts: BlogPostInfo[] = [];

    for (let i = 0; i < count; i++) {
      const link = headingLinks.nth(i);
      const href = (await link.getAttribute('href')) ?? '';
      const title = ((await link.textContent()) ?? '').trim();
      if (!href || !title || seen.has(href)) continue;
      seen.add(href);
      posts.push({ title, href });
    }

    return posts;
  }

  /** Return the pagination control locator (numbered pages / next-prev links). */
  private getPaginationLocator(): Locator {
    return this.page.locator(
      'nav[class*="pagination" i], [class*="pagination" i], a[aria-label*="next page" i], a[rel="next"]'
    );
  }

  /** Return true if pagination controls are present. */
  async hasPagination(): Promise<boolean> {
    return (await this.getPaginationLocator().count()) > 0;
  }

  /** Return the on-page search input locator, or null if none is found. */
  async getSearchBox(): Promise<Locator | null> {
    const candidates = [
      this.page.locator('input[type="search"]'),
      this.page.locator('input[name="s"]'),
      this.page.locator('input[placeholder*="search" i]'),
    ];

    for (const candidate of candidates) {
      if (await candidate.count() > 0) return candidate.first();
    }
    return null;
  }
}
