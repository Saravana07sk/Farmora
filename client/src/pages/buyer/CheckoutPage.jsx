import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import PriceBreakdown from '../../components/PriceBreakdown';
import API from '../../services/api';
import OrderSuccessModal from '../../components/OrderSuccessModal';
import { useLanguage } from '../../context/LanguageContext';

const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const { t, isTamil } = useLanguage();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/orders', {
        shippingAddress: address,
        paymentMethod,
      });

      if (res.data.success) {
        await fetchCart();
        setSuccessOrder(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.calculatedItems || cart.calculatedItems.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm font-bold text-slate-800">{t('checkout.emptyCartMsg')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-[#1E3F20] mb-8">{t('checkout.title')}</h1>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Shipping & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1E3F20] flex items-center">
              <Truck className="mr-2 h-5 w-5 text-[#74A12E]" /> {t('checkout.shippingDetails')}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-[#1E3F20]">{t('checkout.fullName')}</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={address.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#1E3F20]">{t('checkout.phone')}</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={address.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1E3F20]">{t('checkout.street')}</label>
              <input
                type="text"
                name="street"
                required
                value={address.street}
                onChange={handleChange}
                placeholder={t('checkout.streetPlaceholder')}
                className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-bold text-[#1E3F20]">{t('checkout.city')}</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={address.city}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#1E3F20]">{t('checkout.state')}</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={address.state}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#1E3F20]">{t('checkout.pincode')}</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={address.pincode}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1E3F20] flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-[#74A12E]" /> {t('checkout.paymentMethod')}
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={`flex items-center space-x-3 rounded-2xl border p-4 cursor-pointer transition ${
                paymentMethod === 'COD' ? 'border-[#74A12E] bg-[#74A12E]/10' : 'border-[#4E3629]/20 bg-[#FAF6EE]'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="h-4 w-4 text-[#74A12E] focus:ring-[#74A12E]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1E3F20]">{t('checkout.cod')}</span>
                  <p className="text-[11px] text-[#4E3629]/70">{t('checkout.codSub')}</p>
                </div>
              </label>

              <label className={`flex items-center space-x-3 rounded-2xl border p-4 cursor-pointer transition ${
                paymentMethod === 'ONLINE' ? 'border-[#74A12E] bg-[#74A12E]/10' : 'border-[#4E3629]/20 bg-[#FAF6EE]'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={() => setPaymentMethod('ONLINE')}
                  className="h-4 w-4 text-[#74A12E] focus:ring-[#74A12E]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1E3F20]">{t('checkout.online')}</span>
                  <p className="text-[11px] text-[#4E3629]/70">{t('checkout.onlineSub')}</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing & Confirmation */}
        <div className="space-y-6">
          <PriceBreakdown
            subtotal={cart.subtotal}
            platformFee={cart.platformFee}
            deliveryFee={cart.deliveryFee}
            totalAmount={cart.totalAmount}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-[#82B134] to-[#74A12E] py-4 text-base font-extrabold text-[#FDFBF7] shadow-lg shadow-[#74A12E]/25 transition hover:brightness-105"
          >
            <span>{loading ? t('checkout.processingOrder') : t('checkout.placeOrder')}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* 3D Produce to Basket to Delivery Crate Journey Modal */}
      {successOrder && (
        <OrderSuccessModal
          orderId={successOrder._id}
          orderNumber={successOrder.orderNumber}
          onClose={() => setSuccessOrder(null)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
