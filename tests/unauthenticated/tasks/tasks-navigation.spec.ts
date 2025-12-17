// spec: specs/tasks-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Tasks Table Navigation and Display', () => {
  test('Navigate to tasks page from homepage', async ({ page }) => {
    // Navigate to the iExec explorer homepage
    await page.goto('https://explorer.iex.ec');
    
    // Verify the 'Latest tasks' section is visible
    await expect(page.getByRole('heading', { name: 'Latest tasks' })).toBeVisible();
    
    // Click on 'View all tasks' link
    await page.getByRole('link', { name: 'View all tasks' }).click();
    
    // Verify navigation to tasks page with correct URL
    await expect(page).toHaveURL(/.*\/tasks$/);
    
    // Verify tasks page header displays 'Tasks' with task icon
    await expect(page.getByRole('heading', { name: /Tasks/ })).toBeVisible();
    
    // Verify breadcrumb navigation shows: Homepage > All tasks
    const breadcrumb = page.locator('[role="navigation"][aria-label="breadcrumb"], nav')
      .filter({ has: page.locator('text=Homepage') });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('All tasks')).toBeVisible();
  });
});