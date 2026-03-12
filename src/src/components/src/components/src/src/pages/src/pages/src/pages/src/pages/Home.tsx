import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { Loader2, Search } from 'lucide-react';

export default function Home() {
  const { searchQuery, setSearchQuery } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (category) params.append('category', category);
      
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Electronics', 'Home & Office', 'Furniture', 'Clothing', 'Sports & Outdoors'];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/tech/1920/1080')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Extraordinary</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 font-light">
            Shop the latest trends, tech, and lifestyle products from top sellers around the world.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c === 'All' ? '' : c)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  (category === c || (c === 'All' && !category))
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 backdrop-blur-md border border-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Grid */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {searchQuery ? `Search results for "${searchQuery}"` : category ? category : 'Trending Now'}
          </h2>
          <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{products.length} Products</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-slate-400 mb-4">
              <Search className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setCategory(''); }}
              className="mt-6 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
