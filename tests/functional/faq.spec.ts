/**
 * tests/functional/faq.spec.ts
 *
 * FAQ tests — verify the /faq/ page renders a meaningful number of
 * questions. This site's FAQ page is a flat, fully-expanded layout (no
 * accordion), so these tests check content presence rather than
 * expand/collapse interaction.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('FAQ @functional', () => {
  test.beforeEach(async ({ faqPage }) => {
    await faqPage.navigate();
    await faqPage.waitForLoad();
  });

  test('FAQ page has a main heading @functional', async ({ faqPage }) => {
    const heading = await faqPage.getHeading();
    expect(heading.length, 'FAQ page should have a non-empty heading').toBeGreaterThan(0);
  });

  test('FAQ page renders a substantial list of questions @functional', async ({ faqPage }) => {
    const questions = await faqPage.getQuestions();
    expect(
      questions.length,
      'FAQ page should render a meaningful number of question headings'
    ).toBeGreaterThanOrEqual(5);
  });

  test('FAQ questions are non-empty and end in a question mark @functional', async ({ faqPage }) => {
    const questions = await faqPage.getQuestions();
    test.skip(questions.length === 0, 'No questions found — covered by the previous test');

    for (const question of questions) {
      expect(question.trim().length, 'Each FAQ question should have visible text').toBeGreaterThan(0);
      expect(question.trim().endsWith('?'), `Question "${question}" should end with "?"`).toBeTruthy();
    }
  });
});
