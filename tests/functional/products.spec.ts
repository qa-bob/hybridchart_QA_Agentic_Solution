/**
 * tests/functional/products.spec.ts
 *
 * Product suite tests — verify the /products/ index page lists all three
 * HybridChart products (EVOLVE, ALTITUDE, SWITCHBOARD) and that each
 * product's own detail page loads with a heading, a feature list, and a
 * demo-request CTA.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { PRODUCT_SLUGS } from '@pages/products.page';

test.describe('Product Suite @functional', () => {
  test('products index lists all three products @functional', async ({ productsPage }) => {
    await productsPage.navigate();
    await productsPage.waitForLoad();

    const cards = await productsPage.getProductCards();

    expect(cards.length, 'Products index should list at least 3 product links').toBeGreaterThanOrEqual(3);

    const names = cards.map((c) => c.name.toLowerCase()).join(' | ');
    for (const expected of ['evolve', 'altitude', 'switchboard']) {
      expect(
        names.includes(expected),
        `Expected a product card referencing "${expected}", found: ${names}`
      ).toBeTruthy();
    }
  });

  test('products index exposes a demo-request CTA @functional', async ({ productsPage }) => {
    await productsPage.navigate();
    const demoLinks = await productsPage.getDemoRequestLinks();
    expect(demoLinks.length, 'Products index should have a "Book a Demo" CTA').toBeGreaterThan(0);
  });

  for (const slug of PRODUCT_SLUGS) {
    test(`${slug} product page loads with heading and feature list @functional`, async ({
      productsPage,
    }) => {
      await productsPage.navigateToProduct(slug);
      await productsPage.waitForLoad();

      const heading = await productsPage.getProductHeading();
      expect(heading.length, `${slug} product page should have a non-empty heading`).toBeGreaterThan(0);
      expect(
        heading.toLowerCase().includes(slug),
        `Heading "${heading}" should reference the product name "${slug}"`
      ).toBeTruthy();

      const features = await productsPage.getFeatureListItems();
      expect(
        features.length,
        `${slug} product page should list at least one core feature`
      ).toBeGreaterThan(0);
    });
  }

  for (const slug of PRODUCT_SLUGS) {
    test(`${slug} product page has a demo-request CTA @functional`, async ({ productsPage }) => {
      await productsPage.navigateToProduct(slug);
      const demoLinks = await productsPage.getDemoRequestLinks();
      expect(demoLinks.length, `${slug} page should expose a "Book a Demo" CTA`).toBeGreaterThan(0);
    });
  }
});
