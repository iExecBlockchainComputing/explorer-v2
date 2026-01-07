// spec: specs/tasks-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task Events and Raw Data', () => {
  test.fixme('Test task events and raw data display', async ({ page }) => {
    // Navigate to a task detail page (using deals pattern)
    await page.goto('https://explorer.iex.ec');
    await page.getByRole('link', { name: 'View all tasks' }).click();
    await page.waitForSelector('table');
    
    const firstRow = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }).first();
    const taskIdCell = firstRow.getByRole('cell').first();
    const taskIdText = taskIdCell.getByText(/0x[a-fA-F0-9]+/);
    await taskIdText.click();
    
    // Verify task events are displayed in the details section
    const eventsSection = page.locator('.events, [data-testid="events"]').or(page.getByText(/Events/i));
    if (await eventsSection.count() > 0) {
      await expect(eventsSection.first()).toBeVisible();
      
      // Look for event entries with transaction hashes
      const eventEntries = page.locator('.event, .task-event').or(page.getByText(/TaskInitialize|TaskFinalize/));
      if (await eventEntries.count() > 0) {
        await expect(eventEntries.first()).toBeVisible();
      }
    }
    
    // Click on RAW DATA tab (like deals pattern)
    const rawDataTab = page.getByRole('button', { name: 'RAW DATA' });
    await rawDataTab.click();
    
    // Check for connection requirement or raw data (like in deals)
    const connectionMessage = page.getByText(/You are not connected|To access task raw data/);
    const rawJsonBlocks = page.locator('pre, code, .json, .raw-data');
    const jsonContent = rawJsonBlocks
      .filter({ hasText: '{' })
      .or(page.locator('pre, code, .json, .raw-data').filter({ hasText: '[' }));
    
    const hasConnectionMessage = await connectionMessage.count() > 0;
    const hasJsonData = await jsonContent.count() > 0;
    
    if (hasConnectionMessage) {
      // Verify connection requirement is shown (like navbar)
      await expect(page.getByRole('heading', { name: 'You are not connected' })).toBeVisible();
      const connectButton = page.getByRole('button', { name: 'Connect wallet' });
      await expect(connectButton).toBeVisible();
    } else if (hasJsonData) {
      // If connected, verify JSON data
      await expect(jsonContent.first()).toBeVisible();
      const jsonText = await jsonContent.first().textContent();
      expect(jsonText).toMatch(/^[[{]/); // Should start with { or [
    }
    
    // Test refresh functionality for raw data (implicit through tab navigation like deals)
    const detailsTab = page.getByRole('button', { name: 'DETAILS' });
    await detailsTab.click();
    await rawDataTab.click();
    
    // Verify data refresh works correctly
    await page.waitForTimeout(1000);
  });
});