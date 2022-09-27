import { test, expect } from '@playwright/test';

const url = 'http://localhost:3000';

test('homepage has "Home" in title and second route link to the second page', async ({ page }) => {
  await page.goto(url);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Home/);

  // create a locator
  const toRoute = page.locator('text=Second route');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(toRoute).toHaveAttribute('href', '/second');

  // Click the get started link.
  await toRoute.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*second/);
});
