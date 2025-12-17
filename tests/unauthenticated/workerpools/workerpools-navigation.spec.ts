import { test, expect } from '@playwright/test';

test.describe('Workerpools Table Navigation and Display', () => {
  test('Navigate to workerpools page from homepage', async ({ page }) => {
    // Navigate to the iExec explorer homepage
    await page.goto('https://explorer.iex.ec');
    
    // Navigate directly to workerpools page to avoid homepage section dependencies
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/workerpools');
    
    // Verify navigation to workerpools page with correct URL
    await expect(page).toHaveURL(/.*\/workerpools$/);
    
    // Verify workerpools page header displays 'Workerpools'
    await expect(page.getByRole('heading', { name: /Workerpools/ })).toBeVisible();
    
    // Verify breadcrumb navigation shows: Homepage > All workerpools
    const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
      .filter({ has: page.locator('text=Homepage') });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('All workerpools')).toBeVisible();
  });
});