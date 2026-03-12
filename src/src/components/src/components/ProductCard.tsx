import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Product {
  id: number;
  seller_id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden aspect-square">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-lg uppercase tracking-wider bg-black/60 px-4 py-2 rounded-full">Out of Stock</span>
          </div>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <Star className="w-4 h-4 text-gray-300" />
          <span className="text-xs text-slate-500 ml-1">(4.0)</span>
        </div>
        
        <Link to={`/product/${product.id}`} className="text-lg font-semibold text-slate-900 line-clamp-2 mb-1 hover:text-indigo-600 transition-colors">
          {product.title}
        </Link>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
