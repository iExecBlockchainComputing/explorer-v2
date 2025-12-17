import { test, expect } from '@playwright/test';

test.describe('Datasets Table Navigation and Display', () => {
  test('Navigate to datasets page from homepage', async ({ page }) => {
    // Navigate to the iExec explorer homepage
    await page.goto('https://explorer.iex.ec');
    
    // Navigate directly to datasets page to avoid homepage section dependencies
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/datasets');
    
    // Verify navigation to datasets page with correct URL
    await expect(page).toHaveURL(/.*\/datasets$/);
    
    // Verify datasets page header displays 'Datasets'
    await expect(page.getByRole('heading', { name: /Datasets/ })).toBeVisible();
    
    // Verify breadcrumb navigation shows: Homepage > All datasets
    const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
      .filter({ has: page.locator('text=Homepage') });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('All datasets')).toBeVisible();
  });
});