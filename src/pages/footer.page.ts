/**
 * src/pages/footer.page.ts
 *
 * FooterPage models the site-wide footer section present on every page:
 * product/quick links, contact information (email, phone, address), social
 * media links, and legal links (Privacy Policy). It is a cross-cutting
 * section like NavigationPage, not a single distinct page — it does not
 * navigate anywhere on its own; call it after navigating to any page.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { LinkCheckResult } from '@pages/navigation.page';

export interface FooterLinkInfo {
  text: string;
  href: string;
}

export class FooterPage extends BasePage {
  // ── Footer detection ─────────────────────────────────────────────────────────

  private getFooterLocator(): Locator {
    return this.page.locator('footer, [role="contentinfo"]').first();
  }

  /** Return true if a footer element is visible on the page. */
  async isFooterVisible(): Promise<boolean> {
    const footer = this.getFooterLocator();
    if (await footer.count() === 0) return false;
    return footer.isVisible();
  }

  // ── Links ────────────────────────────────────────────────────────────────────

  /** Return all links inside the footer with their text and href. */
  async getFooterLinks(): Promise<FooterLinkInfo[]> {
    const footer = this.getFooterLocator();
    if (await footer.count() === 0) return [];

    const links = footer.locator('a[href]');
    const count = await links.count();
    const results: FooterLinkInfo[] = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = ((await link.textContent()) ?? '').trim();
      const href = (await link.getAttribute('href')) ?? '';
      if (!href || href === '#' || href.startsWith('javascript:')) continue;
      results.push({ text, href });
    }

    return results;
  }

  /** Return footer links that point to known social media platforms. */
  async getSocialLinks(): Promise<FooterLinkInfo[]> {
    const allLinks = await this.getFooterLinks();
    return allLinks.filter((link) =>
      /facebook\.com|linkedin\.com|(twitter|x)\.com|youtube\.com|instagram\.com/i.test(link.href)
    );
  }

  /** Return footer links whose text suggests a legal document (privacy, terms). */
  async getLegalLinks(): Promise<FooterLinkInfo[]> {
    const allLinks = await this.getFooterLinks();
    return allLinks.filter((link) => /privacy|terms|legal|cookie/i.test(link.text));
  }

  // ── Contact info ─────────────────────────────────────────────────────────────

  /** Return the footer's mailto: contact email, or null if not present. */
  async getContactEmail(): Promise<string | null> {
    const footer = this.getFooterLocator();
    if (await footer.count() === 0) return null;

    const mailLink = footer.locator('a[href^="mailto:"]').first();
    if (await mailLink.count() === 0) return null;

    const href = await mailLink.getAttribute('href');
    return href ? href.replace(/^mailto:/, '') : null;
  }

  /** Return the footer's tel: contact phone number, or null if not present. */
  async getContactPhone(): Promise<string | null> {
    const footer = this.getFooterLocator();
    if (await footer.count() === 0) return null;

    const telLink = footer.locator('a[href^="tel:"]').first();
    if (await telLink.count() === 0) return null;

    const href = await telLink.getAttribute('href');
    return href ? href.replace(/^tel:/, '') : null;
  }

  // ── Link reachability ────────────────────────────────────────────────────────

  /**
   * Check all footer links are reachable by issuing HEAD requests.
   * Mirrors NavigationPage.checkAllNavLinksReachable() for the footer section.
   */
  async checkAllFooterLinksReachable(): Promise<LinkCheckResult[]> {
    const footerLinks = await this.getFooterLinks();
    const baseUrl = new URL(this.config.url);
    const results: LinkCheckResult[] = [];

    for (const link of footerLinks) {
      // Skip non-http(s) schemes (mailto:, tel:) — HEAD requests don't apply
      if (/^(mailto|tel):/i.test(link.href)) continue;

      let absoluteUrl: string;
      try {
        absoluteUrl = new URL(link.href, baseUrl).toString();
      } catch {
        results.push({ url: link.href, status: 0, ok: false });
        continue;
      }

      try {
        const response = await this.page.request.head(absoluteUrl, { timeout: 10_000 });
        results.push({ url: absoluteUrl, status: response.status(), ok: response.ok() });
      } catch {
        results.push({ url: absoluteUrl, status: 0, ok: false });
      }
    }

    return results;
  }
}
