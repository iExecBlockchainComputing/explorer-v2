import { test, expect } from '@playwright/test';

test.describe('Responsive Design and Accessibility', () => {
  test('Test responsive behavior and accessibility', async ({ page }) => {
    // Navigate to deals page on desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/deals');
    
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Verify table displays properly on desktop (be specific about the deals table)
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
    
    // Verify all columns are visible on desktop
    const columnHeaders = ['Deal', 'App', 'Workerpool', 'Dataset', 'Time', 'Success', 'Price'];
    for (const header of columnHeaders) {
      await expect(page.getByRole('columnheader', { name: header }).first()).toBeVisible();
    }
    
    // Resize to tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    // Verify table remains functional
    await expect(table).toBeVisible();
    
    // Resize to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Verify table remains functional and readable on mobile
    await expect(table).toBeVisible();
    
    // Test that at least some content is still visible
    const tableRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    await expect(tableRows.first()).toBeVisible();
    
    // Reset to desktop for keyboard navigation testing
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    
    // Test keyboard navigation through table rows
    // Focus on the first data row
    const firstRow = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }).first();
    await firstRow.focus();
    
    // Test tab navigation through interactive elements
    const copyButtons = page.getByRole('button').filter({ hasText: '' }); // Copy buttons typically have no text
    const buttonCount = await copyButtons.count();
    
    if (buttonCount > 0) {
      // Focus on first copy button
      await copyButtons.first().focus();
      
      // Test that focus is visible (button should be focused)
      await expect(copyButtons.first()).toBeFocused();
      
      // Test tab navigation to next button
      await page.keyboard.press('Tab');
      
      // Verify tab order works
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
    
    // Test Enter key navigation on table row
    await firstRow.focus();
    await page.keyboard.press('Enter');
    
    // Should navigate to deal details
    await expect(page).toHaveURL(/.*\/deal\/0x[a-fA-F0-9]+/);
    
    // Test accessibility - check for proper ARIA labels and roles
    await page.goBack();
    await page.waitForSelector('table');
    
    // Verify table has proper accessibility structure
    const dealsTable = page.locator('table').first();
    await expect(dealsTable).toBeVisible();
    
    // Check that we have column headers
    const headerCount = await page.getByRole('columnheader').count();
    expect(headerCount).toBeGreaterThanOrEqual(5);
    
    // Check for navigation landmarks
    const navigation = page.locator('nav, [role="navigation"]');
    const navCount = await navigation.count();
    expect(navCount).toBeGreaterThanOrEqual(1);
  });
});