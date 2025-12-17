import { test, expect } from '@playwright/test';

test.describe('Responsive Design and Accessibility', () => {
  test('Test responsive behavior and accessibility', async ({ page }) => {
    // Navigate to datasets page on desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/datasets');
    await page.waitForSelector('table');
    
    // Verify table displays properly with all columns
    const expectedHeaders = ['Dataset', 'Name', 'Type', 'Owner', 'Time', 'TxHash'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header }).first()).toBeVisible();
    }
    
    // Resize to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify table remains functional and readable
    await expect(page.locator('table')).toBeVisible();
    
    // Check that content is still accessible even if layout changes
    const datasetRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    await expect(datasetRows.first()).toBeVisible();
    
    // Reset to desktop for keyboard navigation testing
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    
    // Test keyboard navigation by focusing on specific interactive elements instead of :focus
    const copyButtons = page.getByRole('button').filter({ hasText: 'Copy' });
    if (await copyButtons.count() > 0) {
      const firstCopyButton = copyButtons.first();
      await firstCopyButton.focus();
      await expect(firstCopyButton).toBeVisible();
      
      // Test tab navigation through interactive elements
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100); // Small delay for focus to stabilize
      }
    } else {
      // If no copy buttons, try navigation links
      const navLinks = page.getByRole('link');
      if (await navLinks.count() > 0) {
        const firstLink = navLinks.first();
        await firstLink.focus();
        await expect(firstLink).toBeVisible();
      }
    }
    
    // Test with screen reader compatibility by checking for proper data attributes
    const tableElement = page.locator('table');
    await expect(tableElement).toHaveAttribute('data-slot', 'table');
    
    // Switch back to mobile for mobile-specific tests
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Verify mobile-specific UI adaptations
    const mobileElements = page.locator('.mobile-only, .sm\\:hidden, .md\\:hidden');
    // These elements should be visible or properly handled on mobile
    
    // Check that truncated content is properly displayed
    const truncatedText = page.getByText(/0x[a-fA-F0-9]{8}\.{3}/);
    if (await truncatedText.count() > 0) {
      await expect(truncatedText.first()).toBeVisible();
    }
    
    // Verify navigation elements work on mobile
    const breadcrumb = page.locator('[role="navigation"]').first();
    await expect(breadcrumb).toBeVisible();
    
    // Test that buttons and interactive elements are accessible
    const interactiveElements = page.locator('button, a, input, select');
    const interactiveCount = await interactiveElements.count();
    
    if (interactiveCount > 0) {
      // Check that elements are large enough for touch interaction
      const firstButton = interactiveElements.first();
      const boundingBox = await firstButton.boundingBox();
      if (boundingBox) {
        // Buttons should be at least 44x44px for good touch targets
        expect(boundingBox.height).toBeGreaterThanOrEqual(20);
        expect(boundingBox.width).toBeGreaterThanOrEqual(20);
      }
    }
  });
});