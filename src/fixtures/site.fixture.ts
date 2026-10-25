/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config.  All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@site-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { ProductsPage } from '@pages/products.page';
import { AudiencePage } from '@pages/audience.page';
import { ChallengesPage } from '@pages/challenges.page';
import { FaqPage } from '@pages/faq.page';
import { TestimonialsPage } from '@pages/testimonials.page';
import { BlogPage } from '@pages/blog.page';
import { AboutPage } from '@pages/about.page';
import { FooterPage } from '@pages/footer.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactFormPage page object (does not auto-navigate) */
  contactPage: ContactFormPage;
  /** ProductsPage page object (does not auto-navigate) — /products/ suite */
  productsPage: ProductsPage;
  /** AudiencePage page object (does not auto-navigate) — /for/ segments */
  audiencePage: AudiencePage;
  /** ChallengesPage page object (does not auto-navigate) — /challenges/ */
  challengesPage: ChallengesPage;
  /** FaqPage page object (does not auto-navigate) — /faq/ */
  faqPage: FaqPage;
  /** TestimonialsPage page object (does not auto-navigate) — /testimonials/ */
  testimonialsPage: TestimonialsPage;
  /** BlogPage page object (does not auto-navigate) — /blog/ */
  blogPage: BlogPage;
  /** AboutPage page object (does not auto-navigate) — /about/ */
  aboutPage: AboutPage;
  /** FooterPage page object (does not auto-navigate) — sitewide footer section */
  footerPage: FooterPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  /**
   * siteConfig — loaded once per worker from site.config.json.
   * Shared across all fixtures in the same test.
   */
  // eslint-disable-next-line no-empty-pattern -- Playwright fixture signature requires a destructured first arg even when no fixture deps are used
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  /**
   * homePage — constructs HomePage and navigates to the site root.
   * Waits for domcontentloaded before handing control to the test.
   */
  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  /**
   * navigationPage — constructs NavigationPage without navigating.
   * Tests that need to be on a specific page should call navigate() themselves.
   */
  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  /**
   * contactPage — constructs ContactFormPage without navigating.
   * Tests should navigate to the appropriate page first.
   */
  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  /**
   * productsPage — constructs ProductsPage without navigating.
   * Call navigate() for the /products/ index or navigateToProduct(slug)
   * for an individual product's detail page.
   */
  productsPage: async ({ page, siteConfig }, use) => {
    const productsPage = new ProductsPage(page, siteConfig);
    await use(productsPage);
  },

  /**
   * audiencePage — constructs AudiencePage without navigating.
   * Tests should call navigate() to load /for/.
   */
  audiencePage: async ({ page, siteConfig }, use) => {
    const audiencePage = new AudiencePage(page, siteConfig);
    await use(audiencePage);
  },

  /**
   * challengesPage — constructs ChallengesPage without navigating.
   * Tests should call navigate() to load /challenges/.
   */
  challengesPage: async ({ page, siteConfig }, use) => {
    const challengesPage = new ChallengesPage(page, siteConfig);
    await use(challengesPage);
  },

  /**
   * faqPage — constructs FaqPage without navigating.
   * Tests should call navigate() to load /faq/.
   */
  faqPage: async ({ page, siteConfig }, use) => {
    const faqPage = new FaqPage(page, siteConfig);
    await use(faqPage);
  },

  /**
   * testimonialsPage — constructs TestimonialsPage without navigating.
   * Tests should call navigate() to load /testimonials/.
   */
  testimonialsPage: async ({ page, siteConfig }, use) => {
    const testimonialsPage = new TestimonialsPage(page, siteConfig);
    await use(testimonialsPage);
  },

  /**
   * blogPage — constructs BlogPage without navigating.
   * Tests should call navigate() to load /blog/.
   */
  blogPage: async ({ page, siteConfig }, use) => {
    const blogPage = new BlogPage(page, siteConfig);
    await use(blogPage);
  },

  /**
   * aboutPage — constructs AboutPage without navigating.
   * Tests should call navigate() to load /about/.
   */
  aboutPage: async ({ page, siteConfig }, use) => {
    const aboutPage = new AboutPage(page, siteConfig);
    await use(aboutPage);
  },

  /**
   * footerPage — constructs FooterPage without navigating.
   * It is a cross-cutting section object — navigate to any page first
   * (e.g. via homePage or another fixture), then inspect the footer.
   */
  footerPage: async ({ page, siteConfig }, use) => {
    const footerPage = new FooterPage(page, siteConfig);
    await use(footerPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };
