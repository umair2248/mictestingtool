import { test, expect } from '@playwright/test';

test('setup guide has metadata, working PC/Mac/console anchors and mobile layout', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/blog/how-to-connect-set-up-microphone');
    await expect(page).toHaveTitle('How to Connect & Set Up a Microphone on PC or Mac');
    await expect(page.locator('h1')).toHaveText('How to Connect and Set Up a Microphone on PC or Mac');
    await expect(page.locator('head > link[rel=canonical]')).toHaveAttribute('href', 'https://mictestingtool.com/blog/how-to-connect-set-up-microphone');
    await page.locator('.article-contents summary').click();
    await page.locator('.article-contents').getByRole('link', { name: 'Connecting a USB mic to a PC and console', exact: true }).click();
    const heading = page.getByRole('heading', { name: 'Connecting a USB mic to a PC and console', exact: true });
    await expect(heading).toBeInViewport();
    expect((await heading.boundingBox()).y).toBeGreaterThanOrEqual((await page.locator('.site-header').boundingBox()).height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const schema = JSON.parse(await page.locator('#structured-data').textContent());
    expect(schema.find(item => item['@type'] === 'BlogPosting').url).toBe('https://mictestingtool.com/blog/how-to-connect-set-up-microphone');
  }
  await expect(page.locator('.markdown-body')).toContainText('PC support does not guarantee console support.');
  expect(errors).toEqual([]);
});

test('setup guide is discoverable from archive, search, homepage and testing hub', async ({ page }) => {
  const title = 'How to Connect and Set Up a Microphone on PC or Mac';
  await page.goto('/blog');
  await page.getByRole('link', { name: title, exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/how-to-connect-set-up-microphone$/);
  await page.goto('/blog');
  await page.getByRole('searchbox', { name: 'Search microphone guides' }).fill('connect');
  await page.getByRole('link', { name: title, exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/how-to-connect-set-up-microphone$/);
  await page.goto('/blog/how-to-test-your-microphone');
  await page.getByRole('link', { name: 'PC and Mac microphone setup guide', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/how-to-connect-set-up-microphone$/);
  await page.locator('.article-related').getByRole('link', { name: 'How to Test Your Microphone: A Step-by-Step Guide', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/how-to-test-your-microphone$/);
  await page.goto('/');
  await page.getByRole('link', { name: 'connect and set up a microphone on PC or Mac', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/how-to-connect-set-up-microphone$/);
});

test('how-to hub has working contents, article metadata, author and responsive layout', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/blog/how-to-test-your-microphone');
    await expect(page).toHaveTitle('How to Test Your Microphone: Online & PC Guide');
    await expect(page.locator('h1')).toHaveText('How to Test Your Microphone: A Step-by-Step Guide');
    await expect(page.locator('time[datetime="2026-10-26"]')).toBeVisible();
    await page.locator('.article-contents summary').click();
    await page.locator('.article-contents').getByRole('link', { name: 'How to test a mic on a Windows PC', exact: true }).click();
    const heading = page.getByRole('heading', { name: 'How to test a mic on a Windows PC', exact: true });
    await expect(heading).toBeInViewport();
    const box = await heading.boundingBox();
    const header = await page.locator('.site-header').boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(header.y + header.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const schema = JSON.parse(await page.locator('#structured-data').textContent());
    expect(schema.find(item => item['@type'] === 'BlogPosting').dateModified).toBe('2026-10-26');
  }
  await page.locator('a[rel="author"]').click();
  await expect(page.locator('#article-author')).toBeInViewport();
  await page.locator('.article-start').getByRole('link').click();
  await expect(page).toHaveURL(/\/#microphone-test$/);
  await expect(page.getByRole('button', { name: 'Start Free Microphone Test', exact: true })).toBeInViewport();
  expect(errors).toEqual([]);
});

test('blog archive links to the updated hub and client metadata stays unique', async ({ page }) => {
  await page.goto('/blog');
  await page.getByRole('link', { name: 'How to Test Your Microphone: A Step-by-Step Guide', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/how-to-test-your-microphone$/);
  await expect(page.locator('head > title')).toHaveCount(1);
  await expect(page.locator('head > meta[name=description]')).toHaveCount(1);
  await expect(page.locator('head > link[rel=canonical]')).toHaveAttribute('href', 'https://mictestingtool.com/blog/how-to-test-your-microphone');
  await expect(page.locator('head > meta[property="article:modified_time"]')).toHaveAttribute('content', '2026-10-26');
});
