import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Clock,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import VerifiedBadge from '../../components/VerifiedBadge';
import CountUp from '../../components/CountUp';
import { useAuth } from '../../context/AuthContext';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await API.get('/farmer/analytics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch farmer analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner label="Calculating farm revenue & sales analytics..." />;

  const { summary, topProducts, monthlyTrends, recentOrders } = data || {};

  return (
    <div className="space-y-8">
      {/* Verification Warning Alert if not verified */}
      {!user?.isVerified && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Farmer Verification Pending</h4>
              <p className="text-xs text-amber-700">
                Submit land records or Kisan ID documents to receive the Verified Farmer badge and boost buyer trust.
              </p>
            </div>
          </div>
          <Link
            to="/farmer/verification"
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
          >
            Verify Now
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-[#1E3F20]">{user?.farmName || `${user?.name}'s Farm`}</h1>
            <VerifiedBadge isVerified={user?.isVerified} size="md" />
          </div>
          <p className="text-xs text-[#4E3629]/70">Real-time inventory, revenue, and customer order management</p>
        </div>

        <Link
          to="/farmer/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#74A12E] px-4 py-2.5 text-xs font-bold text-[#FDFBF7] shadow-md shadow-[#74A12E]/25 hover:brightness-105"
        >
          <Plus className="h-4 w-4" /> Add Produce Listing
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4E3629]/60">Total Revenue</span>
            <div className="rounded-xl bg-[#74A12E]/15 p-2 text-[#74A12E]">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-[#1E3F20]">
            <CountUp value={summary?.totalRevenue || 0} prefix="₹" />
          </p>
          <span className="text-[11px] font-semibold text-[#74A12E]">+100% Direct Payout</span>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4E3629]/60">Total Orders</span>
            <div className="rounded-xl bg-[#4E3629]/15 p-2 text-[#4E3629]">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-[#1E3F20]">
            <CountUp value={summary?.totalOrders || 0} />
          </p>
          <span className="text-[11px] font-semibold text-[#4E3629]/70">{summary?.pendingOrders || 0} Pending fulfillment</span>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4E3629]/60">Active Listings</span>
            <div className="rounded-xl bg-[#74A12E]/15 p-2 text-[#74A12E]">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-[#1E3F20]">
            <CountUp value={summary?.activeProducts || 0} />
          </p>
          <span className="text-[11px] font-semibold text-[#4E3629]/70">Out of {summary?.totalProducts || 0} total</span>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4E3629]/60">In Stock Produce</span>
            <div className="rounded-xl bg-[#4E3629]/15 p-2 text-[#4E3629]">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-[#1E3F20]">
            <CountUp value={summary?.availableInventory || 0} />
          </p>
          <span className="text-[11px] font-semibold text-[#4E3629]/70">Total units available</span>
        </motion.div>
      </div>

      {/* Revenue & Sales Chart */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#1E3F20]">Monthly Farm Revenue Trend (INR)</h3>
          <div className="mt-4 h-72 w-full">
            {monthlyTrends && monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#74A12E" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1E3F20" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4E3629" strokeOpacity={0.1} />
                  <XAxis dataKey="month" stroke="#4E3629" opacity={0.6} fontSize={11} />
                  <YAxis stroke="#4E3629" opacity={0.6} fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#74A12E" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[#4E3629]/50">
                Revenue charts will update as orders are completed.
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Produce */}
        <div className="rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#1E3F20]">Top Selling Produce</h3>
          <div className="mt-4 space-y-4">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#4E3629]/10 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E3F20]">{prod._id}</h4>
                    <span className="text-[11px] text-[#4E3629]/70">{prod.quantitySold} units sold</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#74A12E]">₹{prod.revenue.toLocaleString('en-IN')}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#4E3629]/50">No sales data recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1E3F20]">Recent Customer Orders</h3>
          <Link to="/farmer/orders" className="text-xs font-bold text-[#74A12E] hover:underline">
            View All Orders
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#4E3629]/15 bg-[#FAF6EE] text-[#4E3629]/80 font-bold uppercase">
                  <th className="p-3">Order #</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4E3629]/10">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF6EE]">
                    <td className="p-3 font-bold text-[#1E3F20]">{order.orderNumber}</td>
                    <td className="p-3 text-[#1E3F20]/90">{order.buyer?.name}</td>
                    <td className="p-3 text-[#4E3629]/70">{order.items?.length} produce items</td>
                    <td className="p-3 font-bold text-[#74A12E]">₹{order.totalAmount}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-[#74A12E]/15 px-2.5 py-1 text-[10px] font-extrabold text-[#74A12E] uppercase">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link to={`/farmer/orders/${order._id}`} className="font-bold text-[#74A12E] hover:underline">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#4E3629]/50 py-4">No recent orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
