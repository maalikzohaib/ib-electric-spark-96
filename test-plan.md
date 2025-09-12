# E-commerce Application Test Plan

## 1. Introduction
This test plan outlines the testing approach for the e-commerce application. It includes test scenarios for key features and functionality.

## 2. Test Environment
- Frontend: React with TypeScript
- State Management: Zustand
- UI Library: Custom components with Tailwind CSS
- Backend: Supabase
- Development Server: Vite (http://localhost:8081)

## 3. Test Scenarios

### 3.1 User Navigation and Browsing

#### Home Page
- Verify the home page loads correctly
- Check that featured products are displayed
- Verify navigation links work correctly
- Test responsive design on different screen sizes

#### Product Browsing
- Verify products are displayed in a grid layout
- Test product filtering functionality
- Test product search functionality
- Verify pagination or infinite scroll works correctly

#### Product Details
- Verify product details page displays correct information
- Test image gallery functionality
- Verify "Add to Cart" button works
- Verify "Add to Favorites" button works

### 3.2 Shopping Cart Functionality

#### Adding Products
- Verify products can be added to cart from product listing
- Verify products can be added to cart from product details
- Test adding multiple quantities of the same product

#### Cart Management
- Verify cart icon shows correct item count
- Test updating product quantities in cart
- Test removing products from cart
- Verify cart total is calculated correctly

### 3.3 Favorites Functionality

#### Managing Favorites
- Verify products can be added to favorites
- Verify products can be removed from favorites
- Test favorites icon visibility in header (only shown when favorites exist)
- Verify favorites count is displayed correctly

#### Favorites Page
- Verify favorites page displays all favorited products
- Test "Clear All" functionality
- Verify empty state is displayed when no favorites exist

### 3.4 Admin Functionality

#### Authentication
- Test admin login functionality
- Verify authentication persistence
- Test logout functionality

#### Dashboard
- Verify dashboard displays correct statistics
- Check that recent products are displayed

#### Product Management
- Test adding new products
- Test editing existing products
- Test deleting products
- Verify product list displays correctly

#### Category Management
- Test adding new categories
- Test editing existing categories
- Test deleting categories

#### Page Management
- Test creating new pages
- Test editing existing pages
- Test page hierarchy management

## 4. Test Cases

### TC-001: Verify Product Browsing
1. Navigate to the Shop page
2. Verify products are displayed in a grid
3. Test filtering by category
4. Test sorting options
5. Test search functionality

### TC-002: Verify Product Details
1. Click on a product from the product listing
2. Verify product details are displayed correctly
3. Test image gallery navigation
4. Verify price, description, and other details are correct

### TC-003: Test Add to Cart
1. Navigate to a product detail page
2. Click "Add to Cart"
3. Verify toast notification appears
4. Check that cart icon updates with correct count
5. Navigate to cart page and verify product is added

### TC-004: Test Favorites Functionality
1. Navigate to a product detail page
2. Click heart icon to add to favorites
3. Verify toast notification appears
4. Check that favorites icon appears in header with correct count
5. Navigate to favorites page and verify product is listed
6. Remove product from favorites and verify it's removed
7. Verify favorites icon disappears when all favorites are removed

### TC-005: Test Admin Login
1. Navigate to /admin/login
2. Enter valid credentials
3. Verify redirect to admin dashboard
4. Test invalid login scenarios

### TC-006: Test Admin Product Management
1. Login as admin
2. Navigate to Products section
3. Test adding a new product
4. Test editing an existing product
5. Test deleting a product

## 5. Test Execution

Test execution will be performed manually on the development server. Results will be documented with screenshots and notes on any issues found.

## 6. Defect Reporting

Defects will be documented with the following information:
- Defect ID
- Description
- Steps to reproduce
- Expected result
- Actual result
- Severity
- Screenshots (if applicable)