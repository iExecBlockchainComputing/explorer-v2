// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Page Apps', () => {
  test('Apps table behavior', async ({ page }) => {
    // Given the user navigates to the Apps page
    await page.goto('http://localhost:5173/arbitrum-mainnet/apps');
    
    // Then the table is displayed with all expected columns
    await expect(page.getByRole('columnheader', { name: 'Address' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Owner' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Time' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'TxHash' })).toBeVisible();
    
    // And pagination is available
    await expect(page.getByText('Previous')).toBeVisible();
    await expect(page.getByText('Next')).toBeVisible();
    
    // And the Home button is present and functional
    await expect(page.getByText('Homepage')).toBeVisible();
    await page.getByRole('link', { name: 'Homepage' }).click();
    await expect(page.getByText('The iExec Protocol Explorer')).toBeVisible();
  });
});