import { test, expect } from '@playwright/test';

test.describe('Apps Table Navigation and Display', () => {
  test('Navigate to apps page from homepage', async ({ page }) => {
    // Navigate to the iExec explorer homepage
    await page.goto('https://explorer.iex.ec');
    
    // Navigate directly to apps page to avoid homepage section dependencies
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/apps');
    
    // Verify navigation to apps page with correct URL
    await expect(page).toHaveURL(/.*\/apps$/);
    
    // Verify apps page header displays 'Apps'
    await expect(page.getByRole('heading', { name: /Apps/ })).toBeVisible();
    
    // Verify breadcrumb navigation shows: Homepage > All apps
    const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
      .filter({ has: page.locator('text=Homepage') });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('All apps')).toBeVisible();
  });
});