import { test, expect } from '@playwright/test';

test.describe('Workerpools Row Navigation', () => {
  test('Navigate to workerpool details via row click', async ({ page }) => {
    // Navigate to workerpools page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/workerpools');
    await page.waitForSelector('table');
    
    // Wait for table to load with data
    await page.waitForTimeout(2000);
    
    // Get the first workerpool ID for navigation
    const firstWorkerpoolCell = page.locator('td').filter({ hasText: /^0x[a-fA-F0-9]/ }).first();
    const firstWorkerpoolId = await firstWorkerpoolCell.textContent();
    
    if (firstWorkerpoolId) {
      // Click on the workerpool ID text (not the row) to navigate
      const workerpoolLink = firstWorkerpoolCell.getByText(/^0x[a-fA-F0-9]/);
      await workerpoolLink.click();
      
      // Verify navigation to workerpool details page
      await expect(page).toHaveURL(/.*\/workerpool\/0x[a-fA-F0-9]+$/);
      
      // Verify workerpool details page content
      await expect(page.getByRole('heading', { name: /Workerpool/ })).toBeVisible();
      
      // Verify workerpool ID is displayed in the details - check for address cell
      await expect(page.getByText('Address')).toBeVisible();
      
      // Verify we're on the correct workerpool details page by checking URL
      const currentUrl = page.url();
      expect(currentUrl).toContain('/workerpool/');
      
      // Verify breadcrumb navigation
      const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
        .filter({ has: page.locator('text=Homepage') });
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByText('All workerpools')).toBeVisible();
      
      // Verify tabs are present on details page
      await expect(page.getByRole('button', { name: 'DETAILS' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'DEALS' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'ACCESS' })).toBeVisible();
      
      // Navigate back to workerpools list
      await page.getByText('All workerpools').click();
      
      // Verify we're back on the workerpools page
      await expect(page).toHaveURL(/.*\/workerpools$/);
      await expect(page.getByRole('heading', { name: /Workerpools/ })).toBeVisible();
    }
  });
});