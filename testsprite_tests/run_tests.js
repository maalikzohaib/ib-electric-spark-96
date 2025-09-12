// TestSprite test runner script

/**
 * This script provides a simple way to run the TestSprite tests
 * It can be executed with Node.js
 */

import puppeteer from 'puppeteer';
import mainTest from './main_test.js';

async function runTests() {
  console.log('Launching browser for TestSprite tests...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    defaultViewport: {
      width: 1280,
      height: 720
    }
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Running tests...');
    const success = await mainTest(page);
    
    console.log('\nTest execution completed.');
    console.log(`Overall result: ${success ? 'PASSED' : 'FAILED'}`);
  } catch (error) {
    console.error('Error running tests:', error);
  } finally {
    await browser.close();
  }
}

runTests().catch(console.error);