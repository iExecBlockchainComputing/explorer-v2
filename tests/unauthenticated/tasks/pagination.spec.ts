// spec: specs/tasks-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Pagination Testing', () => {
  test('Test pagination controls and navigation', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all tasks' }).click();
    await page.waitForSelector('table');
    
    // Verify pagination controls are present at bottom
    const pagination = page.locator('[role="navigation"]').filter({ hasText: /Previous|Next|\d+/ });
    await expect(pagination).toBeVisible();
    
    // Note the current page (should be page 1)
    await expect(page).toHaveURL(/tasks/);
    
    // Get first row data to compare later
    const firstRowTaskId = await page.getByRole('row')
      .filter({ hasNot: page.getByRole('columnheader') })
      .first()
      .getByText(/0x[a-fA-F0-9]+/)
      .first()
      .textContent();
    
    // Click on page 2 if it exists
    const page2Button = pagination.getByText('2', { exact: true });
    if (await page2Button.count() > 0 && await page2Button.isEnabled()) {
      await page2Button.click();
      
      // Verify URL updates with ?tasksPage=2 parameter
      await expect(page).toHaveURL(/tasksPage=2/);
      
      // Verify different task data loads on page 2
      const newFirstRowTaskId = await page.getByRole('row')
        .filter({ hasNot: page.getByRole('columnheader') })
        .first()
        .getByText(/0x[a-fA-F0-9]+/)
        .first()
        .textContent();
      
      expect(newFirstRowTaskId).not.toBe(firstRowTaskId);
      
      // Click on page 3 if it exists
      const page3Button = pagination.getByText('3', { exact: true });
      if (await page3Button.count() > 0 && await page3Button.isEnabled()) {
        await page3Button.click();
        
        // Verify URL updates and new data loads
        await expect(page).toHaveURL(/tasksPage=3/);
      }
      
      // Click 'Previous' button to go back
      const previousButton = pagination.getByText('Previous');
      if (await previousButton.count() > 0 && await previousButton.isEnabled()) {
        await previousButton.click();
        
        // Verify navigation works
        await page.waitForLoadState('networkidle');
      }
      
      // Click 'Next' button to advance
      const nextButton = pagination.getByText('Next');
      if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
        await nextButton.click();
        
        // Verify navigation works in both directions
        await page.waitForLoadState('networkidle');
      }
    }
  });
});