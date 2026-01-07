// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Deal Details Page', () => {
  test('Verify deal tabs', async ({ page }) => {
    // Navigate directly to a deal details page
    await page.goto('http://localhost:5173/arbitrum-mainnet/deal/0x0481dbad29b7863d88a14abb5ed2d57260f464362effd2b063b6970ff3e5b040');

    // Verify that the DETAILS tab is visible
    await expect(page.getByRole('tab', { name: 'DETAILS' })).toBeVisible();

    // Verify that the TASKS tab is visible
    await expect(page.getByRole('tab', { name: 'TASKS' })).toBeVisible();

    // Verify that the ASSOCIATED DEALS tab is visible
    await expect(page.getByRole('tab', { name: 'ASSOCIATED DEALS' })).toBeVisible();
  });
});