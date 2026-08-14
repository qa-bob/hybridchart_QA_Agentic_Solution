/**
 * src/pages/testimonials.page.ts
 *
 * TestimonialsPage models the /testimonials/ page, which presents customer
 * quotes as a static grid of cards (quote + author/role/organization).
 * There is no carousel, slider, or next/prev interaction on this page.
 */

import { BasePage } from '@pages/base.page';

export interface TestimonialInfo {
  text: string;
}

export class TestimonialsPage extends BasePage {
  /** Navigate to the /testimonials/ page. */
  async navigate(): Promise<void> {
    await this.goToPath('/testimonials/');
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
   * Return the testimonial cards on the page.
   * Tries common testimonial markup patterns (blockquote, class*="testimonial",
   * article) and falls back to nothing found rather than throwing.
   */
  async getTestimonials(): Promise<TestimonialInfo[]> {
    const candidates = [
      this.page.locator('[class*="testimonial"]'),
      this.page.locator('blockquote'),
      this.page.locator('article'),
    ];

    for (const candidate of candidates) {
      const count = await candidate.count();
      if (count > 0) {
        const items: TestimonialInfo[] = [];
        for (let i = 0; i < count; i++) {
          const text = ((await candidate.nth(i).textContent()) ?? '').trim();
          if (text) items.push({ text });
        }
        if (items.length > 0) return items;
      }
    }

    return [];
  }

  /** Return true if no carousel/slider controls are present (static grid layout). */
  async hasCarouselControls(): Promise<boolean> {
    const controls = this.page.locator(
      '[class*="carousel"], [class*="slider"], [aria-label*="next slide" i], [aria-label*="previous slide" i]'
    );
    return (await controls.count()) > 0;
  }
}
