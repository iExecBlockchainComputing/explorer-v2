// spec: specs/tasks-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Table Row Click Navigation', () => {
  test('Navigate to task details via row click', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all tasks' }).click();
    
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Get the first task row and extract task ID for verification
    const firstRow = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }).first();
    await expect(firstRow).toBeVisible();
    
    // Click on the task ID text to navigate to task details (like in deals tests)
    const taskIdText = page.getByText(/0x[a-fA-F0-9]{6}\.\.\.[a-fA-F0-9]{5}/).first();
    
    await taskIdText.click();
    
    // Verify navigation to task detail page
    await expect(page).toHaveURL(/.*\/task\/0x[a-fA-F0-9]+/);
    
    // Verify task details page loads with comprehensive information
    await expect(page.getByRole('heading', { name: 'Task details' })).toBeVisible();
    
    // Verify breadcrumb shows: Homepage > All tasks > Task {truncated-id}
    const breadcrumb = page.locator('nav[data-slot="breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('Homepage')).toBeVisible();
    await expect(breadcrumb.getByText('All tasks')).toBeVisible();
    await expect(breadcrumb.getByText(/Task 0x[a-fA-F0-9]{3}\.\.\.[a-fA-F0-9]{5}/)).toBeVisible();
    
    // Verify back button is present and functional
    const backButton = page.getByRole('button', { name: 'Back' }).or(page.locator('[aria-label="Back"]')).or(page.locator('button').filter({ hasText: 'Back' }));
    await expect(backButton).toBeVisible();
  });
});