// spec: specs/tasks-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task Details Page Functionality', () => {
  test('Explore task details tabs and information', async ({ page }) => {
    // Navigate to a task detail page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all tasks' }).click();
    await page.waitForSelector('table');
    
    // Click on first task row to navigate to details (like deals test)
    const firstRow = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }).first();
    const taskIdCell = firstRow.getByRole('cell').first();
    // Click on the text content of the task ID, not the copy button
    const taskIdText = taskIdCell.getByText(/0x[a-fA-F0-9]+/);
    await taskIdText.click();
    
    // Wait for task details page to load
    await page.waitForSelector('table');
    
    // Verify DETAILS tab/button is visible (like in deals)
    const detailsTab = page.getByRole('button', { name: 'DETAILS' });
    await expect(detailsTab).toBeVisible();
    
    // Verify comprehensive task information is displayed
    const taskInfoItems = [
      'Taskid',
      'Dealid', 
      'Category',
      'Status',
      'App',
      'Dataset',
      'Workerpool'
    ];
    
    for (const item of taskInfoItems) {
      await expect(page.getByText(item).first()).toBeVisible();
    }

    // Click on DATASETS tab if available (might be disabled like in navbar pattern)
    const datasetsTab = page.getByRole('button', { name: 'DATASETS' });
    if (await datasetsTab.isVisible() && await datasetsTab.isEnabled()) {
      await datasetsTab.click();
      
      // Verify datasets table displays if enabled
      await expect(page.locator('main table')).toBeVisible();
      
      // Check for pagination if present
      const pagination = page.locator('[role="navigation"]').filter({ hasText: /Previous|Next|\d+/ });
      if (await pagination.count() > 0) {
        await expect(pagination).toBeVisible();
      }
    }
    
    // Click on RAW DATA tab
    const rawDataTab = page.getByRole('button', { name: 'RAW DATA' });
    await rawDataTab.click();
    
    // Verify connection requirement message or raw data is displayed (like navbar login pattern)
    const connectionMessage = page.getByText(/You are not connected|To access task raw data/);
    const jsonContent = page.locator('pre, code, .json').filter({ hasText: /{.*}/ });
    
    // Either we see connection message or JSON data
    const hasConnectionMessage = await connectionMessage.count() > 0;
    const hasJsonData = await jsonContent.count() > 0;
    
    if (hasConnectionMessage) {
      await expect(page.getByRole('heading', { name: 'You are not connected' })).toBeVisible();
      // Look for connect wallet button (like in navbar) - use first visible one
      const connectButton = page.getByRole('button', { name: /connect wallet/i }).first();
      await expect(connectButton).toBeVisible();
    } else if (hasJsonData) {
      await expect(jsonContent.first()).toBeVisible();
    }
    
    // Test data refresh and error handling for raw data
    await expect(page.getByText(/\{|\[/).first()).toBeVisible();
  });
});