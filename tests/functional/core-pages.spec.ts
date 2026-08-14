/**
 * tests/functional/core-pages.spec.ts
 *
 * Regression-breadth coverage — confirms every major page discovered in the
 * primary navigation loads successfully with HTTP 2xx/3xx and a real
 * heading, so a broken build or bad deploy is caught across the whole site,
 * not just the homepage.
 *
 * Tag: @functional (site-load breadth) + @smoke (critical-path regression)
 */

import { test, expect } from '@fixtures/site.fixture';

const CORE_PAGES: Array<{ name: string; path: string }> = [
  { name: 'Challenges', path: '/challenges/' },
  { name: 'Products', path: '/products/' },
  { name: 'Who It\'s For', path: '/for/' },
  { name: 'Resources', path: '/resources/' },
  { name: 'Blog', path: '/blog/' },
  { name: 'FAQs', path: '/faq/' },
  { name: 'Testimonials', path: '/testimonials/' },
  { name: 'About', path: '/about/' },
  { name: 'Contact Us', path: '/contact/' },
];

test.describe('Core Pages Load @functional', () => {
  for (const corePage of CORE_PAGES) {
    test(`"${corePage.name}" page (${corePage.path}) loads successfully @functional @smoke`, async ({
      page,
      siteConfig,
    }) => {
      const targetUrl = new URL(corePage.path, siteConfig.url).toString();
      const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

      expect(response, `No response received for ${targetUrl}`).not.toBeNull();
      const status = response!.status();
      expect(
        status >= 200 && status < 400,
        `Expected HTTP 2xx/3xx for "${corePage.name}" (${targetUrl}) but got ${status}`
      ).toBeTruthy();

      const headingCount = await page.locator('h1, h2').count();
      expect(
        headingCount,
        `"${corePage.name}" page should render at least one heading`
      ).toBeGreaterThan(0);

      const navCount = await page.locator('nav, [role="navigation"]').count();
      expect(
        navCount,
        `"${corePage.name}" page should render the primary navigation`
      ).toBeGreaterThan(0);
    });
  }
});
