/**
 * tests/functional/audience-segments.spec.ts
 *
 * "Who It's For" tests — verify the /for/ index page presents the audience
 * segment card grid (Doctors and Surgeons, EHRs, Medical Billers, Practice
 * Consultants, Private Equity, Transitional Care, etc.) that HybridChart
 * markets itself to.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Audience Segments ("Who It\'s For") @functional', () => {
  test.beforeEach(async ({ audiencePage }) => {
    await audiencePage.navigate();
    await audiencePage.waitForLoad();
  });

  test('audience page has a main heading @functional', async ({ audiencePage }) => {
    const heading = await audiencePage.getHeading();
    expect(heading.length, 'Audience page should have a non-empty heading').toBeGreaterThan(0);
  });

  test('audience page lists multiple target-segment cards @functional', async ({ audiencePage }) => {
    const cards = await audiencePage.getAudienceCards();
    expect(
      cards.length,
      'Audience page should link to multiple distinct segment landing pages'
    ).toBeGreaterThanOrEqual(3);

    for (const card of cards) {
      expect(card.name.length, `Audience card "${card.href}" should have visible link text`).toBeGreaterThan(0);
    }
  });
});
