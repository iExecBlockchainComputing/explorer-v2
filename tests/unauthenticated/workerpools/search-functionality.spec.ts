import { test, expect } from '@playwright/test';

test.describe('Workerpools Search Functionality', () => {
  test('Test search functionality', async ({ page }) => {
    // Navigate to workerpools page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/workerpools');
    await page.waitForSelector('table');
    
    // Locate search bar at top of page
    const searchBox = page.getByRole('textbox', { name: /search/i })
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"]'))
      .or(page.locator('input[placeholder*="search"]'))
      .or(page.locator('input[placeholder*="address"]'))
      .or(page.locator('input[placeholder*="deal"]'))
      .or(page.locator('input[placeholder*="task"]'))
      .or(page.locator('input[placeholder*="transaction"]'));
    
    await expect(searchBox).toBeVisible();
    
    // Get a workerpool ID from the first row for testing
    const firstRow = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }).first();
    await expect(firstRow).toBeVisible();
    
    const workerpoolIdCell = firstRow.locator('td').filter({ hasText: /^0x[a-fA-F0-9]/ }).first();
    const fullWorkerpoolId = await workerpoolIdCell.textContent();
    
    if (fullWorkerpoolId) {
      // Use a portion of the ID for search
      const searchTerm = fullWorkerpoolId.slice(0, 10); // First 10 characters
      
      // Clear any existing search and enter new term
      await searchBox.clear();
      await searchBox.fill(searchTerm);
      await page.waitForTimeout(1000); // Wait for search results
      
      // Verify search filtered results
      const filteredRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
      const firstFilteredRow = filteredRows.first();
      await expect(firstFilteredRow).toBeVisible();
      
      // Verify the search result contains our search term
      const resultText = await firstFilteredRow.textContent();
      expect(resultText?.toLowerCase()).toContain(searchTerm.toLowerCase());
      
      // Clear search to show all results again
      await searchBox.clear();
      await page.waitForTimeout(500);
    }
    
    // Verify table structure remains intact after search
    const expectedHeaders = ['Workerpool', 'Description', 'Owner', 'Time', 'TxHash'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header }).first()).toBeVisible();
    }
  });
});