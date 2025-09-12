// TestSprite test script for favorites functionality

/**
 * @test Favorites Test
 * @description Tests the favorites functionality
 */
export default async function favoritesTest(page) {
  // First navigate to the shop page
  await page.goto('http://localhost:8081/shop');
  
  // Wait for products to load
  await page.waitForSelector('[role="region"][aria-label="Products grid"]');
  
  // Get all product cards
  const productCards = await page.$$('[role="article"]');
  
  if (productCards.length === 0) {
    console.log('No products found to test favorites functionality');
    return false;
  }
  
  // Test 1: Add a product to favorites
  const favoriteButton = await productCards[0].$('button[aria-label*="favorites"]');
  if (!favoriteButton) {
    console.log('Favorite button not found');
    return false;
  }
  
  await favoriteButton.click();
  
  // Wait for toast notification
  await page.waitForSelector('[role="status"]', { timeout: 5000 })
    .catch(() => console.log('Toast notification not displayed'));
  
  // Test 2: Navigate to favorites page
  const favoritesLink = await page.$('a[href="/favorites"]');
  if (!favoritesLink) {
    console.log('Favorites link not found');
    return false;
  }
  
  await Promise.all([
    page.waitForNavigation(), // Wait for navigation to complete
    favoritesLink.click()
  ]);
  
  // Test 3: Verify favorites page loads
  const favoritesTitle = await page.$('h1::-p-text(Favorites)');
  console.assert(favoritesTitle !== null, 'Expected favorites page title to be displayed');
  
  // Test 4: Verify product is in favorites
  const favoriteItems = await page.$$('[role="article"]');
  console.assert(favoriteItems.length > 0, 'Expected at least one item in favorites');
  
  // Test 5: Test remove from favorites if button exists
  if (favoriteItems.length > 0) {
    const removeButton = await favoriteItems[0].$('button[aria-label*="Remove from favorites"]');
    if (removeButton) {
      await removeButton.click();
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      // Check if favorites is empty or has one less item
      const updatedFavoriteItems = await page.$$('[role="article"]');
      console.assert(updatedFavoriteItems.length < favoriteItems.length, 'Expected item to be removed from favorites');
    }
  }
  
  return true; // Test passed
}