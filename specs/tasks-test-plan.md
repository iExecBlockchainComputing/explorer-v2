# iExec Blockchain Explorer - Tasks Page Test Plan

## Application Overview

This test plan covers comprehensive testing of the iExec blockchain explorer tasks page functionality, including table interactions, copy operations, row navigation, pagination, and task detail page features. The tasks page is a core feature that allows users to browse, search, and inspect blockchain tasks with detailed information about task status, deadlines, datasets, raw data, and execution information.

## Test Scenarios

### 1. Tasks Table Navigation and Display

**Seed:** `tests/seed.spec.ts`

#### 1.1. Navigate to tasks page from homepage

**File:** `tests/tasks/tasks-navigation.spec.ts`

**Steps:**
  1. Navigate to the iExec explorer homepage
  2. Verify the 'Latest tasks' section is visible
  3. Click on 'View all tasks' link
  4. Verify navigation to tasks page with correct URL (/arbitrum-mainnet/tasks)
  5. Verify tasks page header displays 'Tasks' with task icon
  6. Verify breadcrumb navigation shows: Homepage > All tasks

**Expected Results:**
  - Homepage loads successfully with tasks preview section
  - Tasks page loads with correct URL and page structure
  - Page header displays properly with navigation elements
  - Breadcrumb navigation functions correctly

#### 1.2. Verify tasks table structure and data display

**File:** `tests/tasks/tasks-table-structure.spec.ts`

**Steps:**
  1. Navigate to tasks page
  2. Verify table headers are present: Task, Status, Deadline
  3. Verify table contains multiple task rows with data
  4. Verify each row displays truncated task IDs with copy buttons
  5. Verify status column shows task execution status (e.g., 'COMPLETED', 'ACTIVE', 'FAILED')
  6. Verify deadline column shows formatted date and time
  7. Verify task IDs are displayed with truncation (8 characters visible)
  8. Verify copy button functionality for task IDs

**Expected Results:**
  - All column headers are present and correctly labeled
  - Table data loads and displays properly formatted content
  - Task IDs are truncated appropriately with functional copy buttons
  - Status information displays with proper formatting
  - Deadline information shows readable date and time format

### 2. Table Row Click Navigation

**Seed:** `tests/seed.spec.ts`

#### 2.1. Navigate to task details via row click

**File:** `tests/tasks/row-navigation.spec.ts`

**Steps:**
  1. Navigate to tasks page
  2. Click on a non-interactive area of a table row (e.g., deadline cell)
  3. Verify navigation to task detail page
  4. Verify URL contains task ID: /arbitrum-mainnet/task/{taskId}
  5. Verify task details page loads with comprehensive information
  6. Verify breadcrumb shows: Homepage > All tasks > Task {truncated-id}
  7. Verify back button is present and functional

**Expected Results:**
  - Row clicks navigate to correct task detail page
  - Task detail URL is properly formatted with task ID
  - Detail page loads complete task information
  - Navigation breadcrumbs work correctly
  - Back button returns to tasks list

### 3. Task Details Page Functionality

**Seed:** `tests/seed.spec.ts`

#### 3.1. Explore task details tabs and information

**File:** `tests/tasks/task-details.spec.ts`

**Steps:**
  1. Navigate to a task detail page
  2. Verify DETAILS tab is active by default
  3. Verify comprehensive task information is displayed (taskId, dealId, category, app, dataset, workerpool, requester, status, deadline, etc.)
  4. Verify task ID display with copy functionality
  5. Verify deal ID links to related deal page
  6. Click on DATASETS tab if available
  7. Verify datasets table displays with proper columns and pagination
  8. Click on RAW DATA tab
  9. Verify raw task data is displayed in JSON format
  10. Test data refresh and error handling for raw data

**Expected Results:**
  - All tabs are functional and display appropriate content
  - Task details show comprehensive blockchain information
  - Datasets tab displays related dataset information when available
  - Raw data tab shows technical task execution details
  - Tab navigation maintains proper state
  - Links and copy buttons function correctly

### 4. Pagination Testing

**Seed:** `tests/seed.spec.ts`

#### 4.1. Test pagination controls and navigation

**File:** `tests/tasks/pagination.spec.ts`

**Steps:**
  1. Navigate to tasks page
  2. Verify pagination controls are present at bottom
  3. Note the current page (should be page 1)
  4. Click on page 2
  5. Verify URL updates with ?tasksPage=2 parameter
  6. Verify different task data loads on page 2
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

**File:** `tests/tasks/search-functionality.spec.ts`

**Steps:**
  1. Navigate to tasks page
  2. Locate search bar at top of page
  3. Enter a task ID in search box
  4. Verify search functionality behavior
  5. Test search with different terms like addresses
  6. Test search with partial task IDs
  7. Verify search results or appropriate feedback

**Expected Results:**
  - Search bar is present and functional
  - Search functionality works as expected
  - Search results are accurate and relevant
  - Search handles different input types appropriately

### 6. Task Status and Actions

**Seed:** `tests/seed.spec.ts`

#### 6.1. Test task status display and user actions

**File:** `tests/tasks/task-status-actions.spec.ts`

**Steps:**
  1. Navigate to a task detail page
  2. Verify task status is clearly displayed
  3. Check for any available action buttons (Claim, Download Logs, Download Result)
  4. Test claim button functionality if task is claimable
  5. Test download logs functionality if available
  6. Test download result functionality if task is completed
  7. Verify status-dependent UI elements are properly shown/hidden

**Expected Results:**
  - Task status is clearly visible and accurately displayed
  - Action buttons appear based on task status and user permissions
  - Claim functionality works for eligible tasks
  - Download actions function correctly when available
  - UI adapts properly to different task states

### 7. Task Events and Raw Data

**Seed:** `tests/seed.spec.ts`

#### 7.1. Test task events and raw data display

**File:** `tests/tasks/task-events-rawdata.spec.ts`

**Steps:**
  1. Navigate to a task detail page
  2. Verify task events are displayed in the details section
  3. Click on RAW DATA tab
  4. Verify raw data loads and displays in JSON format
  5. Test data formatting and readability
  6. Verify error handling for unavailable raw data
  7. Test refresh functionality for raw data

**Expected Results:**
  - Task events display chronologically with proper formatting
  - Raw data tab loads successfully
  - JSON data is properly formatted and readable
  - Error states are handled gracefully
  - Data refresh works correctly

### 8. Responsive Design and Accessibility

**Seed:** `tests/seed.spec.ts`

#### 8.1. Test responsive behavior and accessibility

**File:** `tests/tasks/responsive-accessibility.spec.ts`

**Steps:**
  1. Navigate to tasks page on desktop viewport
  2. Verify table displays properly with all columns
  3. Resize to mobile viewport
  4. Verify table remains functional and readable
  5. Test keyboard navigation through table rows
  6. Verify tab order and focus management
  7. Test with screen reader compatibility
  8. Verify mobile-specific UI adaptations (e.g., truncated content display)

**Expected Results:**
  - Page adapts correctly to different screen sizes
  - Table remains usable on mobile devices
  - Keyboard navigation works properly
  - Accessibility standards are met
  - Focus indicators are visible and logical
  - Mobile UI shows appropriate content truncation
