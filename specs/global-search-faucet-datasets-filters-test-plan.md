# Global Search, Faucet & Dataset Filters Test Plan

## Application Overview

Comprehensive test plan for three major features: Global Search functionality (addresses, IDs, Enter key, mobile search), Faucet functionality (authentication, network requirements, claiming process), and Dataset Filters (schema filters, type filters, advanced filtering). Tests follow existing project structure with authenticated/unauthenticated separation and comprehensive coverage across all browsers and device types.

## Test Scenarios

### 1. Global Search Functionality

**Seed:** `tests/seed.spec.ts`

#### 1.1. Global Search from Homepage and Navbar

**File:** `tests/unauthenticated/global/search-global-functionality.spec.ts`

**Steps:**
  1. Navigate to homepage
  2. Locate global search box in navbar
  3. Test search with full addresses (0x...)
  4. Test search with partial addresses (first 6-10 chars)
  5. Test search with deal IDs, task IDs, transaction hashes
  6. Test search with app names, dataset names
  7. Verify search results redirect to correct entity pages
  8. Test search navigation from different pages (deals, tasks, apps, etc.)

**Expected Results:**
  - Search box is visible and functional across all pages
  - Full addresses redirect to correct address details page
  - Partial addresses show matching results or redirect appropriately
  - Entity IDs redirect to corresponding detail pages
  - Invalid searches show appropriate 'no results' messaging
  - Search maintains context when navigating between pages

#### 1.2. Enter Key Search Behavior

**File:** `tests/unauthenticated/global/search-enter-key-functionality.spec.ts`

**Steps:**
  1. Navigate to homepage
  2. Focus on search input box
  3. Enter valid search term
  4. Press Enter key
  5. Verify search execution and navigation
  6. Test Enter key from different starting pages
  7. Test Enter key with various screen sizes

**Expected Results:**
  - Enter key triggers search execution
  - Search navigates to correct results page
  - Enter key behavior is consistent across all pages
  - Enter key works properly on mobile and desktop viewports

#### 1.3. Mobile Search Button and Touch Interactions

**File:** `tests/unauthenticated/global/search-mobile-functionality.spec.ts`

**Steps:**
  1. Set mobile viewport (375x667)
  2. Navigate to homepage
  3. Locate mobile search button/icon
  4. Test touch/tap interactions
  5. Enter search term using virtual keyboard
  6. Test mobile search overlay/dropdown behavior
  7. Verify mobile-specific search UI elements

**Expected Results:**
  - Mobile search button is visible and accessible
  - Touch interactions work properly
  - Virtual keyboard appears and functions correctly
  - Search overlay/dropdown adapts to mobile screen
  - Search results are properly formatted for mobile

#### 1.4. Search Results and Navigation

**File:** `tests/unauthenticated/global/search-results-navigation.spec.ts`

**Steps:**
  1. Test search redirection to entity details pages
  2. Test search with invalid/non-existent queries
  3. Verify 'no results found' messaging
  4. Test search suggestions/autocomplete if available
  5. Test search history functionality if available
  6. Test search URL parameter handling

**Expected Results:**
  - Valid searches redirect to correct entity pages
  - Invalid searches show appropriate error messages
  - Search suggestions improve user experience
  - Search state is preserved in URL parameters
  - Navigation back/forward works with search results

### 2. Faucet Functionality

**Seed:** `tests/seed.spec.ts`

#### 2.1. Faucet Access and Navigation

**File:** `tests/authenticated/account/faucet-access-and-navigation.spec.ts`

**Steps:**
  1. Navigate to homepage
  2. Click 'Faucet' link in navbar
  3. Verify navigation to account page with faucet tab
  4. Test direct navigation to /account?accountTab=Faucet
  5. Verify faucet page layout and content
  6. Test breadcrumb navigation

**Expected Results:**
  - Faucet link is visible in navbar
  - Faucet navigation works from all pages
  - Account page loads with faucet tab active
  - Faucet page displays proper heading and layout
  - Breadcrumb navigation functions correctly

#### 2.2. Faucet Authentication Requirements

**File:** `tests/authenticated/account/faucet-authentication.spec.ts`

**Steps:**
  1. Navigate to faucet page without authentication
  2. Verify GitHub sign-in prompt is displayed
  3. Test authentication flow (if mockable)
  4. Verify authenticated user sees faucet form
  5. Test redirect behavior after authentication

**Expected Results:**
  - Unauthenticated users see sign-in prompt
  - GitHub OAuth integration works properly
  - Authenticated users can access faucet functionality
  - Post-authentication redirect maintains faucet context

#### 2.3. Faucet Network Requirements

**File:** `tests/authenticated/account/faucet-network-requirements.spec.ts`

**Steps:**
  1. Navigate to faucet on wrong network
  2. Verify 'Switch to Arbitrum Sepolia' message
  3. Test network switch button functionality
  4. Connect to Arbitrum Sepolia network
  5. Verify faucet functionality is enabled
  6. Test network detection and validation

