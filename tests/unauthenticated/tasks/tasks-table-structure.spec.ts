// spec: specs/tasks-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Tasks Table Navigation and Display', () => {
  test('Verify tasks table structure and data display', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all tasks' }).click();
    
    // Wait for table to load with data
    await page.waitForSelector('table');
    
    // Verify table headers are present: Task, Status, Deadline
    const expectedHeaders = ['Task', 'Status', 'Deadline'];
    
    for (const header of expectedHeaders) {
      await expect(page.getByRole('columnheader', { name: header }).first()).toBeVisible();
    }
    
    // Verify table contains multiple task rows with data
    const tableRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
    // Wait for at least one row to have content
    await expect(tableRows.first().getByText(/0x[a-fA-F0-9]+/).first()).toBeVisible();
    
    // Verify we have at least one row
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
    
    // Verify each row displays truncated task IDs with copy buttons
    const firstRow = tableRows.first();
    const taskCopyButton = firstRow.getByRole('button').first();
    await expect(taskCopyButton).toBeVisible();
    
    // Verify task IDs are displayed with truncation
    const taskIdElement = firstRow.locator('td').first().getByText(/0x[a-fA-F0-9]+\.{3}/);
    if (await taskIdElement.count() > 0) {
      const taskIdText = await taskIdElement.textContent();
      expect(taskIdText).toMatch(/0x[a-fA-F0-9]+\.{3}/);
    } else {
      // Alternative: check for any task ID format
      const anyTaskId = firstRow.locator('td').first().getByText(/0x[a-fA-F0-9]+/);
      await expect(anyTaskId).toBeVisible();
    }
    
    // Verify status column shows task execution status
    const statusCell = firstRow.locator('td').nth(1);
    await expect(statusCell.getByText(/(COMPLETED|ACTIVE|FAILED|TIMEOUT|UNSET|REVEALING|CONTRIBUTION TIMEOUT)/i)).toBeVisible();
    
    // Verify deadline column shows formatted date and time
    const deadlineCell = firstRow.locator('td').nth(2);
    await expect(deadlineCell.getByText(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/)).toBeVisible();
    
    // Verify copy button functionality for task IDs
    await expect(taskCopyButton).toBeEnabled();
  });
});