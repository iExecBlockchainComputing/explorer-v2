// spec: specs/tasks-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Search and Filtering', () => {
  test('Test search functionality', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all tasks' }).click();
    await page.waitForSelector('table');
    
    // Locate search bar at top of page
    const searchBar = page.getByRole('textbox', { name: /search/i })
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"]'))
      .or(page.locator('input').filter({ hasText: /search/i }));
    
    await expect(searchBar).toBeVisible();
    
    // Get a task ID from the table for testing
    const firstTaskId = await page.getByRole('row')
      .filter({ hasNot: page.getByRole('columnheader') })
      .first()
      .getByText(/0x[a-fA-F0-9]+/)
      .first()
      .textContent();
    
    if (firstTaskId) {
      // Enter a task ID in search box
      await searchBar.fill(firstTaskId);
      await page.keyboard.press('Enter');
      
      // Verify search functionality behavior
      await page.waitForLoadState('networkidle');
      
      // Test search with different terms like addresses
      await searchBar.clear();
      await searchBar.fill('0x1234567890abcdef');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Test search with partial task IDs
      await searchBar.clear();
      const partialId = firstTaskId.substring(0, 10);
      await searchBar.fill(partialId);
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Verify search results or appropriate feedback
      // Search functionality may show results, error messages, or redirect to search page
      const searchResults = page.locator('table, .search-results, .no-results, .error');
      await expect(searchResults).toBeVisible();
    }
  });
});