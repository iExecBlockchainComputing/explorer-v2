// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task Details Page', () => {
  test('Access task page from homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:5173/arbitrum-mainnet');

    // Click on the first task in the table
    await page.getByText('0x061a32...1c166').click();

    // Verify that the task detail page is displayed
    await expect(page.getByText('Task details')).toBeVisible();

    // Verify that the DETAILS tab is visible
    await expect(page.getByRole('tab', { name: 'DETAILS' })).toBeVisible();

    // Verify that the DATASETS tab is visible
    await expect(page.getByRole('tab', { name: 'DATASETS' })).toBeVisible();

    // Verify that the RAW DATA tab is visible
    await expect(page.getByRole('tab', { name: 'RAW DATA' })).toBeVisible();
  });
});