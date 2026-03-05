// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Index', () => {
  test('Display of main tables on homepage', async ({ page }) => {
    // Given the user navigates to the homepage
    await page.goto('http://localhost:5173/arbitrum-mainnet');
    
    // Then 5 tables are displayed
    await expect(page.getByText('Latest deals')).toBeVisible();
    await expect(page.getByText('Latest tasks')).toBeVisible();
    await expect(page.getByText('Most pertinent apps')).toBeVisible();
    await expect(page.getByText('Latest datasets deployed')).toBeVisible();
    await expect(page.getByText('Most pertinent workerpools')).toBeVisible();
    
    // And the Deals table contains all expected columns
    await expect(page.getByRole('columnheader', { name: 'Deal' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'App' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Workerpool' }).first()).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Dataset' }).first()).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Time' }).first()).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Success' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
    
    // And the Tasks table contains all expected columns
    await expect(page.getByRole('columnheader', { name: 'Task' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Deadline' })).toBeVisible();
    
    // And the Apps table contains all expected columns
    await expect(page.getByRole('columnheader', { name: 'Address' }).first()).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' }).first()).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Owner' }).first()).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'TxHash' }).first()).toBeVisible();
    
    // And the Datasets table contains all expected columns
    await expect(page.getByRole('columnheader', { name: 'Dataset' }).first()).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Type' })).toBeVisible();
    
    // And the Workerpools table contains all expected columns
    await expect(page.getByRole('columnheader', { name: 'Workerpool' }).nth(1)).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Description' })).toBeVisible();
  });
});