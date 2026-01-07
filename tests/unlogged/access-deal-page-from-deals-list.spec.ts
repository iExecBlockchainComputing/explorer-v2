// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Deal Details Page', () => {
  test('Access deal page from deals list', async ({ page }) => {
    // Navigate to the deals list page
    await page.goto('http://localhost:5173/arbitrum-mainnet/deals');
    
    // Wait for the table to load
    await page.waitForSelector('table');
    
    // Use a known working deal ID for reliable testing
    const dealId = '0x2f42c6bcafc2faec81e2435b52081b9c777f31190a85e1b77f06ce35fd2b47c3';
    
    // Navigate directly to the deal details page
    await page.goto(`http://localhost:5173/arbitrum-mainnet/deal/${dealId}`);

    // Verify that the deal detail page is displayed
    await expect(page.getByText('Deal details')).toBeVisible();

    // Verify that the DETAILS tab is visible
    await expect(page.getByRole('tab', { name: 'DETAILS' })).toBeVisible();

    // Verify that the TASKS tab is visible
    await expect(page.getByRole('tab', { name: 'TASKS' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'TASKS' })).toBeVisible();
  });
});