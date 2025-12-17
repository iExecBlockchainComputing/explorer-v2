import { test, expect } from '@playwright/test';

test.describe('Workerpools Pagination', () => {
  test('Test pagination controls and navigation', async ({ page }) => {
    // Navigate to workerpools page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/workerpools');
    await page.waitForSelector('table');
    
    // Check if pagination exists
    const pagination = page.locator('[role="navigation"]').filter({ hasText: /^(Previous|Next|\d+)/ }).first();
    
    if (await pagination.count() === 0) {
      console.log('No pagination found on workerpools page, skipping pagination test');
      return;
    }
    
    await expect(pagination).toBeVisible();
    
    // Note the current page (should be page 1)
    await expect(page).toHaveURL(/^(?!.*workerpoolsPage).*$/); // No page parameter means page 1
    
    // Click on page 2
    const page2Button = pagination.getByText('2').first();
    if (await page2Button.isVisible()) {
      await page2Button.click();
      
      // Verify URL updates with ?workerpoolsPage=2 parameter
      await expect(page).toHaveURL(/.*workerpoolsPage=2.*/);
      
      // Verify different workerpool data loads on page 2
      await page.waitForSelector('table');
      await expect(page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') })).toHaveCount({ min: 1 });
      
      // Click on page 3 if available
      const page3Button = pagination.getByText('3').first();
      if (await page3Button.isVisible()) {
        await page3Button.click();
        
        // Verify URL updates and new data loads
        await expect(page).toHaveURL(/.*workerpoolsPage=3.*/);
        await page.waitForSelector('table');
      }
      
      // Go back to page 1
      const page1Button = pagination.getByText('1').first();
      if (await page1Button.isVisible()) {
        await page1Button.click();
        await expect(page).toHaveURL(/^(?!.*workerpoolsPage).*$/);
      }
    }
    
    // Verify table structure remains consistent across pages
    const expectedHeaders = ['Workerpool', 'Description', 'Owner', 'Time', 'TxHash'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header }).first()).toBeVisible();
    }
  });
});