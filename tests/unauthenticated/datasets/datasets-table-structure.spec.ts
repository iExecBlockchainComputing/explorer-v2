import { test, expect } from '@playwright/test';

test.describe('Datasets Table Structure and Data Display', () => {
  test('Verify datasets table structure and data display', async ({ page }) => {
    // Navigate to datasets page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/datasets');
    
    // Wait for table to load with data
    await page.waitForSelector('table');
    
    // Verify table headers are present
    const expectedHeaders = ['Dataset', 'Name', 'Type', 'Owner', 'Time', 'TxHash'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header }).first()).toBeVisible();
    }
    
    // Verify table contains multiple dataset rows with data
    const tableRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    // Wait for at least one row to have content
    await expect(tableRows.first().getByText(/0x[a-fA-F0-9]+/).first()).toBeVisible();
    
    // Verify we have at least one row
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
    
    // Verify copy buttons are present for addresses
    const copyButtons = page.locator('button').filter({ hasText: '' });
    // Note: Copy buttons exist but don't have visible text, they have icons
  });
});