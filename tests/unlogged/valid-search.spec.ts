// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Index - Search', () => {
  test('Valid search', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:5173/arbitrum-mainnet');
    
    // Given the user enters `0xa201d2c9f3464c55639589d25fa6a3ec49c9f238`
    await page.getByRole('searchbox', { name: 'Search for addresses, deal' }).fill('0xa201d2c9f3464c55639589d25fa6a3ec49c9f238');
    
    // When the search is executed
    await page.keyboard.press('Enter');
    
    // Then the corresponding entity page is displayed
    await expect(page.getByText('App details')).toBeVisible();
  });
});