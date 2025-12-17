import { test, expect } from '@playwright/test';

test.describe('Faucet Network Requirements', () => {
  test('Faucet Network Requirements', async ({ page }) => {
    // 1. Navigate to faucet page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/account?accountTab=Faucet');
    await page.waitForLoadState('domcontentloaded');

    // 2. Verify current network display
    await expect(page.getByRole('combobox')).toContainText('Arbitrum');

    // 3. Verify network switching requirement message
    await expect(page.getByText('Switch to Arbitrum Sepolia network to claim faucet.')).toBeVisible();

    // 4. Verify network selection heading and switch button
    await expect(page.getByRole('heading', { name: 'Select Network' })).toBeVisible();
    
    const switchButton = page.getByRole('button', { name: 'Switch to Arbitrum Sepolia' });
    await expect(switchButton).toBeVisible();
    await expect(switchButton).toBeEnabled();
    
    // 5. Test button interaction
    await switchButton.hover();
    
    console.log('Faucet network requirements verification completed successfully');
  });
});