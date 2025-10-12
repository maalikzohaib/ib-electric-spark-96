import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log environment on startup to verify .env is loaded
console.log('\n🔍 Environment Check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Loaded' : '❌ Missing');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Loaded (' + process.env.SUPABASE_SERVICE_KEY.substring(0, 20) + '...)' : '❌ Missing');
console.log('');

const app = express();
app.use(express.json());

// Enable CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Load API handlers dynamically with cache busting
const loadHandler = async (handlerPath) => {
  // Add timestamp to force reload the module
  const cacheBuster = `?t=${Date.now()}`;
  const module = await import(handlerPath + cacheBuster);
  return module.default;
};

// Boot endpoint
app.all('/api/boot', async (req, res) => {
  try {
    const handler = await loadHandler('./api/boot.ts');
    await handler(req, res);
  } catch (error) {
    console.error('Error in /api/boot:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pages endpoints
app.all('/api/pages', async (req, res) => {
  try {
    const handler = await loadHandler('./api/pages/index.ts');
    await handler(req, res);
  } catch (error) {
    console.error('Error in /api/pages:', error);
    res.status(500).json({ error: error.message });
  }
});

app.all('/api/pages/reorder', async (req, res) => {
  try {
    const handler = await loadHandler('./api/pages/reorder.ts');
    await handler(req, res);
  } catch (error) {
    console.error('Error in /api/pages/reorder:', error);
    res.status(500).json({ error: error.message });
  }
});

app.all('/api/pages/:id', async (req, res) => {
  try {
    const modifiedReq = {
      ...req,
      query: { id: req.params.id, ...req.query }
    };
    const handler = await loadHandler('./api/pages/[id].ts');
    await handler(modifiedReq, res);
  } catch (error) {
    console.error('Error in /api/pages/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Products endpoints
app.all('/api/products', async (req, res) => {
  try {
    const handler = await loadHandler('./api/products/index.ts');
    await handler(req, res);
  } catch (error) {
    console.error('Error in /api/products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.all('/api/products/:id', async (req, res) => {
  try {
    const modifiedReq = {
      ...req,
      query: { id: req.params.id, ...req.query }
    };
    const handler = await loadHandler('./api/products/[id].ts');
    await handler(modifiedReq, res);
  } catch (error) {
    console.error('Error in /api/products/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

app.all('/api/products/:id/images', async (req, res) => {
  try {
    const modifiedReq = {
      ...req,
      query: { id: req.params.id, ...req.query }
    };
    const handler = await loadHandler('./api/products/[id]/images.ts');
    await handler(modifiedReq, res);
  } catch (error) {
    console.error('Error in /api/products/:id/images:', error);
    res.status(500).json({ error: error.message });
  }
});

app.all('/api/products/:id/featured', async (req, res) => {
  try {
    // Create a new query object instead of modifying the existing one
    const modifiedReq = {
      ...req,
      query: { id: req.params.id, ...req.query }
    };
    const handler = await loadHandler('./api/products/[id]/featured.ts');
    await handler(modifiedReq, res);
  } catch (error) {
    console.error('Error in /api/products/:id/featured:', error);
    res.status(500).json({ error: error.message });
  }
});

// Categories endpoints  
app.all('/api/categories', async (req, res) => {
  try {
    const handler = await loadHandler('./api/categories/index.ts');
    await handler(req, res);
  } catch (error) {
    console.error('Error in /api/categories:', error);
    res.status(500).json({ error: error.message });
  }
});

app.all('/api/categories/:id', async (req, res) => {
  try {
    const modifiedReq = {
      ...req,
      query: { id: req.params.id, ...req.query }
    };
    const handler = await loadHandler('./api/categories/[id].ts');
    await handler(modifiedReq, res);
  } catch (error) {
    console.error('Error in /api/categories/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.API_PORT || 3100;

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to serve API endpoints`);
  console.log(`✅ Database: ${process.env.DATABASE_URL ? 'Connected' : 'NOT CONFIGURED'}`);
});

