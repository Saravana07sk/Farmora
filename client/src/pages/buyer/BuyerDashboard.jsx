import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Store, Clock } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProductCard from '../../components/ProductCard';

const BuyerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const orderRes = await API.get('/orders?limit=5');
        if (orderRes.data.success) {
          setOrders(orderRes.data.data);
        }

        const prodRes = await API.get('/products?limit=3&verifiedOnly=true');
        if (prodRes.data.success) {
          setRecommended(prodRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load buyer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner label="Loading buyer portal..." />;

  const totalSpent = orders.reduce((acc, o) => acc + (o.orderStatus !== 'CANCELLED' ? o.totalAmount : 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Buyer Dashboard</h1>
        <p className="text-xs text-slate-500">Track agricultural orders, shipping status, and order direct from verified farms</p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
          <p className="mt-2 text-2xl font-black text-slate-900">{orders.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Spending</span>
          <p className="mt-2 text-2xl font-black text-emerald-800">₹{totalSpent.toLocaleString('en-IN')}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Shipments</span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {orders.filter((o) => ['PLACED', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY'].includes(o.orderStatus)).length}
          </p>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Farm Orders</h3>
          <Link to="/buyer/orders" className="text-xs font-bold text-emerald-700 hover:underline">
            View All Orders History
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400">You haven't placed any produce orders yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-3">
                <div>
                  <Link to={`/buyer/orders/${order._id}`} className="text-sm font-bold text-slate-900 hover:text-emerald-700">
                    Order #{order.orderNumber}
                  </Link>
                  <p className="text-xs text-slate-500">{order.items?.length} items • Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-800">₹{order.totalAmount}</span>
                  <span className="block text-[10px] font-extrabold uppercase text-slate-600">{order.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Verified Produce */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Recommended Fresh Produce</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {recommended.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
