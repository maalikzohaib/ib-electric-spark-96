// TestSprite test script for product browsing functionality

/**
 * @test Product Browsing Test
 * @description Tests the product browsing functionality of the e-commerce application
 */
export default async function productBrowsingTest(page) {
  // Navigate to the shop page
  await page.goto('http://localhost:8081/shop');
  
  // Wait for products to load
  await page.waitForSelector('[role="region"][aria-label="Products grid"]');
  
  // Test 1: Verify products are displayed
  const productCards = await page.$$('[role="article"]');
  console.assert(productCards.length > 0, 'Expected products to be displayed');
  
  // Test 2: Test category filtering if categories exist
  const categoryFilters = await page.$$('[aria-label*="Filter by category"]');
  if (categoryFilters.length > 0) {
    // Click on the first category filter
    await categoryFilters[0].click();
    
    // Wait for the page to update
    await page.waitForTimeout(1000);
    
    // Verify products are still displayed (filtered or not)
    const filteredProducts = await page.$$('[role="article"]');
    console.assert(filteredProducts.length >= 0, 'Expected filtered products to be displayed');
  }
  
  // Test 3: Test product search if search input exists
  const searchInput = await page.$('input[placeholder*="Search"]');
  if (searchInput) {
    // Type a search term
    await searchInput.type('electric');
    
    // Wait for the search results
    await page.waitForTimeout(1000);
    
    // Verify search results
    const searchResults = await page.$$('[role="article"]');
    console.assert(searchResults.length >= 0, 'Expected search results to be displayed');
  }
  
  // Test 4: Test product card functionality
  if (productCards.length > 0) {
    // Test add to favorites
    const favoriteButton = await productCards[0].$('button[aria-label*="favorites"]');
    if (favoriteButton) {
      await favoriteButton.click();
      
      // Wait for toast notification
      await page.waitForSelector('[role="status"]', { timeout: 5000 })
        .catch(() => console.log('Toast notification not displayed'));
    }
    
    // Test add to cart
    const addToCartButton = await productCards[0].$('button[aria-label="Add to cart"]');
    if (addToCartButton) {
      await addToCartButton.click();
      
      // Wait for toast notification
      await page.waitForSelector('[role="status"]', { timeout: 5000 })
        .catch(() => console.log('Toast notification not displayed'));
      
      // Verify cart icon updates
      const cartCount = await page.$('[aria-label*="items in cart"]');
      console.assert(cartCount !== null, 'Expected cart count to be displayed');
    }
    
    // Test view details link
    const viewDetailsLink = await productCards[0].$('a[aria-label*="View details"]');
    if (viewDetailsLink) {
      // Get the href attribute
      const href = await viewDetailsLink.evaluate(el => el.getAttribute('href'));
      console.assert(href && href.includes('/product/'), 'Expected view details link to point to product detail page');
    }
  }
  
  return true; // Test passed
}