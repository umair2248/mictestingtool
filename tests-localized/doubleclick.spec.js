import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 } });

test('slow clicks pass, a chattering click is flagged, side button does not navigate', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/double-click-test');
  await expect(page).toHaveTitle('Mouse Double Click Test — Check If Your Mouse Double Clicks');
  await expect(page.locator('head > link[rel=canonical]')).toHaveAttribute('href', 'https://mictestingtool.com/double-click-test');

  const box = await page.locator('.dc-area').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 3; i++) { await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(250); }
  await expect(page.locator('.dc-table tbody tr').first()).toContainText('Left30');
  await expect(page.locator('.dc-summary')).toContainText('no double clicks so far');

  // Two presses back to back: what a worn switch sends for one press.
  await page.mouse.down(); await page.mouse.up(); await page.mouse.down(); await page.mouse.up();
  await expect(page.locator('.dc-summary')).toContainText('Double clicks detected: left button 1×');
  await expect(page.locator('.dc-log li.is-bad')).toHaveCount(1);

  await page.mouse.down({ button: 'right' }); await page.mouse.up({ button: 'right' });
  await expect(page.locator('.dc-table tbody tr', { hasText: 'Right' })).toContainText('Right10');

  await page.mouse.wheel(0, -100); await page.mouse.wheel(0, 100); await page.mouse.wheel(0, 100);
  await expect(page.locator('.dc-wheel')).toContainText('1 up · 2 down');

  await page.getByRole('button', { name: 'Reset test' }).click();
  await expect(page.locator('.dc-summary')).toContainText('Click inside the box');
  await expect(page).toHaveURL(/double-click-test$/);
  expect(errors).toEqual([]);
});