**Expected Results:**
  - Wrong network shows appropriate warning message
  - Network switch button triggers wallet network change
  - Correct network enables all faucet features
  - Network changes are detected and UI updates accordingly

#### 2.4. Faucet Claiming Process

**File:** `tests/authenticated/account/faucet-claiming-process.spec.ts`

**Steps:**
  1. Navigate to faucet with proper authentication and network
  2. Test address input validation
  3. Verify pre-filled address when wallet connected
  4. Enter valid address and click claim button
  5. Verify loading states and progress indicators
  6. Test success/error message display
  7. Test rate limiting scenarios
  8. Verify transaction confirmation flow

**Expected Results:**
  - Address validation works for valid/invalid inputs
  - Connected wallet address auto-fills correctly
  - Claim button triggers proper API calls
  - Loading states provide clear user feedback
  - Success messages show transaction details
  - Error handling provides helpful messages
  - Rate limiting is clearly communicated

#### 2.5. Faucet Responsive Design and Accessibility

**File:** `tests/authenticated/account/faucet-responsive-accessibility.spec.ts`

**Steps:**
  1. Test faucet page on mobile viewport (375x667)
  2. Test faucet page on tablet viewport (768x1024)
  3. Test keyboard navigation through faucet form
  4. Test screen reader compatibility
  5. Test form validation accessibility
  6. Verify proper ARIA labels and roles

**Expected Results:**
  - Faucet layout adapts properly to mobile screens
  - All interactive elements are keyboard accessible
  - Screen readers can navigate and understand the form
  - Form validation messages are accessible
  - ARIA attributes provide proper semantic information

### 3. Dataset Filters

**Seed:** `tests/seed.spec.ts`

#### 3.1. Dataset Schema Filters

**File:** `tests/unauthenticated/datasets/datasets-schema-filters.spec.ts`

**Steps:**
  1. Navigate to datasets page
  2. Locate schema filter dropdown/selection
  3. Apply single schema filter
  4. Verify filtered results match schema
  5. Apply multiple schema filters
  6. Test filter combinations
  7. Test clear filters functionality
  8. Verify filter URL parameter persistence

**Expected Results:**
  - Schema filter options are displayed correctly
  - Single filters reduce dataset results appropriately
  - Multiple filters work with AND/OR logic as expected
  - Clear filters resets to full dataset list
  - Filter state persists in URL and on page refresh

#### 3.2. Dataset Type Filters

**File:** `tests/unauthenticated/datasets/datasets-type-filters.spec.ts`

**Steps:**
  1. Navigate to datasets page
  2. Identify available dataset type filters
  3. Filter by single dataset type
  4. Verify results show only selected type
  5. Combine type and schema filters
  6. Test filter result validation
  7. Test filter state preservation across navigation

**Expected Results:**
  - Type filter options reflect available dataset types
  - Type filtering shows accurate results
  - Combined filters work correctly together
  - Filter validation prevents invalid combinations
  - Filter state maintained when navigating back

#### 3.3. Advanced Dataset Filtering

**File:** `tests/unauthenticated/datasets/datasets-advanced-filters.spec.ts`

**Steps:**
  1. Navigate to datasets page
  2. Test date range filtering if available
  3. Test owner address filtering
  4. Test sort order changes (timestamp, name, etc.)
  5. Test filter combinations and interactions
  6. Test complex filter scenarios

**Expected Results:**
  - Date range filters work with proper calendar UI
  - Owner filters accept and validate addresses
  - Sort order changes update results immediately
  - Complex filter combinations produce expected results
  - Advanced filters integrate well with basic filters

#### 3.4. Dataset Filter Performance and Edge Cases

**File:** `tests/unauthenticated/datasets/datasets-filter-performance.spec.ts`

**Steps:**
  1. Test filtering with large dataset volumes
  2. Test filters that return no results
  3. Test invalid filter parameters
  4. Test filter reset functionality
  5. Test filter state during pagination
  6. Test filter performance under load

**Expected Results:**
  - Large dataset filtering completes in reasonable time
  - No results scenario shows appropriate messaging
  - Invalid parameters are handled gracefully
  - Filter reset returns to unfiltered state
  - Pagination preserves filter state
  - Filter performance meets usability standards

#### 3.5. Dataset Filter Responsive Behavior

**File:** `tests/unauthenticated/datasets/datasets-filter-responsive.spec.ts`

**Steps:**
  1. Test filter UI on mobile viewport (375x667)
  2. Test filter panel collapse/expand behavior
  3. Test touch interactions with filter controls
  4. Test filter accessibility on small screens
  5. Test mobile-specific filter UI elements

**Expected Results:**
  - Filter UI adapts appropriately to mobile screens
  - Collapsible filter panels work smoothly
  - Touch interactions are responsive and accurate
  - Small screen filter UI remains usable
  - Mobile filter experience matches desktop functionality
