// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Index - Search', () => {
  test('Search using Enter key', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:5173/arbitrum-mainnet');
    
    // Given the user enters `0x908ab1ca1fb0179253534d8b5f7777b8499b34f2` in the search bar
    await page.getByRole('searchbox', { name: 'Search for addresses, deal' }).fill('0x908ab1ca1fb0179253534d8b5f7777b8499b34f2');
    
    // When the user presses Enter
    await page.keyboard.press('Enter');
    
    // Then the search result page is displayed
    await expect(page.getByText('Address details')).toBeVisible();
  });
});