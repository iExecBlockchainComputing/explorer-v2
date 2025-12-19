# iExec Blockchain Explorer - Deals Page Test Plan

## Application Overview

This test plan covers comprehensive testing of the iExec blockchain explorer deals page functionality, including table interactions, copy operations, row navigation, pagination, and deal detail page features. The deals page is a core feature that allows users to browse, search, and inspect blockchain deals with detailed information about applications, workerpools, datasets, pricing, and execution status.

## Test Scenarios

### 1. Deals Table Navigation and Display

**Seed:** `tests/seed.spec.ts`

#### 1.1. Navigate to deals page from homepage

**File:** `tests/deals/deals-navigation.spec.ts`

**Steps:**
  1. Navigate to the iExec explorer homepage
  2. Verify the 'Latest deals' section is visible
  3. Click on 'View all deals' link
  4. Verify navigation to deals page with correct URL (/arbitrum-mainnet/deals)
  5. Verify deals page header displays 'Deals' with deal icon
  6. Verify breadcrumb navigation shows: Homepage > All deals

**Expected Results:**
  - Homepage loads successfully with deals preview section
  - Deals page loads with correct URL and page structure
  - Page header displays properly with navigation elements
  - Breadcrumb navigation functions correctly

#### 1.2. Verify deals table structure and data display

**File:** `tests/deals/deals-table-structure.spec.ts`

**Steps:**
  1. Navigate to deals page
  2. Verify table headers are present: Deal, App, Workerpool, Dataset, Time, Success, Price
  3. Verify table contains multiple deal rows with data
  4. Verify each row displays truncated addresses
  5. Verify time column shows relative time (e.g., '14h ago')
  6. Verify success column shows percentage (e.g., '100%')
  7. Verify price column shows amount with RLC token symbol
  8. Verify dataset column can show 'Datasets bulk' or specific addresses

**Expected Results:**
  - All column headers are present and correctly labeled
  - Table data loads and displays properly formatted content
  - Addresses are truncated with ellipsis
  - Time, success rate, and pricing information display correctly
  - Special dataset handling works for bulk datasets

### 2. Table Row Click Navigation

**Seed:** `tests/seed.spec.ts`

#### 2.1. Navigate to deal details via row click

**File:** `tests/deals/row-navigation.spec.ts`

**Steps:**
  1. Navigate to deals page
  2. Click on a non-interactive area of a table row (e.g., time cell)
  3. Verify navigation to deal detail page
  4. Verify URL contains deal ID: /arbitrum-mainnet/deal/{dealId}
  5. Verify deal details page loads with comprehensive information
  6. Verify breadcrumb shows: Homepage > All deals > Deal {truncated-id}
  7. Verify back button is present and functional

**Expected Results:**
  - Row clicks navigate to correct deal detail page
  - Deal detail URL is properly formatted with deal ID
  - Detail page loads complete deal information
  - Navigation breadcrumbs work correctly
  - Back button returns to deals list

### 3. Deal Details Page Functionality

**Seed:** `tests/seed.spec.ts`

#### 3.1. Explore deal details tabs and information

**File:** `tests/deals/deal-details.spec.ts`

**Steps:**
  1. Navigate to a deal detail page
  2. Verify DETAILS tab is active by default
  3. Verify comprehensive deal information is displayed (dealId, category, app, dataset, workerpool, prices, status, etc.)
  4. Click on TASKS tab
  6. Verify tasks table displays with columns: Index, Task, Status, Deadline
  7. Verify task rows show task IDs
  8. Click on ASSOCIATED DEALS tab if available
  8. Verify associated deals information displays

**Expected Results:**
  - All tabs are functional and display appropriate content
  - Deal details show comprehensive blockchain information
  - Tasks tab displays related task execution information
  - Tab navigation maintains proper state

### 4. Pagination Testing

**Seed:** `tests/seed.spec.ts`

#### 4.1. Test pagination controls and navigation

**File:** `tests/deals/pagination.spec.ts`

**Steps:**
  1. Navigate to deals page
  2. Verify pagination controls are present at bottom
  3. Note the current page (should be page 1)
  4. Click on page 2
  5. Verify URL updates with ?dealsPage=2 parameter
  6. Verify different deal data loads on page 2
  7. Click on page 3
  8. Verify URL updates and new data loads
  9. Click 'Previous' button to go back
  10. Click 'Next' button to advance
  11. Verify navigation works in both directions

**Expected Results:**
  - Pagination controls display and function correctly
  - URL parameters update to reflect current page
  - Different data loads for each page
  - Previous/Next buttons work appropriately
  - Page state is maintained correctly

### 5. Search and Filtering

**Seed:** `tests/seed.spec.ts`

#### 5.1. Test search functionality

**File:** `tests/deals/search-functionality.spec.ts`

**Steps:**
  1. Navigate to deals page
  2. Locate search bar at top of page
  3. Enter a deal ID in search box
  4. Verify search functionality (if applicable)
  5. Test search with different terms like addresses
  6. Verify search results or behavior

**Expected Results:**
  - Search bar is present and functional
  - Search functionality works as expected
  - Search results are accurate and relevant
  - Search clears appropriately

### 6. Responsive Design and Accessibility

**Seed:** `tests/seed.spec.ts`

#### 6.1. Test responsive behavior and accessibility

**File:** `tests/deals/responsive-accessibility.spec.ts`

**Steps:**
  1. Navigate to deals page on desktop viewport
  2. Verify table displays properly
  3. Resize to mobile viewport
  4. Verify table remains functional and readable
  5. Test keyboard navigation through table rows
  6. Verify tab order and focus management
  7. Test with screen reader compatibility

**Expected Results:**
  - Page adapts correctly to different screen sizes
  - Table remains usable on mobile devices
  - Keyboard navigation works properly
  - Accessibility standards are met
  - Focus indicators are visible and logical
