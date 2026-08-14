/**
 * tests/functional/testimonials.spec.ts
 *
 * Testimonials tests — verify the /testimonials/ page renders customer
 * quote cards. This site displays testimonials as a static grid (no
 * carousel/slider), so these tests confirm content presence and the
 * absence of unused carousel controls.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Testimonials @functional', () => {
  test.beforeEach(async ({ testimonialsPage }) => {
    await testimonialsPage.navigate();
    await testimonialsPage.waitForLoad();
  });

  test('testimonials page has a main heading @functional', async ({ testimonialsPage }) => {
    const heading = await testimonialsPage.getHeading();
    expect(heading.length, 'Testimonials page should have a non-empty heading').toBeGreaterThan(0);
  });

  test('testimonials page renders multiple customer quotes @functional', async ({ testimonialsPage }) => {
    const testimonials = await testimonialsPage.getTestimonials();
    expect(
      testimonials.length,
      'Testimonials page should render multiple customer quote cards'
    ).toBeGreaterThanOrEqual(3);

    for (const item of testimonials) {
      expect(item.text.trim().length, 'Each testimonial card should have visible text').toBeGreaterThan(0);
    }
  });
});
