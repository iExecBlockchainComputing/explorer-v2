import { test, expect } from '@playwright/test';

test.describe('Deal Details Page Functionality', () => {
  test('Explore deal details tabs and information', async ({ page }) => {
    // Navigate to a deal detail page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all deals' }).click();
    await page.waitForSelector('table');
    
    // Click on first deal row to navigate to details
    const firstRow = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }).first();
    const dealIdCell = firstRow.getByRole('cell').first();
    // Click on the text content of the deal ID, not the copy button
    const dealIdText = dealIdCell.getByText(/0x[a-fA-F0-9]+/);
    await dealIdText.click();
    
    // Wait for deal details page to load
    await page.waitForSelector('table');
    
    // Verify DETAILS tab is active by default
    const detailsTab = page.getByRole('button', { name: 'DETAILS' });
    await expect(detailsTab).toBeVisible();
    
    // Verify comprehensive deal information is displayed
    const dealInfoItems = [
      'Dealid',
      'Category',
      'Dataset',
      'Workerpool',
      'Status'
    ];
    
    for (const item of dealInfoItems) {
      await expect(page.getByText(item).first()).toBeVisible();
    }
    
    // Check for App specifically in the table rows
    await expect(page.getByRole('cell', { name: 'App', exact: true })).toBeVisible();
    
    // Click on TASKS tab
    const tasksTab = page.getByRole('button', { name: 'TASKS' });
    await tasksTab.click();
    
    // Verify tasks table displays with expected columns
    const taskHeaders = ['Index', 'Task', 'Status', 'Deadline'];
    
    for (const header of taskHeaders) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }
    
    // Verify task rows show task IDs with copy buttons
    const taskRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    const firstTaskRow = taskRows.first();
    
    if (await firstTaskRow.isVisible()) {
      await expect(firstTaskRow.getByRole('button')).toBeVisible(); // Copy button for task ID
    }
    
    // Click on ASSOCIATED DEALS tab if available
    const associatedDealsTab = page.getByRole('button', { name: 'ASSOCIATED DEALS' });
    
    if (await associatedDealsTab.isVisible()) {
      await associatedDealsTab.click();
      // Verify content is displayed (more specific selector)
      await expect(page.locator('main table')).toBeVisible();
    }
  });
});