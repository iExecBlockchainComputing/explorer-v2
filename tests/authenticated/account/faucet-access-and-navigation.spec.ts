import { test, expect } from '@playwright/test';

test.describe('Faucet Access and Navigation', () => {
  test('Faucet Access and Navigation', async ({ page }) => {
    // 1. Navigate to homepage
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet');
    await page.waitForLoadState('networkidle');

    // 2. Click 'Faucet' link in navbar
    const faucetLink = page.getByRole('link', { name: /faucet/i });
    await expect(faucetLink).toBeVisible();
    await faucetLink.click();

    // 3. Verify navigation to account page with faucet tab
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/account\?accountTab=Faucet.*/);

    // Verify we're on the faucet page  
    await expect(page.getByRole('heading', { name: 'Faucet' })).toBeVisible();

    // 4. Test direct navigation to /account?accountTab=Faucet
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/account?accountTab=Faucet');
    await page.waitForLoadState('networkidle');

    // Should be on account page with faucet tab active
    await expect(page).toHaveURL(/.*\/account\?accountTab=Faucet.*/);

    // 5. Verify faucet page layout and content
    await expect(page.getByRole('heading', { name: /faucet/i })).toBeVisible();
    
    // Check for network selection elements
    await expect(page.getByRole('heading', { name: 'Select Network' })).toBeVisible();
    await expect(page.getByText('Switch to Arbitrum Sepolia network to claim faucet.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Switch to Arbitrum Sepolia' })).toBeVisible();

    // 6. Test breadcrumb navigation
    const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"]')
      .or(page.locator('nav:has(a[href*="homepage"])'))
      .or(page.locator('.breadcrumb'));

    if (await breadcrumb.isVisible()) {
      // Test breadcrumb links
      const homepageLink = breadcrumb.getByRole('link', { name: /homepage/i })
        .or(breadcrumb.getByRole('link', { name: /home/i }));

      if (await homepageLink.isVisible()) {
        await homepageLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*\/arbitrum-mainnet\/?$/);
        
        // Go back to faucet
        await page.goto('https://explorer.iex.ec/arbitrum-mainnet/account?accountTab=Faucet');
      }
    }

    // Test navigation from different starting pages
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/deals');
    await faucetLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/account\?accountTab=Faucet.*/);

    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/tasks');
    await faucetLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/account\?accountTab=Faucet.*/);

    // Verify faucet link is consistently visible across pages
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/apps');
    await expect(faucetLink).toBeVisible();
    
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/datasets');
    await expect(faucetLink).toBeVisible();
    
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/workerpools');
    await expect(faucetLink).toBeVisible();
  });
});