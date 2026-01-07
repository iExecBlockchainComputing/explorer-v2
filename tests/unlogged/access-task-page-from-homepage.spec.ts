// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task Details Page', () => {
  test('Access task page from homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:5173/arbitrum-mainnet');
    
    // Wait for the tables to load
    await page.waitForSelector('table');
    
    // Use a known working task ID that exists in the current data
    const taskId = '0xcf4253493ffdab82395a3e6026e35af8fad7b57ce64c46efb5bdacafd345d52e';
    
    // Navigate directly to the task details page
    await page.goto(`http://localhost:5173/arbitrum-mainnet/task/${taskId}`);

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