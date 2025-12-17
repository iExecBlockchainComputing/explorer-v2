import { test, expect } from '@playwright/test';

test.describe('Apps Row Navigation', () => {
  test('Navigate to app details via row click', async ({ page }) => {
    // Navigate to apps page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/apps');
    await page.waitForSelector('table');
    
    // Wait for table to load with data
    await page.waitForTimeout(2000);
    
    // Get the first app ID for navigation
    const firstAppCell = page.locator('td').filter({ hasText: /^0x[a-fA-F0-9]/ }).first();
    const firstAppId = await firstAppCell.textContent();
    
    if (firstAppId) {
      // Click on the app ID text (not the row) to navigate
      const appLink = firstAppCell.getByText(/^0x[a-fA-F0-9]/);
      await appLink.click();
      
      // Verify navigation to app details page
      await expect(page).toHaveURL(/.*\/app\/0x[a-fA-F0-9]+$/);
      
      // Verify app details page content
      await expect(page.getByRole('heading', { name: /App/ })).toBeVisible();
      
      // Verify app ID is displayed in the details - check for address cell
      await expect(page.getByText('Address')).toBeVisible();
      
      // Verify we're on the correct app details page by checking URL
      const currentUrl = page.url();
      expect(currentUrl).toContain('/app/');
      
      // Verify breadcrumb navigation
      const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
        .filter({ has: page.locator('text=Homepage') });
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByText('All apps')).toBeVisible();
      
      // Verify tabs are present on details page
      await expect(page.getByRole('button', { name: 'DETAILS' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'DEALS' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'ACCESS' })).toBeVisible();
      
      // Navigate back to apps list
      await page.getByText('All apps').click();
      
      // Verify we're back on the apps page
      await expect(page).toHaveURL(/.*\/apps$/);
      await expect(page.getByRole('heading', { name: /Apps/ })).toBeVisible();
    }
  });
});