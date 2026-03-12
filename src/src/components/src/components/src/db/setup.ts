import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'marketplace.db');
const db = new Database(dbPath);

export function setupDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user', -- 'user', 'seller', 'admin'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered'
      shipping_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);

  // Insert some dummy data if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    insertUser.run('Admin User', 'admin@example.com', 'password123', 'admin');
    insertUser.run('Seller One', 'seller@example.com', 'password123', 'seller');
    insertUser.run('Test User', 'user@example.com', 'password123', 'user');

    const insertProduct = db.prepare('INSERT INTO products (seller_id, title, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertProduct.run(2, 'Wireless Noise-Cancelling Headphones', 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.', 299.99, 'Electronics', 'https://picsum.photos/seed/headphones/800/600', 50);
    insertProduct.run(2, 'Minimalist Desk Lamp', 'Sleek LED desk lamp with adjustable brightness and color temperature.', 45.00, 'Home & Office', 'https://picsum.photos/seed/desklamp/800/600', 120);
    insertProduct.run(2, 'Ergonomic Office Chair', 'Breathable mesh back office chair with lumbar support and adjustable armrests.', 199.50, 'Furniture', 'https://picsum.photos/seed/officechair/800/600', 30);
    insertProduct.run(2, 'Smart Fitness Watch', 'Track your workouts, heart rate, and sleep with this water-resistant smartwatch.', 149.99, 'Electronics', 'https://picsum.photos/seed/smartwatch/800/600', 75);
    insertProduct.run(2, 'Organic Cotton T-Shirt', 'Soft, breathable, and sustainably sourced organic cotton t-shirt.', 24.99, 'Clothing', 'https://picsum.photos/seed/tshirt/800/600', 200);
    insertProduct.run(2, 'Stainless Steel Water Bottle', 'Double-wall vacuum insulated water bottle keeps drinks cold for 24 hours.', 18.50, 'Sports & Outdoors', 'https://picsum.photos/seed/waterbottle/800/600', 150);
  }
}

export default db;
