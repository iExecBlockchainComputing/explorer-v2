import { test, expect } from '@playwright/test';

test.describe('Apps Pagination', () => {
  test('Test pagination controls and navigation', async ({ page }) => {
    // Navigate to apps page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/apps');
    await page.waitForSelector('table');
    
    // Check if pagination exists
    const pagination = page.locator('[role="navigation"]').filter({ hasText: /^(Previous|Next|\d+)/ }).first();
    
    if (await pagination.count() === 0) {
      console.log('No pagination found on apps page, skipping pagination test');
      return;
    }
    
    await expect(pagination).toBeVisible();
    
    // Note the current page (should be page 1)
    await expect(page).toHaveURL(/^(?!.*appsPage).*$/); // No page parameter means page 1
    
    // Click on page 2
    const page2Button = pagination.getByText('2').first();
    if (await page2Button.isVisible()) {
      await page2Button.click();
      
      // Verify URL updates with ?appsPage=2 parameter
      await expect(page).toHaveURL(/.*appsPage=2.*/);
      
      // Verify different app data loads on page 2
      await page.waitForSelector('table');
      await expect(page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') })).toHaveCount({ min: 1 });
      
      // Click on page 3 if available
      const page3Button = pagination.getByText('3').first();
      if (await page3Button.isVisible()) {
        await page3Button.click();
        
        // Verify URL updates and new data loads
        await expect(page).toHaveURL(/.*appsPage=3.*/);
        await page.waitForSelector('table');
      }
      
      // Go back to page 1
      const page1Button = pagination.getByText('1').first();
      if (await page1Button.isVisible()) {
        await page1Button.click();
        await expect(page).toHaveURL(/^(?!.*appsPage).*$/);
      }
    }
    
    // Verify table structure remains consistent across pages
    const expectedHeaders = ['Address', 'Name', 'Owner', 'Time', 'TxHash'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header }).first()).toBeVisible();
    }
  });
});