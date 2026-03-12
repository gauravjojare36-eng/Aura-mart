/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import { Login, Signup } from './pages/Auth';
import SellerDashboard from './pages/SellerDashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/seller" element={<SellerDashboard />} />
          </Routes>
        </main>
        
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-indigo-400">Aura</span>Mart
              </h3>
              <p className="text-sm leading-relaxed">The ultimate AI-powered marketplace for modern shoppers and ambitious sellers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Trending</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Discounts</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Sell</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Become a Seller</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Seller Dashboard</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Seller Guidelines</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Fees & Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
            &copy; {new Date().getFullYear()} AuraMart. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}
