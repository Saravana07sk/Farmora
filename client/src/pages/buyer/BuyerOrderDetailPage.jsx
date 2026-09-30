import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import API from '../../services/api';
import PriceBreakdown from '../../components/PriceBreakdown';
import LoadingSpinner from '../../components/LoadingSpinner';
import VerifiedBadge from '../../components/VerifiedBadge';
import OrderTrackingJourney from '../../components/OrderTrackingJourney';
import { useLanguage } from '../../context/LanguageContext';

const BuyerOrderDetailPage = () => {
  const { id } = useParams();
  const { t, translateStatus, translateUnit, isTamil } = useLanguage();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await API.post('/reviews', {
        productId: reviewModalItem.product,
        orderId: order._id,
        rating,
        comment,
      });

      if (res.data.success) {
        alert(t('orders.reviewSuccess'));
        setReviewModalItem(null);
        setComment('');
      }
    } catch (err) {
      alert(err.response?.data?.message || (isTamil ? 'மதிப்புரை சமர்ப்பிக்க முடியவில்லை' : 'Failed to submit review'));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner label={t('orders.loadingDetail')} />;
  if (!order) return <p className="p-8 text-center text-slate-600">{t('orders.notFound')}</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/buyer/orders" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-700">
        <ArrowLeft className="mr-1 h-4 w-4" /> {t('orders.backToOrders')}
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('orders.orderNum')} {order.orderNumber}</h1>
          <p className="text-xs text-slate-500">{t('orders.placedOn')} {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black text-emerald-800 uppercase">
          {translateStatus(order.orderStatus)}
        </span>
      </div>

      {/* Shipment Status Progress Stepper */}
      <OrderTrackingJourney currentStatus={order.orderStatus} />

      {/* Farmer Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400">{t('orders.soldBy')}</span>
          <h4 className="text-sm font-bold text-slate-900">{order.farmer?.farmName || order.farmer?.name}</h4>
          <p className="text-xs text-slate-500">{order.farmer?.phone}</p>
        </div>
        <VerifiedBadge isVerified={order.farmer?.isVerified} size="md" />
      </div>

      {/* Items List & Review Action */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('orders.purchasedProduce')}</h3>
        <div className="divide-y divide-slate-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <span className="text-[11px] text-slate-500">
                    ₹{item.price} / {translateUnit(item.unit)} • {isTamil ? 'அளவு:' : 'Qty:'} {item.quantity}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                <span className="text-xs font-extrabold text-emerald-800">₹{item.price * item.quantity}</span>
                {order.orderStatus === 'DELIVERED' && (
                  <button
                    onClick={() => setReviewModalItem(item)}
                    className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600"
                  >
                    {t('orders.rateReview')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Price Breakdown */}
      <PriceBreakdown
        subtotal={order.subtotal}
        platformFee={order.platformFee}
        deliveryFee={order.deliveryFee}
        totalAmount={order.totalAmount}
      />

      {/* Review Modal */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              {t('orders.reviewTitle')} {reviewModalItem.name}
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">{t('orders.ratingLabel')}</label>
                <div className="flex space-x-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">{t('orders.commentLabel')}</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('orders.commentPlaceholder')}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalItem(null)}
                  className="w-1/2 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  {t('orders.closeBtn')}
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-1/2 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  {submittingReview ? t('orders.reviewSubmitting') : t('orders.reviewSubmit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrderDetailPage;
