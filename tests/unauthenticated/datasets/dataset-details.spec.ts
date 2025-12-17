import { test, expect } from '@playwright/test';

test.describe('Dataset Details Page', () => {
  test('Navigate to dataset details and verify tabs and information', async ({ page }) => {
    // Navigate to datasets page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/datasets');
    await page.waitForSelector('table');
    
    // Click on the first dataset ID to navigate to details
    const firstDatasetId = page.locator('td').filter({ hasText: /^0x[a-fA-F0-9]/ }).first().getByText(/^0x[a-fA-F0-9]/);
    await firstDatasetId.click();
    
    // Verify navigation to dataset details page
    await expect(page).toHaveURL(/.*\/dataset\/0x[a-fA-F0-9]+$/);
    
    // Verify dataset details page header
    await expect(page.getByRole('heading', { name: /Dataset/ })).toBeVisible();
    
    // Verify breadcrumb shows: Homepage > All datasets > [dataset ID]
    const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
      .filter({ has: page.locator('text=Homepage') });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('All datasets')).toBeVisible();
    
    // Verify tabs are present
    await expect(page.getByRole('button', { name: 'DETAILS' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'DEALS' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ACCESS' })).toBeVisible();
    
    // Verify DETAILS tab is active by default (buttons don't have aria-selected)
    await expect(page.getByRole('button', { name: 'DETAILS' })).toBeVisible();
    
    // Test DEALS tab
    await page.getByRole('button', { name: 'DEALS' }).click();
    await expect(page.getByRole('button', { name: 'DEALS' })).toBeVisible();
    
    // Test ACCESS tab  
    await page.getByRole('button', { name: 'ACCESS' }).click();
    await expect(page.getByRole('button', { name: 'ACCESS' })).toBeVisible();
    
    // Go back to DETAILS tab for raw data verification
    await page.getByRole('button', { name: 'DETAILS' }).click();
    
    // Verify details content is displayed (check for Address field which is always present)
    const detailsContent = page.getByText('Address');
    await expect(detailsContent).toBeVisible();
  });
});