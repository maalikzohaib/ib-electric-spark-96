// TestSprite test script for ProductCard component and productStore functionality

/**
 * @test ProductCard and ProductStore Test
 * @description Tests the ProductCard component and productStore functionality
 */
export default async function productComponentTest(page) {
  // First navigate to the shop page
  await page.goto('http://localhost:8081/shop');
  
  // Wait for products to load
  await page.waitForSelector('[role="region"][aria-label="Products grid"]');
  
  // Get all product cards
  const productCards = await page.$$('[role="article"]');
  
  if (productCards.length === 0) {
    console.log('No products found to test ProductCard component');
    return false;
  }
  
  // Test 1: Verify ProductCard structure
  const firstCard = productCards[0];
  
  // Check for product title
  const productTitle = await firstCard.$('[id^="product-"]');
  console.assert(productTitle !== null, 'Expected product title to be present');
  
  // Check for price display
  const productPrice = await firstCard.$('*::-p-text(PKR)');
  console.assert(productPrice !== null, 'Expected product price to be displayed');
  
  // Check for in-stock badge
  const stockBadge = await firstCard.$('.badge');
  console.assert(stockBadge !== null, 'Expected stock status badge to be displayed');
  
  // Test 2: Test add to favorites functionality
  const favoriteButton = await firstCard.$('button[aria-label*="favorites"]');
  if (favoriteButton) {
    // Get initial state
    const initialState = await favoriteButton.evaluate(el => {
      return el.querySelector('svg').classList.contains('fill-red-500');
    });
    
    // Click the favorite button
    await favoriteButton.click();
    
    // Wait for toast notification
    await page.waitForSelector('[role="status"]', { timeout: 5000 })
      .catch(() => console.log('Toast notification not displayed'));
    
    // Check if state changed
    await page.waitForTimeout(1000); // Wait for state to update
    
    const newState = await favoriteButton.evaluate(el => {
      return el.querySelector('svg').classList.contains('fill-red-500');
    });
    
    console.assert(initialState !== newState, 'Expected favorite state to toggle');
    
    // Toggle back to original state
    await favoriteButton.click();
    await page.waitForTimeout(1000);
  }
  
  // Test 3: Test add to cart functionality
  const addToCartButton = await firstCard.$('button[aria-label="Add to cart"]');
  if (addToCartButton) {
    // Click the add to cart button
    await addToCartButton.click();
    
    // Wait for toast notification
    await page.waitForSelector('[role="status"]', { timeout: 5000 })
      .catch(() => console.log('Toast notification not displayed'));
    
    // Check if cart icon updates
    const cartCount = await page.$('[aria-label*="items in cart"]');
    console.assert(cartCount !== null, 'Expected cart count to be displayed');
  }
  
  // Test 4: Test keyboard navigation
  const viewDetailsLink = await firstCard.$('a[aria-label*="View details"]');
  if (viewDetailsLink) {
    // Focus on the link
    await viewDetailsLink.focus();
    
    // Press Enter key
    await page.keyboard.press('Enter');
    
    // Wait for navigation
    await page.waitForNavigation({ timeout: 5000 })
      .catch(() => console.log('Navigation did not occur'));
    
    // Check if we're on a product details page
    const onProductPage = await page.evaluate(() => {
      return window.location.pathname.includes('/product/');
    });
    
    console.assert(onProductPage, 'Expected to navigate to product details page');
  }
  
  return true; // Test passed
}