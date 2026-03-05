// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Index - Search', () => {
  test('Invalid search', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:5173/arbitrum-mainnet');
    
    // Given the user enters `0x908ab1ca1fb0179253534d8b5f7777b8499b34f`
    await page.getByRole('searchbox', { name: 'Search for addresses, deal' }).fill('0x908ab1ca1fb0179253534d8b5f7777b8499b34f');
    
    // When the search is executed
    await page.keyboard.press('Enter');
    
    // Then no result is returned
    await expect(page.getByText('Invalid value')).toBeVisible();
  });
});