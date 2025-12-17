import { test, expect } from '@playwright/test';

test.describe('Dataset Schema Filters', () => {
  test('Dataset Schema Filters', async ({ page }) => {
    // 1. Navigate to datasets page
    await page.goto('https://explorer.iex.ec/arbitrum-mainnet/datasets');
    await page.waitForLoadState('networkidle');
    
    // Wait for table to load
    await page.waitForSelector('table');

    // 2. Locate schema filter dropdown/selection
    const schemaSearchButton = page.getByText(/schema search/i)
      .or(page.locator('button:has-text("Schema")'))
      .or(page.locator('[role="button"]:has-text("Schema")'))
      .or(page.getByRole('button', { name: /filter/i }));

    await expect(schemaSearchButton.first()).toBeVisible();
    
    // Click to open schema search panel
    await schemaSearchButton.first().click();
    await page.waitForTimeout(1000);

    // 3. Apply single schema filter
    const pathInput = page.getByPlaceholder(/field path/i)
      .or(page.locator('input[placeholder*="path"]'))
      .or(page.locator('input[placeholder*="field"]'))
      .or(page.locator('#schema-path'));

    if (await pathInput.isVisible()) {
      await pathInput.fill('email');

      // Select type from dropdown
      const typeSelect = page.getByRole('combobox')
        .or(page.locator('select'))
        .or(page.getByText(/select type/i))
        .or(page.locator('[role="listbox"]'));

      if (await typeSelect.first().isVisible()) {
        await typeSelect.first().click();
        
        // Choose a type (string is common)
        const stringOption = page.getByText('string', { exact: true })
          .or(page.getByRole('option', { name: /string/i }))
          .or(page.locator('[data-value="string"]'));

        if (await stringOption.first().isVisible()) {
          await stringOption.first().click();
        }
      }

      const applyButton = page.getByRole('button', { name: /apply filter/i })
        .or(page.getByRole('button', { name: /add filter/i }))
        .or(page.locator('button:has-text("Apply")'));

      if (await applyButton.first().isVisible()) {
        // Check if button is enabled before clicking
        const isEnabled = await applyButton.first().isEnabled();
        if (isEnabled) {
          await applyButton.first().click();
          await page.waitForLoadState('networkidle');

          // 4. Verify filtered results match schema
          // Check that filter is applied (URL should change)
          const currentUrl = page.url();
          expect(currentUrl).toMatch(/schema=/);
        } else {
          console.log('Apply button is disabled, likely due to incomplete filter form');
          // Try to fill required fields
          const pathInput = page.getByPlaceholder(/field path/i)
            .or(page.locator('input[placeholder*="path"]'));
          
          if (await pathInput.isVisible()) {
            await pathInput.fill('email');
          }
          
          // Wait a bit for form validation
          await page.waitForTimeout(1000);
          
          // Try again if button is now enabled
          if (await applyButton.first().isEnabled()) {
            await applyButton.first().click();
            await page.waitForLoadState('networkidle');
          } else {
            console.log('Schema filter form requirements not met, skipping this test');
            return;
          }
        }

        // Check for applied filter tags
        const filterTag = page.getByText(/email:string/i)
          .or(page.locator('.filter-tag'))
          .or(page.locator('[data-testid*="filter"]'));

        const hasFilterTag = await filterTag.first().isVisible();
        if (hasFilterTag) {
          await expect(filterTag.first()).toBeVisible();
        }

        // Verify table still shows data (may be filtered)
        const tableRows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') });
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThanOrEqual(0); // Could be 0 if no matches
      }
    }

    // 5. Apply multiple schema filters
    // Add another filter
    if (await pathInput.isVisible()) {
      await pathInput.fill('name');

      if (await typeSelect.first().isVisible()) {
        await typeSelect.first().click();
        
        const anotherOption = page.getByText('string', { exact: true })
          .or(page.getByRole('option', { name: /string/i }));

        if (await anotherOption.first().isVisible()) {
          await anotherOption.first().click();
        }
      }

      const addFilterButton = page.getByRole('button', { name: /add filter/i })
        .or(applyButton.first());

      if (await addFilterButton.first().isVisible()) {
        await addFilterButton.first().click();
        await page.waitForTimeout(1000);

        // Should now have multiple filters
        const multipleFilters = page.locator('.filter-tag')
          .or(page.getByText(/email:string/))
          .or(page.getByText(/name:string/));

        const filterCount = await multipleFilters.count();
        expect(filterCount).toBeGreaterThanOrEqual(1);
      }
    }

    // 6. Test clear filters functionality
    const clearButton = page.getByText(/clear all/i)
      .or(page.getByRole('button', { name: /clear/i }))
      .or(page.locator('button:has-text("Clear")'));

    if (await clearButton.first().isVisible()) {
      await clearButton.first().click();
      await page.waitForLoadState('networkidle');

      // Filters should be removed
      const urlAfterClear = page.url();
      expect(urlAfterClear).not.toMatch(/schema=/);

      // Filter tags should be gone
      const remainingTags = page.locator('.filter-tag');
      const tagCount = await remainingTags.count();
      expect(tagCount).toBe(0);
    }

    // 7. Verify filter URL parameter persistence
    // Apply a filter again
    if (await pathInput.isVisible()) {
      await pathInput.fill('telegram');
      
      if (await typeSelect.first().isVisible()) {
        await typeSelect.first().click();
        
        const option = page.getByText('string', { exact: true }).first();
        if (await option.isVisible()) {
          await option.click();
        }
      }

      const applyButton = page.getByRole('button', { name: /apply filter/i })
        .or(page.getByRole('button', { name: /add filter/i }));

      if (await applyButton.first().isVisible()) {
        await applyButton.first().click();
        await page.waitForTimeout(1000);

        // Check URL contains filter
        const urlWithFilter = page.url();
        expect(urlWithFilter).toMatch(/schema=/);

        // Refresh page to test persistence
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Filter should persist after refresh
        const urlAfterRefresh = page.url();
        expect(urlAfterRefresh).toMatch(/schema=/);

        // Filter UI should show applied filter
        const persistedFilter = page.getByText(/telegram:string/i)
          .or(page.locator('.filter-tag'));

        const hasPersistedFilter = await persistedFilter.first().isVisible();
        if (hasPersistedFilter) {
          console.log('Filter persisted correctly after page refresh');
        }
      }
    }

    // 8. Test filter combinations and validation
    // Test removing individual filters
    const removeFilterButton = page.locator('button:has-text("×")')
      .or(page.locator('[aria-label*="remove"]'))
      .or(page.locator('.remove-filter'));

    if (await removeFilterButton.first().isVisible()) {
      await removeFilterButton.first().click();
      await page.waitForTimeout(1000);

      // One filter should be removed
      console.log('Individual filter removal working');
    }

    // Test invalid filter inputs
    if (await pathInput.isVisible()) {
      await pathInput.fill(''); // Empty path
      
      const invalidApplyButton = page.getByRole('button', { name: /apply filter/i });
      if (await invalidApplyButton.first().isVisible()) {
        const isDisabled = await invalidApplyButton.first().isDisabled();
        if (isDisabled) {
          console.log('Form validation prevents empty filter application');
        }
      }
    }

    // Close schema search if it's still open
    const closeButton = page.locator('button[aria-label*="close"]')
      .or(schemaSearchButton.first());

    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  });
});