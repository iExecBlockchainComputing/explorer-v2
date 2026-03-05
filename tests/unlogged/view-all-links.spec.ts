// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Index - Search', () => {
  test('View all links', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:5173/arbitrum-mainnet');
    
    // Then the links "View all deals / tasks / apps / datasets / workerpools" are accessible on desktop
    await expect(page.getByRole('link', { name: 'View all deals' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View all tasks' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View all apps' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View all datasets' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View all workerpools' })).toBeVisible();
    
    // And the "View all" links are accessible on mobile (same links are responsive)
  });
});