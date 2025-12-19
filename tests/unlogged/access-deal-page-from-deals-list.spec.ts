// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Deal Details Page', () => {
  test('Access deal page from deals list', async ({ page }) => {
    // Navigate to the deals list page
    await page.goto('http://localhost:5173/arbitrum-mainnet/deals');

    // Click on a deal in the table
    await page.getByText('0x0481db...5b040').click();

    // Verify that the deal detail page is displayed
    await expect(page.getByText('Deal details')).toBeVisible();

    // Verify that the DETAILS tab is visible
    await expect(page.getByRole('tab', { name: 'DETAILS' })).toBeVisible();

    // Verify that the TASKS tab is visible
    await expect(page.getByRole('tab', { name: 'TASKS' })).toBeVisible();
  });
});