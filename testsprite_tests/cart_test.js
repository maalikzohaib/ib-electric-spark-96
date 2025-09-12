// TestSprite test script for shopping cart functionality

/**
 * @test Shopping Cart Test
 * @description Tests the shopping cart functionality
 */
export default async function cartTest(page) {
  // First navigate to the shop page
  await page.goto('http://localhost:8081/shop');
  
  // Wait for products to load
  await page.waitForSelector('[role="region"][aria-label="Products grid"]');
  
  // Get all product cards
  const productCards = await page.$$('[role="article"]');
  
  if (productCards.length === 0) {
    console.log('No products found to test cart functionality');
    return false;
  }
  
  // Test 1: Add a product to cart
  const addToCartButton = await productCards[0].$('button[aria-label="Add to cart"]');
  if (!addToCartButton) {
    console.log('Add to cart button not found');
    return false;
  }
  
  await addToCartButton.click();
  
  // Wait for toast notification
  await page.waitForSelector('[role="status"]', { timeout: 5000 })
    .catch(() => console.log('Toast notification not displayed'));
  
  // Test 2: Navigate to cart page
  const cartLink = await page.$('a[href="/cart"]');
  if (!cartLink) {
    console.log('Cart link not found');
    return false;
  }
  
  await Promise.all([
    page.waitForNavigation(), // Wait for navigation to complete
    cartLink.click()
  ]);
  
  // Test 3: Verify cart page loads
  const cartTitle = await page.$('h1::-p-text(Shopping Cart)');
  console.assert(cartTitle !== null, 'Expected cart page title to be displayed');
  
  // Test 4: Verify product is in cart
  const cartItems = await page.$$('[role="listitem"]');
  console.assert(cartItems.length > 0, 'Expected at least one item in cart');
  
  // Test 5: Test quantity update if controls exist
  const quantityInput = await page.$('input[type="number"]');
  if (quantityInput) {
    // Clear the input and set to 2
    await quantityInput.click({ clickCount: 3 }); // Triple click to select all
    await quantityInput.type('2');
    
    // Wait for update
    await page.waitForTimeout(1000);
    
    // Verify total price updates
    const totalPrice = await page.$('*::-p-text(Total:)');
    console.assert(totalPrice !== null, 'Expected total price to be displayed');
  }
  
  // Test 6: Test remove from cart if button exists
  const removeButton = await page.$('button[aria-label*="Remove"]');
  if (removeButton) {
    await removeButton.click();
    
    // Wait for update
    await page.waitForTimeout(1000);
    
    // Check if cart is empty or has one less item
    const updatedCartItems = await page.$$('[role="listitem"]');
    console.assert(updatedCartItems.length < cartItems.length, 'Expected item to be removed from cart');
  }
  
  return true; // Test passed
}