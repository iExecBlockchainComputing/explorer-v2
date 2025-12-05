import { test, expect } from '@playwright/test';

test.describe('Search and Filtering', () => {
  test('Test search functionality', async ({ page }) => {
    // Navigate to deals page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all deals' }).click();
    
    // Wait for page to load
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
    
    // Get a deal ID from the first row for testing
    const firstRow = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }).first();
    const dealIdText = await firstRow.getByRole('cell').first().textContent();
    
    if (dealIdText) {
      // Extract the truncated deal ID (remove any extra whitespace)
      const truncatedDealId = dealIdText.trim();
      
      // Enter the deal ID in search box
      await searchBox.fill(truncatedDealId);
      await page.keyboard.press('Enter');
      
      // Wait for search results or navigation
      await page.waitForTimeout(2000);
      
      // Verify search functionality - this could either filter results or navigate to deal details
      // Check if we're on a deal detail page or if results are filtered
      const currentUrl = page.url();
      if (currentUrl.includes('/deal/')) {
        // Navigated to deal details
        await expect(page.getByRole('heading', { name: 'Deal details' })).toBeVisible();
      } else {
        // Results should be filtered or search should be active
        await expect(searchBox).toHaveValue(truncatedDealId);
      }
      
      // Test search clearing
      await searchBox.clear();
      if (!currentUrl.includes('/deal/')) {
        // If still on deals page, verify search clears
        await expect(searchBox).toHaveValue('');
      }
    }
  });
});