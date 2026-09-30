import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

const FarmerOrdersPage = () => {
  const { t, translateStatus } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders${statusFilter !== 'All' ? `?status=${statusFilter}` : ''}`);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch farmer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        alert(`${t('farmer.statusUpdatedMsg')} ${translateStatus(newStatus)}`);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('farmer.ordersTitle')}</h1>
          <p className="text-xs text-slate-500">{t('farmer.ordersSub')}</p>
        </div>

        {/* Filter Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600"
        >
          <option value="All">{t('farmer.filterAllStatus')}</option>
          <option value="PLACED">{translateStatus('PLACED')}</option>
          <option value="CONFIRMED">{translateStatus('CONFIRMED')}</option>
          <option value="PROCESSING">{translateStatus('PROCESSING')}</option>
          <option value="OUT_FOR_DELIVERY">{translateStatus('OUT_FOR_DELIVERY')}</option>
          <option value="DELIVERED">{translateStatus('DELIVERED')}</option>
          <option value="CANCELLED">{translateStatus('CANCELLED')}</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner label={t('farmer.fetchingOrders')} />
      ) : orders.length === 0 ? (
        <EmptyState
          title={t('farmer.noFarmerOrders')}
          message={t('farmer.noFarmerOrdersSub')}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-400">
                <th className="p-3.5">{t('orders.orderNum')}</th>
                <th className="p-3.5">{t('farmer.tableBuyer')}</th>
                <th className="p-3.5">{t('farmer.tableShipping')}</th>
                <th className="p-3.5">{t('farmer.tableTotal')}</th>
                <th className="p-3.5">{t('farmer.tableStatus')}</th>
                <th className="p-3.5 text-right">{t('farmer.tableQuickUpdate')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">
                    <Link to={`/farmer/orders/${o._id}`} className="hover:text-emerald-700 underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="p-3.5 font-semibold">{o.buyer?.name}</td>
                  <td className="p-3.5 text-slate-500">{o.shippingAddress?.city}, {o.shippingAddress?.state}</td>
                  <td className="p-3.5 font-extrabold text-emerald-800">₹{o.totalAmount}</td>
                  <td className="p-3.5">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800 uppercase">
                      {translateStatus(o.orderStatus)}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white p-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600"
                    >
                      <option value="PLACED">{translateStatus('PLACED')}</option>
                      <option value="CONFIRMED">{translateStatus('CONFIRMED')}</option>
                      <option value="PROCESSING">{translateStatus('PROCESSING')}</option>
                      <option value="READY_FOR_DELIVERY">{translateStatus('READY_FOR_DELIVERY')}</option>
                      <option value="OUT_FOR_DELIVERY">{translateStatus('OUT_FOR_DELIVERY')}</option>
                      <option value="DELIVERED">{translateStatus('DELIVERED')}</option>
                      <option value="CANCELLED">{translateStatus('CANCELLED')}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FarmerOrdersPage;
