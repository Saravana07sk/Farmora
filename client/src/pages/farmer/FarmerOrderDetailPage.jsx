import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, CheckCircle2, Truck } from 'lucide-react';
import API from '../../services/api';
import PriceBreakdown from '../../components/PriceBreakdown';
import LoadingSpinner from '../../components/LoadingSpinner';

const FarmerOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading order details..." />;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/farmer/orders" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-700">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Order #{order.orderNumber}</h1>
          <p className="text-xs text-slate-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 uppercase">
          {order.orderStatus}
        </span>
      </div>

      {/* Buyer & Address Card */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Buyer Information</h3>
          <p className="text-sm font-bold text-slate-900">{order.buyer?.name}</p>
          <p className="text-xs text-slate-600">{order.buyer?.email}</p>
          <p className="text-xs text-slate-600 flex items-center"><Phone className="mr-1 h-3.5 w-3.5" /> {order.buyer?.phone}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Address</h3>
          <p className="text-xs text-slate-700 font-semibold">{order.shippingAddress?.street}</p>
          <p className="text-xs text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items</h3>
        <div className="divide-y divide-slate-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="h-10 w-10 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <span className="text-[11px] text-slate-500">₹{item.price} / {item.unit}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold">{item.quantity} {item.unit}</span>
                <p className="text-xs font-extrabold text-emerald-800">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Pricing Summary */}
      <PriceBreakdown
        subtotal={order.subtotal}
        platformFee={order.platformFee}
        deliveryFee={order.deliveryFee}
        totalAmount={order.totalAmount}
      />
    </div>
  );
};

export default FarmerOrderDetailPage;
