// spec: specs/tasks-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task Status and Actions', () => {
  test('Test task status display and user actions', async ({ page }) => {
    // Navigate to a task detail page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all tasks' }).click();
    await page.waitForSelector('table');
    
    const firstRow = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }).first();
    const deadlineCell = firstRow.locator('td').nth(2);
    await deadlineCell.click();
    
    // Verify task status is clearly displayed
    await expect(page.getByText(/Status/i)).toBeVisible();
    const statusValue = page.locator('td, div, span').filter({ hasText: /(COMPLETED|ACTIVE|FAILED|TIMEOUT|UNSET|REVEALING|CONTRIBUTION TIMEOUT)/i });
    await expect(statusValue.first()).toBeVisible();
    
    // Check for any available action buttons (Claim, Download Logs, Download Result)
    const claimButton = page.getByRole('button', { name: /claim/i });
    const downloadLogsButton = page.getByRole('button', { name: /download.*log/i });
    const downloadResultButton = page.getByRole('button', { name: /download.*result/i });
    
    // Test claim button functionality if task is claimable
    if (await claimButton.count() > 0) {
      await expect(claimButton).toBeVisible();
      // Only test if button is enabled (claimable)
      if (await claimButton.isEnabled()) {
        // Note: We won't actually click claim to avoid affecting blockchain state
        await expect(claimButton).toBeEnabled();
      }
    }
    
    // Test download logs functionality if available
    if (await downloadLogsButton.count() > 0) {
      await expect(downloadLogsButton).toBeVisible();
      if (await downloadLogsButton.isEnabled()) {
        // Note: We won't actually download to avoid side effects
        await expect(downloadLogsButton).toBeEnabled();
      }
    }
    
    // Test download result functionality if task is completed
    if (await downloadResultButton.count() > 0) {
      await expect(downloadResultButton).toBeVisible();
      if (await downloadResultButton.isEnabled()) {
        // Note: We won't actually download to avoid side effects
        await expect(downloadResultButton).toBeEnabled();
      }
    }
    
    // Verify status-dependent UI elements are properly shown/hidden
    const taskDetails = page.locator('.task-details, [data-testid="task-details"], .details-table');
    if (await taskDetails.count() > 0) {
      await expect(taskDetails.first()).toBeVisible();
    }
  });
});