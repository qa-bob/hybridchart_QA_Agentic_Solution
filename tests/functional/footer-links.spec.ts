/**
 * tests/functional/footer-links.spec.ts
 *
 * Footer tests — verify the sitewide footer renders product/quick links,
 * contact information, social media links, and the legal (Privacy Policy)
 * link, and that none of those links are broken.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Footer @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    // homePage fixture already navigated to the site root; footerPage shares
    // the same underlying `page`, so the footer is now inspectable.
    await homePage.waitForLoad();
  });

  test('footer is visible on the homepage @functional', async ({ footerPage }) => {
    const visible = await footerPage.isFooterVisible();
    expect(visible, 'A <footer> / [role="contentinfo"] element should be visible').toBeTruthy();
  });

  test('footer contains contact email and phone number @functional', async ({ footerPage, siteConfig }) => {
    const email = await footerPage.getContactEmail();
    const phone = await footerPage.getContactPhone();

    expect(email, `Footer should contain a mailto: contact link for "${siteConfig.name}"`).not.toBeNull();
    expect(phone, `Footer should contain a tel: contact link for "${siteConfig.name}"`).not.toBeNull();
  });

  test('footer contains social media links @functional', async ({ footerPage }) => {
    const socialLinks = await footerPage.getSocialLinks();
    expect(socialLinks.length, 'Footer should link out to at least one social media platform').toBeGreaterThan(0);
  });

  test('footer contains a Privacy Policy (legal) link @functional', async ({ footerPage }) => {
    const legalLinks = await footerPage.getLegalLinks();
    expect(legalLinks.length, 'Footer should contain a Privacy Policy or similar legal link').toBeGreaterThan(0);
  });

  test('all footer links are reachable (no 404s) @functional', async ({ footerPage }) => {
    const results = await footerPage.checkAllFooterLinksReachable();

    test.skip(results.length === 0, 'No checkable footer links found');

    const broken = results.filter((r) => !r.ok && r.status !== 0);
    const unreachable = results.filter((r) => r.status === 0);

    if (unreachable.length > 0) {
      console.warn(
        '[footer] Could not reach (network):\n' + unreachable.map((r) => `  ${r.url}`).join('\n')
      );
    }

    expect(
      broken,
      `Found ${broken.length} broken footer link(s):\n` +
        broken.map((r) => `  ${r.url} → HTTP ${r.status}`).join('\n')
    ).toHaveLength(0);
  });
});
