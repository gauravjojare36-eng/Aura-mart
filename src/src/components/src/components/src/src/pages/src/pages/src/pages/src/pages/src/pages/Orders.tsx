import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Package, Clock, CheckCircle2 } from 'lucide-react';

export default function Orders() {
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/orders/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data.orders);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-slate-800">Please login to view orders</div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-10 tracking-tight">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">No orders yet</h2>
            <p className="text-slate-500 mb-8 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Order #{order.id}</p>
                    <p className="text-slate-900 font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total</p>
                      <p className="text-slate-900 font-black text-xl">${order.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status === 'delivered' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Shipping Address</h4>
                    <p className="text-slate-700 leading-relaxed">{order.shipping_address}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Payment Method</h4>
                    <p className="text-slate-700 flex items-center gap-2">
                      <span className="w-8 h-5 bg-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {order.payment_method === 'card' ? 'CARD' : 'COD'}
                      </span>
                      {order.payment_method === 'card' ? 'Credit / Debit Card' : 'Cash on Delivery'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
