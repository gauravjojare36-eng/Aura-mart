import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-slate-800">Product not found</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to shopping
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="bg-slate-100 p-8 flex items-center justify-center relative group">
              <img 
                src={product.image_url} 
                alt={product.title} 
                className="w-full max-w-md object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {product.stock < 10 && product.stock > 0 && (
                <span className="absolute top-6 right-6 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Only {product.stock} left
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-slate-700">4.8</span>
                  <span>(124 reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {product.title}
              </h1>

              <div className="text-4xl font-black text-slate-900 mb-6">
                ${product.price.toFixed(2)}
              </div>

              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">1 Year Warranty</p>
                    <p>Money back guarantee</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">Free Shipping</p>
                    <p>On orders over $50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
