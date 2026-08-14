/**
 * tests/functional/challenges.spec.ts
 *
 * Challenges tests — verify the /challenges/ index page presents the
 * business pain-point card grid (Complex Workflows, Practice Efficiency,
 * Lost Revenue, Patient Follow Up) that anchors HybridChart's value
 * proposition.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Challenges @functional', () => {
  test.beforeEach(async ({ challengesPage }) => {
    await challengesPage.navigate();
    await challengesPage.waitForLoad();
  });

  test('challenges page has a main heading @functional', async ({ challengesPage }) => {
    const heading = await challengesPage.getHeading();
    expect(heading.length, 'Challenges page should have a non-empty heading').toBeGreaterThan(0);
  });

  test('challenges page lists multiple challenge cards @functional', async ({ challengesPage }) => {
    const cards = await challengesPage.getChallengeCards();
    expect(
      cards.length,
      'Challenges page should link to multiple distinct challenge/solution pages'
    ).toBeGreaterThanOrEqual(3);

    for (const card of cards) {
      expect(card.name.length, `Challenge card "${card.href}" should have visible link text`).toBeGreaterThan(0);
    }
  });
});
