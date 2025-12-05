import { test, expect } from '@playwright/test';

test.describe('Deals Table Structure and Data Display', () => {
  test('Verify deals table structure and data display', async ({ page }) => {
    // Navigate to deals page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all deals' }).click();
    
    // Wait for table to load with data
    await page.waitForSelector('table');
    
    // Verify table headers are present
    const expectedHeaders = ['Deal', 'App', 'Workerpool', 'Dataset', 'Time', 'Success', 'Price'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header }).first()).toBeVisible();
    }
    
    // Verify table contains multiple deal rows with data
    const tableRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    // Wait for at least one row to have content
    await expect(tableRows.first().getByText(/0x[a-fA-F0-9]+/).first()).toBeVisible();
    
    // Verify we have at least one row
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
    
    // Verify each row displays truncated addresses with copy buttons
    const firstRow = tableRows.first();
    const buttonCount = await firstRow.getByRole('button').count();
    expect(buttonCount).toBeGreaterThanOrEqual(3); // At least 3 copy buttons per row
    
    // Verify time column shows relative time (e.g., '14h ago')
    await expect(firstRow.getByText(/\d+[hdm]\s+ago|\d+d\s+ago/)).toBeVisible();
    
    // Verify success column shows percentage (e.g., '100%')
    await expect(firstRow.getByText(/\d+%/)).toBeVisible();
    
    // Verify price column shows amount with RLC token symbol
    await expect(firstRow.getByText(/\d+(\.\d+)?\s+RLC/)).toBeVisible();
    
    // Verify dataset column can show 'Datasets bulk' or specific addresses
    const datasetCells = page.getByRole('cell').filter({ hasText: /Datasets bulk|0x[a-fA-F0-9]+/ });
    const datasetCellCount = await datasetCells.count();
    expect(datasetCellCount).toBeGreaterThanOrEqual(1);
  });
});