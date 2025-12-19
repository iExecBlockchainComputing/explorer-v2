// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Deal Details Page', () => {
  test('Access deal page from homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:5173/arbitrum-mainnet');

    // Click on the deal ID text to navigate to deal details
    await page.getByText('0x0481db...5b040').click();

    // Verify that the Deal details heading is displayed
    await expect(page.getByText('Deal details')).toBeVisible();

    // Verify that the DETAILS tab is visible
    await expect(page.getByRole('tab', { name: 'DETAILS' })).toBeVisible();

    // Verify that the TASKS tab is visible
    await expect(page.getByRole('tab', { name: 'TASKS' })).toBeVisible();
  });
});