import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import db, { setupDb } from './src/db/setup.js';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  setupDb();
  
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Auth Routes (Mocked for simplicity)
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE email = ? AND password = ?').get(email, password);
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, password, role || 'user');
      const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(result.lastInsertRowid);
      res.json({ user });
    } catch (error) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  // Product Routes
  app.get('/api/products', (req, res) => {
    const { search, category } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    const products = db.prepare(query).all(...params);
    res.json({ products });
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  // Seller Product Routes
  app.post('/api/products', (req, res) => {
    const { seller_id, title, description, price, category, image_url, stock } = req.body;
    const result = db.prepare('INSERT INTO products (seller_id, title, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)').run(seller_id, title, description, price, category, image_url, stock);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.json({ product });
  });

  app.put('/api/products/:id', (req, res) => {
    const { title, description, price, category, image_url, stock } = req.body;
    db.prepare('UPDATE products SET title = ?, description = ?, price = ?, category = ?, image_url = ?, stock = ? WHERE id = ?').run(title, description, price, category, image_url, stock, req.params.id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json({ product });
  });

  app.delete('/api/products/:id', (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Order Routes
  app.post('/api/orders', (req, res) => {
    const { user_id, total_amount, shipping_address, payment_method, items } = req.body;
    
    const transaction = db.transaction(() => {
      const orderResult = db.prepare('INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)').run(user_id, total_amount, shipping_address, payment_method);
      const orderId = orderResult.lastInsertRowid;

      const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
      const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

      for (const item of items) {
        insertItem.run(orderId, item.product_id, item.quantity, item.price);
        updateStock.run(item.quantity, item.product_id);
      }
      return orderId;
    });

    try {
      const orderId = transaction();
      res.json({ success: true, orderId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  app.get('/api/orders/user/:userId', (req, res) => {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.params.userId);
    res.json({ orders });
  });

  app.get('/api/orders/seller/:sellerId', (req, res) => {
    const orders = db.prepare(`
      SELECT DISTINCT o.* 
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = ?
      ORDER BY o.created_at DESC
    `).all(req.params.sellerId);
    res.json({ orders });
  });

  // AI Routes
  app.post('/api/ai/recommend', async (req, res) => {
    const { history } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on the user's viewing history: ${history.join(', ')}. Recommend 3 product categories they might like. Return only a comma-separated list of categories.`
      });
      res.json({ recommendations: response.text?.split(',').map(s => s.trim()) || [] });
    } catch (error) {
      res.status(500).json({ error: 'AI recommendation failed' });
    }
  });

  app.post('/api/ai/describe', async (req, res) => {
    const { title, category } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a compelling, professional product description for a "${title}" in the "${category}" category. Keep it under 50 words.`
      });
      res.json({ description: response.text });
    } catch (error) {
      res.status(500).json({ error: 'AI description failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
