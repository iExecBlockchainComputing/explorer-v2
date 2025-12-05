import { test, expect } from '@playwright/test';

test.describe('Deals Table Navigation and Display', () => {
  test('Navigate to deals page from homepage', async ({ page }) => {
    // Navigate to the iExec explorer homepage
    await page.goto('https://explorer.iex.ec');
    
    // Verify the 'Latest deals' section is visible
    await expect(page.getByRole('heading', { name: 'Latest deals' })).toBeVisible();
    
    // Click on 'View all deals' link
    await page.getByRole('link', { name: 'View all deals' }).click();
    
    // Verify navigation to deals page with correct URL
    await expect(page).toHaveURL(/.*\/deals$/);
    
    // Verify deals page header displays 'Deals' with deal icon
    await expect(page.getByRole('heading', { name: /Deals/ })).toBeVisible();
    
    // Verify breadcrumb navigation shows: Homepage > All deals
    const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
      .filter({ has: page.locator('text=Homepage') });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('All deals')).toBeVisible();
  });
});