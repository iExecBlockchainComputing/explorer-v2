import { test, expect } from '@playwright/test';

test.describe('Table Row Click Navigation', () => {
  test('Navigate to deal details via row click', async ({ page }) => {
    // Navigate to deals page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all deals' }).click();
    
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Click on the deal ID text to navigate to deal details
    const dealIdText = page.getByText(/0x[a-fA-F0-9]{6}\.\.\.[a-fA-F0-9]{5}/).first();
    
    await dealIdText.click();
    
    // Verify navigation to deal detail page
    await expect(page).toHaveURL(/.*\/deal\/0x[a-fA-F0-9]+/);
    
    // Verify deal details page loads with comprehensive information
    await expect(page.getByRole('heading', { name: 'Deal details' })).toBeVisible();
    
    // Verify breadcrumb shows: Homepage > All deals > Deal {truncated-id}
    const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
      .filter({ has: page.locator('text=Homepage') });
    await expect(breadcrumb.getByText('All deals')).toBeVisible();
    await expect(breadcrumb.getByText(/Deal 0x[a-fA-F0-9]{3}\.\.\.[a-fA-F0-9]{5}/)).toBeVisible();
    
    // Verify back button is present and functional
    const backButton = page.getByRole('button', { name: 'Back' });
    await expect(backButton).toBeVisible();
    
    // Test back button functionality
    await backButton.click();
    await expect(page).toHaveURL(/.*\/deals$/);
  });
});