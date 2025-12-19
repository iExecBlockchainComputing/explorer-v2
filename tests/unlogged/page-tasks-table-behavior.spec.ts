// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Page Tasks', () => {
  test('Tasks table behavior', async ({ page }) => {
    // Given the user navigates to the Tasks page
    await page.goto('http://localhost:5173/arbitrum-mainnet/tasks');
    
    // Then the table is displayed with all expected columns
    await expect(page.getByRole('columnheader', { name: 'Task' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Deadline' })).toBeVisible();
    
    // And pagination is available
    await expect(page.getByText('Previous')).toBeVisible();
    await expect(page.getByText('Next')).toBeVisible();
    
    // And the Home button is present and functional
    await expect(page.getByText('Homepage')).toBeVisible();
    await page.getByRole('link', { name: 'Homepage' }).click();
    await expect(page.getByText('The iExec Protocol Explorer')).toBeVisible();
  });
});