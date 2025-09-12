import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

async function testProductSize() {
  try {
    const sql = neon(process.env.VITE_DATABASE_URL);
    console.log('Neon client created');
    
    // First, get a valid category ID from the database
    const categoryResult = await sql.query('SELECT id FROM categories LIMIT 1');
    if (!categoryResult || categoryResult.length === 0) {
      console.log('No categories found in the database. Please create a category first.');
      return;
    }
    
    const categoryId = categoryResult[0].id;
    console.log('Using category ID:', categoryId);
    
    // Test creating a product with size
    console.log('Testing product creation with size...');
    
    const testProduct = {
      name: 'Test Product with Size',
      description: 'A test product with size field',
      price: 99.99,
      brand: 'Test Brand',
      color: 'Blue',
      variant: 'Standard',
      size: 'Medium',
      in_stock: true,
      featured: false,
      image_url: 'https://example.com/image.jpg',
      category_id: categoryId
    };
    
    // Insert the test product
    const insertResult = await sql.query(
      `INSERT INTO products (name, description, price, brand, color, variant, size, in_stock, featured, image_url, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, name, size`,
      [testProduct.name, testProduct.description, testProduct.price, testProduct.brand, 
       testProduct.color, testProduct.variant, testProduct.size, testProduct.in_stock, 
       testProduct.featured, testProduct.image_url, testProduct.category_id]
    );
    
    console.log('Product created successfully:', insertResult[0]);
    
    // Retrieve the product to verify size was saved
    const productId = insertResult[0].id;
    const retrieveResult = await sql.query(
      'SELECT id, name, size FROM products WHERE id = $1',
      [productId]
    );
    
    console.log('Retrieved product:', retrieveResult[0]);
    console.log('Size value:', retrieveResult[0].size);
    
    // Clean up - delete the test product
    await sql.query('DELETE FROM products WHERE id = $1', [productId]);
    console.log('Test product deleted');
    
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('Error testing product size:', error);
  }
}

testProductSize();