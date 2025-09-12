// TestSprite main test file

/**
 * @test E-commerce Application Test Suite
 * @description Main test suite for the e-commerce application
 */

import productBrowsingTest from './product_browsing_test.js';
import productDetailsTest from './product_details_test.js';
import cartTest from './cart_test.js';
import favoritesTest from './favorites_test.js';
import productComponentTest from './product_component_test.js';

export default async function mainTest(page) {
  console.log('Starting E-commerce Application Test Suite');
  
  // Run all tests
  const tests = [
    { name: 'Product Browsing Test', fn: productBrowsingTest },
    { name: 'Product Details Test', fn: productDetailsTest },
    { name: 'Shopping Cart Test', fn: cartTest },
    { name: 'Favorites Test', fn: favoritesTest },
    { name: 'Product Component Test', fn: productComponentTest }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`Running ${test.name}...`);
    try {
      const result = await test.fn(page);
      results.push({
        name: test.name,
        passed: result,
        error: null
      });
      console.log(`${test.name}: ${result ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      results.push({
        name: test.name,
        passed: false,
        error: error.message
      });
      console.log(`${test.name}: FAILED - ${error.message}`);
    }
  }
  
  // Print summary
  console.log('\nTest Summary:');
  const passedTests = results.filter(r => r.passed).length;
  console.log(`Passed: ${passedTests}/${results.length}`);
  
  if (passedTests < results.length) {
    console.log('\nFailed Tests:');
    results.filter(r => !r.passed).forEach(result => {
      console.log(`- ${result.name}${result.error ? ': ' + result.error : ''}`);
    });
  }
  
  return passedTests === results.length;
}