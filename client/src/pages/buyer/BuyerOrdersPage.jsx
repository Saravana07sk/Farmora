import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

const BuyerOrdersPage = () => {
  const { t, translateStatus, translateUnit, isTamil } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get('/orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner label={t('orders.loadingOrders')} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">{t('orders.myOrdersTitle')}</h1>
        <p className="text-xs text-slate-500">{t('orders.myOrdersSub')}</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title={t('orders.noOrders')}
          message={t('orders.noOrdersSub')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-slate-400">
                    {t('orders.orderNum')} {o.orderNumber}
                  </span>
                  <p className="text-xs text-slate-500">
                    {t('orders.placedOn')} {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-800 uppercase">
                    {translateStatus(o.orderStatus)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={o.items?.[0]?.image} alt="produce" className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{o.items?.[0]?.name}</h4>
                    <p className="text-xs text-slate-500">
                      {o.items?.length > 1
                        ? `+${o.items.length - 1} ${t('orders.moreItems')}`
                        : `${isTamil ? 'அளவு:' : 'Qty:'} ${o.items?.[0]?.quantity} ${translateUnit(o.items?.[0]?.unit)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-lg font-black text-emerald-800">₹{o.totalAmount}</span>
                  <Link
                    to={`/buyer/orders/${o._id}`}
                    className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    {t('orders.trackOrder')} <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerOrdersPage;
