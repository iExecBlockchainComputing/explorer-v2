import { test, expect } from '@playwright/test';

test.describe('Datasets Row Navigation', () => {
  test('Navigate to dataset details via row click', async ({ page }) => {
    // Navigate to datasets page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/datasets');
    await page.waitForSelector('table');
    
    // Wait for table to load with data
    await page.waitForTimeout(2000);
    
    // Get the first dataset ID for navigation
    const firstDatasetCell = page.locator('td').filter({ hasText: /^0x[a-fA-F0-9]/ }).first();
    const firstDatasetId = await firstDatasetCell.textContent();
    
    if (firstDatasetId) {
      // Click on the dataset ID text (not the row) to navigate
      const datasetLink = firstDatasetCell.getByText(/^0x[a-fA-F0-9]/);
      await datasetLink.click();
      
      // Verify navigation to dataset details page
      await expect(page).toHaveURL(/.*\/dataset\/0x[a-fA-F0-9]+$/);
      
      // Verify dataset details page content
      await expect(page.getByRole('heading', { name: /Dataset/ })).toBeVisible();
      
      // Verify dataset ID is displayed in the details - check for address cell
      await expect(page.getByText('Address')).toBeVisible();
      
      // Verify we're on the correct dataset details page by checking URL
      const currentUrl = page.url();
      expect(currentUrl).toContain('/dataset/');
      
      // Verify breadcrumb navigation
      const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
        .filter({ has: page.locator('text=Homepage') });
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByText('All datasets')).toBeVisible();
      
      // Verify tabs are present on details page
      await expect(page.getByRole('button', { name: 'DETAILS' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'DEALS' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'ACCESS' })).toBeVisible();
      
      // Navigate back to datasets list
      await page.getByText('All datasets').click();
      
      // Verify we're back on the datasets page
      await expect(page).toHaveURL(/.*\/datasets$/);
      await expect(page.getByRole('heading', { name: /Datasets/ })).toBeVisible();
    }
  });
});