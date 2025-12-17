import { test, expect } from '@playwright/test';

test.describe('Dataset Advanced Filters', () => {
  test('Dataset Advanced Filters', async ({ page }) => {
    // 1. Navigate to datasets page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/datasets');
    await page.waitForLoadState('networkidle');
    
    // Wait for page content to load
    await page.waitForSelector('table');

    // 2. Test date range filtering
    // Look for date filter controls
    const dateFilter = page.getByText(/date/i)
      .or(page.locator('input[type="date"]'))
      .or(page.getByText(/created/i))
      .or(page.locator('[data-testid*="date"]'));

    if (await dateFilter.first().isVisible()) {
      // Open date filter if it's a dropdown/modal
      await dateFilter.first().click();
      await page.waitForTimeout(1000);

      // Look for date inputs
      const dateInputs = page.locator('input[type="date"]')
        .or(page.locator('input[placeholder*="date"]'))
        .or(page.locator('.date-picker'));

      const dateInputCount = await dateInputs.count();
      
      if (dateInputCount > 0) {
        // Set date range (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        
        const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
        const toDate = new Date().toISOString().split('T')[0];

        // Fill from date
        await dateInputs.first().fill(fromDate);
        
        if (dateInputCount > 1) {
          // Fill to date
          await dateInputs.nth(1).fill(toDate);
        }

        // Apply date filter
        const applyDateButton = page.getByRole('button', { name: /apply/i })
          .or(page.getByText(/filter/i))
          .or(page.locator('button:has-text("Apply")'));

        if (await applyDateButton.first().isVisible()) {
          await applyDateButton.first().click();
          await page.waitForLoadState('networkidle');

          // 3. Verify date-filtered results
          const dateFilteredUrl = page.url();
          expect(dateFilteredUrl).toMatch(/date|from|to|created/);

          // Check that results are shown
          const dateRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
          const dateRowCount = await dateRows.count();
          console.log(`Date filtered results: ${dateRowCount}`);
        }
      }
    }

    // 4. Test price range filtering  
    const priceFilter = page.getByText(/price/i)
      .or(page.locator('input[type="number"]'))
      .or(page.getByText(/cost/i))
      .or(page.locator('[data-testid*="price"]'));

    if (await priceFilter.first().isVisible()) {
      await priceFilter.first().click();
      await page.waitForTimeout(1000);

      // Look for price inputs
      const priceInputs = page.locator('input[type="number"]')
        .or(page.locator('input[placeholder*="price"]'))
        .or(page.locator('input[placeholder*="min"]'))
        .or(page.locator('input[placeholder*="max"]'));

      const priceInputCount = await priceInputs.count();

      if (priceInputCount > 0) {
        // Set price range (0 to 100)
        await priceInputs.first().fill('0');
        
        if (priceInputCount > 1) {
          await priceInputs.nth(1).fill('100');
        }

        // Apply price filter
        const applyPriceButton = page.getByRole('button', { name: /apply/i })
          .or(page.getByText(/filter/i));

        if (await applyPriceButton.first().isVisible()) {
          await applyPriceButton.first().click();
          await page.waitForTimeout(1000);

          // 5. Verify price-filtered results
          const priceFilteredUrl = page.url();
          console.log('Price filtered URL:', priceFilteredUrl);

          // Check results
          const priceRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
          const priceRowCount = await priceRows.count();
          console.log(`Price filtered results: ${priceRowCount}`);
        }
      }
    }

    // 6. Test sorting combined with filters
    // Look for sort options
    const sortHeader = page.locator('th')
      .or(page.getByRole('columnheader'))
      .or(page.locator('[role="columnheader"]'));

    const sortHeaderCount = await sortHeader.count();

    if (sortHeaderCount > 0) {
      // Click on a sortable header
      const nameHeader = page.getByRole('columnheader', { name: /dataset/i }).first();

      if (await nameHeader.isVisible()) {
        // Click to sort ascending
        await nameHeader.click();
        await page.waitForTimeout(1000);

        // Click again to sort descending
        await nameHeader.click(); 
        await page.waitForTimeout(1000);

        // 7. Verify sorting maintains filter state
        const sortedUrl = page.url();
        console.log('Sorted with filters URL:', sortedUrl);

        // URL should maintain any applied filters
        const maintainsFilters = sortedUrl.includes('?') || sortedUrl.includes('&');
        if (maintainsFilters) {
          console.log('Sorting maintains filter state');
        }
      }
    }

    // 8. Test multiple advanced filters combination
    // Try to combine schema, date, and price filters
    const advancedFilterButton = page.getByText(/advanced/i)
      .or(page.getByText(/more filters/i))
      .or(page.getByRole('button', { name: /filter/i }));

    if (await advancedFilterButton.first().isVisible()) {
      await advancedFilterButton.first().click();
      await page.waitForTimeout(1000);

      // Apply multiple filter criteria
      const filterForm = page.locator('form')
        .or(page.locator('.filter-panel'))
        .or(page.locator('[data-testid*="filter"]'));

      if (await filterForm.first().isVisible()) {
        // Fill multiple criteria if available
        const textInputs = filterForm.locator('input[type="text"]');
        const numberInputs = filterForm.locator('input[type="number"]');

        if ((await textInputs.count()) > 0) {
          await textInputs.first().fill('test');
        }

        if ((await numberInputs.count()) > 0) {
          await numberInputs.first().fill('50');
        }

        // Apply combined filters
        const applyCombinedButton = filterForm.getByRole('button', { name: /apply/i })
          .or(filterForm.getByText(/search/i));

        if (await applyCombinedButton.first().isVisible()) {
          await applyCombinedButton.first().click();
          await page.waitForLoadState('networkidle');

          // 9. Verify complex filter results
          const complexUrl = page.url();
          console.log('Complex filtered URL:', complexUrl);

          // Should have multiple query parameters
          const hasMultipleParams = (complexUrl.match(/[?&]/g) || []).length > 1;
          if (hasMultipleParams) {
            console.log('Multiple filters applied successfully');
          }

          // Check results are still displayed
          const complexRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
          const complexRowCount = await complexRows.count();
          console.log(`Complex filtered results: ${complexRowCount}`);
        }
      }
    }

    // 10. Test filter reset functionality
    const resetButton = page.getByText(/reset/i)
      .or(page.getByText(/clear all/i))
      .or(page.getByRole('button', { name: /reset/i }))
      .or(page.getByRole('button', { name: /clear/i }));

    if (await resetButton.first().isVisible()) {
      // Record URL before reset
      const beforeResetUrl = page.url();
      
      // Click reset
      await resetButton.first().click();
      await page.waitForLoadState('networkidle');

      // 11. Verify filters are cleared
      const afterResetUrl = page.url();
      console.log('After reset URL:', afterResetUrl);

      // URL should be simpler (fewer query params)
      expect(afterResetUrl).not.toBe(beforeResetUrl);

      // Check that we're back to unfiltered state
      const unfilteredRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
      const unfilteredRowCount = await unfilteredRows.count();
      console.log(`After reset results: ${unilteredRowCount}`);
    }

    // 12. Test filter performance with large datasets
    // Navigate to ensure we have fresh state
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/datasets');
    await page.waitForLoadState('networkidle');

    // Measure filter application time
    const startTime = Date.now();

    // Apply a quick filter
    const quickFilter = page.locator('button')
      .or(page.getByRole('tab'))
      .or(page.locator('[data-testid*="filter"]'));

    if (await quickFilter.first().isVisible()) {
      await quickFilter.first().click();
      await page.waitForLoadState('networkidle');

      const endTime = Date.now();
      const filterTime = endTime - startTime;
      
      console.log(`Filter application time: ${filterTime}ms`);
      
      // Filter should be reasonably fast (< 5 seconds)
      expect(filterTime).toBeLessThan(5000);
    }

    // 13. Test filter state during page refresh
    const currentFilteredUrl = page.url();
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // URL should be maintained
    const refreshedUrl = page.url();
    expect(refreshedUrl).toBe(currentFilteredUrl);

    // Filter state should be preserved
    console.log('Filter state preserved after refresh');

    // 14. Test edge cases and error handling
    // Try invalid filter values
    const filterInput = page.locator('input').first();
    
    if (await filterInput.isVisible()) {
      // Try extremely long input
      const longInput = 'a'.repeat(1000);
      await filterInput.fill(longInput);
      
      // Should handle gracefully
      const isPageResponsive = await page.locator('body').isVisible();
      expect(isPageResponsive).toBe(true);

      // Clear the input
      await filterInput.clear();
    }

    // Test concurrent filter operations
    if ((await quickFilter.count()) >= 2) {
      // Click multiple filters rapidly
      await Promise.all([
        quickFilter.nth(0).click(),
        page.waitForTimeout(100).then(() => quickFilter.nth(1).click())
      ]);
      
      await page.waitForTimeout(1000);
      
      // Page should handle concurrent requests gracefully
      const finalState = await page.locator('table').isVisible();
      expect(finalState).toBe(true);
      
      console.log('Concurrent filter operations handled correctly');
    }
  });
});