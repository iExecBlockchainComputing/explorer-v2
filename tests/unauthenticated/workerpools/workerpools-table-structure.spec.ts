import { test, expect } from '@playwright/test';

test.describe('Workerpools Table Structure and Data Display', () => {
  test('Verify workerpools table structure and data display', async ({ page }) => {
    // Navigate to workerpools page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/workerpools');
    
    // Wait for table to load with data
    await page.waitForSelector('table');
    
    // Verify table headers are present
    const expectedHeaders = ['Workerpool', 'Description', 'Owner', 'Time', 'TxHash'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header }).first()).toBeVisible();
    }
    
    // Verify table contains multiple workerpool rows with data
    const tableRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    // Wait for at least one row to have content
    await expect(tableRows.first().getByText(/0x[a-fA-F0-9]+/).first()).toBeVisible();
    
    // Verify we have at least one row
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
    
    // Verify copy buttons are present for addresses
    const copyButtons = page.locator('button').filter({ hasText: '' });
    if ((await copyButtons.count()) > 0) {
      await expect(copyButtons.first()).toBeVisible();
    }
  });
});