import { test, expect } from '@playwright/test';

test.describe('Faucet Claiming Process', () => {
  test('Faucet Claiming Process', async ({ page }) => {
    // 1. Navigate to faucet page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/account?accountTab=Faucet');
    await page.waitForLoadState('domcontentloaded');

    // 2. Verify faucet page elements
    await expect(page.getByRole('heading', { name: 'Faucet' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Select Network' })).toBeVisible();
    
    // 3. Verify network switching instruction and current network
    await expect(page.getByText('Switch to Arbitrum Sepolia network to claim faucet.')).toBeVisible();
    await expect(page.getByRole('combobox')).toContainText('Arbitrum');
    
    // 4. Test network switch button
    const switchButton = page.getByRole('button', { name: 'Switch to Arbitrum Sepolia' });
    await expect(switchButton).toBeVisible();
    await expect(switchButton).toBeEnabled();
    
    // Test button interaction (note: actual network switching requires wallet connection)
    await switchButton.hover();
    
    console.log('Faucet claiming process verification completed successfully');
  });
});