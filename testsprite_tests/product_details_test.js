// TestSprite test script for product details functionality

/**
 * @test Product Details Test
 * @description Tests the product details page functionality
 */
export default async function productDetailsTest(page) {
  // First navigate to the shop page to get a product
  await page.goto('http://localhost:8081/shop');
  
  // Wait for products to load
  await page.waitForSelector('[role="region"][aria-label="Products grid"]');
  
  // Get all product cards
  const productCards = await page.$$('[role="article"]');
  
  if (productCards.length === 0) {
    console.log('No products found to test details page');
    return false;
  }
  
  // Click on the first product's view details link
  const viewDetailsLink = await productCards[0].$('a[aria-label*="View details"]');
  if (!viewDetailsLink) {
    console.log('View details link not found');
    return false;
  }
  
  // Click on the view details link
  await Promise.all([
    page.waitForNavigation(), // Wait for navigation to complete
    viewDetailsLink.click()
  ]);
  
  // Test 1: Verify product details are displayed
  const productTitle = await page.$('h1');
  console.assert(productTitle !== null, 'Expected product title to be displayed');
  
  // Test 2: Verify product price is displayed
  const productPrice = await page.$('*::-p-text(PKR)');
  console.assert(productPrice !== null, 'Expected product price to be displayed');
  
  // Test 3: Verify product description is displayed
  const productDescription = await page.$('p');
  console.assert(productDescription !== null, 'Expected product description to be displayed');
  
  // Test 4: Test add to cart functionality
  const addToCartButton = await page.$('button::-p-text(Add to Cart)');
  if (addToCartButton) {
    await addToCartButton.click();
    
    // Wait for toast notification
    await page.waitForSelector('[role="status"]', { timeout: 5000 })
      .catch(() => console.log('Toast notification not displayed'));
    
    // Verify cart icon updates
    const cartCount = await page.$('[aria-label*="items in cart"]');
    console.assert(cartCount !== null, 'Expected cart count to be displayed');
  }
  
  // Test 5: Test add to favorites functionality
  const favoriteButton = await page.$('button[aria-label*="favorites"]');
  if (favoriteButton) {
    await favoriteButton.click();
    
    // Wait for toast notification
    await page.waitForSelector('[role="status"]', { timeout: 5000 })
      .catch(() => console.log('Toast notification not displayed'));
  }
  
  return true; // Test passed
}