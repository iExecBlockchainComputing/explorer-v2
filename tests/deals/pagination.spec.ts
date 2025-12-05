import { test, expect } from '@playwright/test';

test.describe('Pagination Testing', () => {
  test('Test pagination controls and navigation', async ({ page }) => {
    // Navigate to deals page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all deals' }).click();
    
    // Wait for table and pagination to load
    await page.waitForSelector('table');
    await page.waitForSelector('nav[role="navigation"], [role="navigation"]');
    
    // Verify pagination controls are present at bottom
    const pagination = page.locator('nav').filter({ has: page.getByText(/\d+/) });
    await expect(pagination).toBeVisible();
    
    // Note the current page (should be page 1)
    await expect(page).toHaveURL(/^(?!.*dealsPage).*$/); // No page parameter means page 1
    
    // Click on page 2
    const page2Button = pagination.getByText('2').first();
    if (await page2Button.isVisible()) {
      await page2Button.click();
      
      // Verify URL updates with ?dealsPage=2 parameter
      await expect(page).toHaveURL(/.*dealsPage=2.*/);
      
      // Verify different deal data loads on page 2
      await page.waitForSelector('table');
      await expect(page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') })).toHaveCount({ min: 1 });
      
      // Click on page 3 if available
      const page3Button = pagination.getByText('3').first();
      if (await page3Button.isVisible()) {
        await page3Button.click();
        
        // Verify URL updates and new data loads
        await expect(page).toHaveURL(/.*dealsPage=3.*/);
        await page.waitForSelector('table');
      }
      
      // Test Previous button
      const previousButton = pagination.getByText('Previous');
      if (await previousButton.isVisible()) {
        await previousButton.click();
        // Should go back one page
        await expect(page).toHaveURL(/.*dealsPage=2.*/);
      }
      
      // Test Next button
      const nextButton = pagination.getByText('Next');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        // Should advance one page
        await expect(page).toHaveURL(/.*dealsPage=3.*/);
      }
    }
  });
});