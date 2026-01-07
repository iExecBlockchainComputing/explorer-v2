// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Page Deals', () => {
  test('Deals table behavior', async ({ page }) => {
    // Given the user navigates to the Deals page
    await page.goto('http://localhost:5173/arbitrum-mainnet/deals');
    
    // Then the table is displayed with all expected columns
    await expect(page.getByRole('columnheader', { name: 'Deal' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'App' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Workerpool' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Dataset' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Time' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Success' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
    
    // And pagination is available
    await expect(page.getByText('Previous')).toBeVisible();
    await expect(page.getByText('Next')).toBeVisible();
    
    // And the Home button is present and functional
    await expect(page.getByText('Homepage')).toBeVisible();
    await page.getByRole('link', { name: 'Homepage' }).click();
    await expect(page.getByText('The iExec Protocol Explorer')).toBeVisible();
    
    // Navigate back to test search functionality
    await page.goto('http://localhost:5173/arbitrum-mainnet/deals');
    
    // And the search bar works with `0xc86054f7c22487835d9587e13b08ebb372e73ce1`
    await page.getByRole('searchbox', { name: 'Search for addresses, deal' }).fill('0xc86054f7c22487835d9587e13b08ebb372e73ce1');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Dataset details')).toBeVisible();
  });
});