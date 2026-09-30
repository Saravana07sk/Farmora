import React, { useState, useEffect } from 'react';
import { ShieldCheck, DollarSign, Users, Package, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import CountUp from '../../components/CountUp';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/analytics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner label="Calculating platform marketplace GMV & audit logs..." />;

  const { users, products, financials, categoryBreakdown, monthlyStats } = data || {};
  const COLORS = ['#2d6a4f', '#52b788', '#eb5e28', '#f4a261', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Platform Admin Overview</h1>
        <p className="text-xs text-slate-500">Marketplace GMV, platform commissions, farmer verifications, and audit controls</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform GMV</span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            <CountUp value={financials?.gmv || 0} prefix="₹" />
          </p>
          <span className="text-[11px] font-semibold text-slate-500">Gross Merchandise Value</span>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Commission Earned (3%)</span>
          <p className="mt-2 text-2xl font-black text-emerald-800">
            <CountUp value={financials?.platformCommission || 0} prefix="₹" />
          </p>
          <span className="text-[11px] font-semibold text-emerald-700">Platform Revenue</span>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Farmers</span>
          <p className="mt-2 text-2xl font-black text-slate-900">
            <CountUp value={users?.farmers || 0} />
          </p>
          <span className="text-[11px] font-semibold text-emerald-700">{users?.verifiedFarmers || 0} Verified Farmers</span>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Verifications</span>
          <p className="mt-2 text-2xl font-black text-amber-600">
            <CountUp value={users?.pendingVerifications || 0} />
          </p>
          <span className="text-[11px] font-semibold text-slate-500">Action Required</span>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Monthly GMV & Platform Commission (INR)</h3>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="gmv" stroke="#2d6a4f" fill="#52b788" />
                <Area type="monotone" dataKey="commission" stroke="#eb5e28" fill="#f4a261" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Category Distribution</h3>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => entry._id}
                >
                  {categoryBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
