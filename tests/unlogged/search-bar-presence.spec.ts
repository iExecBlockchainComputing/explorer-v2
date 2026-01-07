// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Index - Search', () => {
  test('Search bar presence', async ({ page }) => {
    // Given the user navigates to the homepage
    await page.goto('http://localhost:5173/arbitrum-mainnet');
    
    // Then the search bar is visible
    await expect(page.getByRole('searchbox', { name: 'Search for addresses, deal IDs, task IDs, or transaction hashes' })).toBeVisible();
  });
});