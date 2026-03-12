import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-indigo-300" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Your cart is empty</h2>
          <p className="text-slate-500 mb-8 text-lg">Looks like you haven't added anything yet.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-10 tracking-tight">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-shadow">
                <div className="w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900 line-clamp-2 pr-4 hover:text-indigo-600 transition-colors">
                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-full hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{item.category}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 bg-slate-50 rounded-full p-1 border border-slate-100">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-2xl font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600 text-lg">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-lg">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-600 text-lg">
                  <span>Tax</span>
                  <span className="font-semibold text-slate-900">${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-black text-indigo-600">${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-500/30 group"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-center text-sm text-slate-500 mt-6 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Secure checkout powered by AuraMart
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
