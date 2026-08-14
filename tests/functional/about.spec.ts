/**
 * tests/functional/about.spec.ts
 *
 * About tests — verify the /about/ page renders the company origin story,
 * founder bio, and key outcome statistics (revenue increase, time savings,
 * patient retention) that support HybridChart's value proposition.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('About @functional', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.navigate();
    await aboutPage.waitForLoad();
  });

  test('about page has a main heading @functional', async ({ aboutPage }) => {
    const heading = await aboutPage.getHeading();
    expect(heading.length, 'About page should have a non-empty heading').toBeGreaterThan(0);
  });

  test('about page renders key outcome statistics @functional', async ({ aboutPage }) => {
    const stats = await aboutPage.getKeyStats();
    expect(
      stats.length,
      'About page should highlight at least one outcome statistic (e.g. revenue increase, time saved)'
    ).toBeGreaterThan(0);
  });

  test('about page includes a founder/leadership bio @functional', async ({ aboutPage }) => {
    const hasBio = await aboutPage.hasFounderBio();
    expect(hasBio, 'About page should mention a founder or leadership figure').toBeTruthy();
  });

  test('about page exposes a demo-request CTA @functional', async ({ aboutPage }) => {
    const demoLinks = await aboutPage.getDemoRequestLinks();
    expect(demoLinks.length, 'About page should have a "Book a Demo" CTA').toBeGreaterThan(0);
  });
});
