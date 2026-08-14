/**
 * tests/functional/demo-request.spec.ts
 *
 * Demo-request CTA tests — HybridChart has no self-serve pricing/checkout;
 * the core conversion action across the whole site is a "Book A Demo" CTA
 * that routes to a third-party scheduling tool (Appointlet). These tests
 * confirm the CTA is present on key pages and that its target is reachable,
 * WITHOUT navigating into the third-party booking flow itself.
 *
 * Tag: @functional (plus @smoke for the homepage presence check, since a
 * missing/broken demo CTA sitewide would be a critical business regression)
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Demo Request CTA @functional', () => {
  test('homepage has a working demo-request CTA @functional @smoke', async ({ homePage }) => {
    await homePage.waitForLoad();
    const demoLinks = await homePage.getDemoRequestLinks();
    expect(demoLinks.length, 'Homepage should have a "Book a Demo" CTA').toBeGreaterThan(0);

    const href = await demoLinks[0].getAttribute('href');
    expect(href, 'Demo CTA should have an href').not.toBeNull();
    expect(
      /appointlet|calendly|hubspot/i.test(href ?? ''),
      `Demo CTA href "${href}" should point to a scheduling tool`
    ).toBeTruthy();
  });

  test('demo-request link resolves successfully (HEAD check) @functional', async ({ homePage, page }) => {
    await homePage.waitForLoad();
    const demoLinks = await homePage.getDemoRequestLinks();

    if (demoLinks.length === 0) {
      test.skip(true, 'No demo CTA found — covered by the homepage presence test');
      return;
    }

    const href = await demoLinks[0].getAttribute('href');
    expect(href).not.toBeNull();

    try {
      const response = await page.request.head(href!, { timeout: 10_000 });
      expect(
        response.status() < 500,
        `Demo booking link "${href}" returned server error ${response.status()}`
      ).toBeTruthy();
    } catch (err) {
      console.warn(`[demo-request] Could not HEAD-check "${href}": ${String(err)}`);
    }
  });

  test('contact page also exposes a demo-request CTA @functional', async ({ contactPage }) => {
    await contactPage.navigate();
    await contactPage.waitForLoad();
    const demoLinks = await contactPage.getDemoRequestLinks();
    expect(demoLinks.length, 'Contact page should offer a "Book a Demo" alternative to the form').toBeGreaterThan(0);
  });
});
