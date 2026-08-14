/**
 * src/pages/faq.page.ts
 *
 * FaqPage models the /faq/ page. Unlike a typical accordion-style FAQ, this
 * site renders all questions and answers in a flat, fully-expanded layout
 * (no <details>/<summary>, no aria-expanded toggles) grouped by product.
 */

import { BasePage } from '@pages/base.page';

export class FaqPage extends BasePage {
  /** Navigate to the /faq/ page. */
  async navigate(): Promise<void> {
    await this.goToPath('/faq/');
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
   * Return the text of each FAQ question found on the page.
   * Questions are heading-level elements ending in "?" since this page
   * does not use accordion/toggle markup.
   */
  async getQuestions(): Promise<string[]> {
    const headingCandidates = this.page.locator('h2, h3, h4, h5, strong, dt');
    const count = await headingCandidates.count();
    const questions: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = ((await headingCandidates.nth(i).textContent()) ?? '').trim();
      if (text.endsWith('?')) {
        questions.push(text);
      }
    }

    return questions;
  }

  /** Return true if the page has at least one FAQ question rendered. */
  async hasQuestions(): Promise<boolean> {
    return (await this.getQuestions()).length > 0;
  }
}
