/**
 * tests/functional/blog.spec.ts
 *
 * Blog tests — verify the /blog/ listing page renders posts, pagination,
 * and a search box. The search field is only inspected for presence — it
 * is never submitted, consistent with the project's "never submit forms"
 * rule (a blog search is still a <form> submission).
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Blog @functional', () => {
  test.beforeEach(async ({ blogPage }) => {
    await blogPage.navigate();
    await blogPage.waitForLoad();
  });

  test('blog page has a main heading @functional', async ({ blogPage }) => {
    const heading = await blogPage.getHeading();
    expect(heading.length, 'Blog page should have a non-empty heading').toBeGreaterThan(0);
  });

  test('blog page lists multiple posts with titles and links @functional', async ({ blogPage }) => {
    const posts = await blogPage.getPostLinks();
    expect(posts.length, 'Blog page should list multiple posts').toBeGreaterThanOrEqual(3);

    for (const post of posts) {
      expect(post.title.length, `Post at "${post.href}" should have a non-empty title`).toBeGreaterThan(0);
      expect(post.href.length, `Post "${post.title}" should have a link`).toBeGreaterThan(0);
    }
  });

  test('blog page has pagination for additional posts @functional', async ({ blogPage }) => {
    const hasPagination = await blogPage.hasPagination();
    expect(hasPagination, 'Blog page should expose pagination controls').toBeTruthy();
  });

  test('blog page has a search box (not submitted) @functional', async ({ blogPage }) => {
    const searchBox = await blogPage.getSearchBox();
    expect(searchBox, 'Blog page should have an on-page search input').not.toBeNull();

    if (searchBox) {
      await expect(searchBox, 'Search input should be visible').toBeVisible();
    }
  });
});
