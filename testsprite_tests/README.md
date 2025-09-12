# TestSprite Tests for Electric Spark E-commerce

This directory contains automated tests for the Electric Spark e-commerce application using TestSprite.

## Test Files

- `main_test.js` - Main test suite that runs all tests
- `product_browsing_test.js` - Tests for product browsing functionality
- `product_details_test.js` - Tests for product details page
- `cart_test.js` - Tests for shopping cart functionality
- `favorites_test.js` - Tests for favorites functionality
- `product_component_test.js` - Tests for ProductCard component and productStore functionality

## Running Tests

To run the tests, make sure the application is running on http://localhost:8081 (or update the URLs in the test files if using a different port).

```bash
# Start the application (in a separate terminal)
npm run dev

# Run the tests with TestSprite
testsprite run
```

## Test Coverage

These tests cover the following functionality:

1. **Product Browsing**
   - Navigation to shop page
   - Product display
   - Category filtering
   - Product search
   - Add to cart from product card
   - Add to favorites from product card

2. **Product Details**
   - Navigation to product details
   - Product information display
   - Add to cart functionality
   - Add to favorites functionality

3. **Shopping Cart**
   - Adding products to cart
   - Viewing cart
   - Updating product quantity
   - Removing products from cart

4. **Favorites**
   - Adding products to favorites
   - Viewing favorites
   - Removing products from favorites

## Accessibility Testing

The tests use ARIA attributes to locate elements, ensuring that the application is accessible and follows best practices for web accessibility.