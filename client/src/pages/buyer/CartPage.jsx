import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import PriceBreakdown from '../../components/PriceBreakdown';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import CartBasketVisual from '../../components/CartBasketVisual';
import Button3D from '../../components/ui/Button3D';
import QuantityStepper3D from '../../components/3d/QuantityStepper3D';
import { useLanguage } from '../../context/LanguageContext';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const { t, translateUnit, isTamil } = useLanguage();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner label={isTamil ? 'கூடை விவரங்கள் கணக்கிடப்படுகிறது...' : 'Calculating cart totals...'} />;

  const items = cart?.calculatedItems || [];

  if (!cart || items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <EmptyState
          title={t('cart.emptyTitle')}
          message={t('cart.emptySubtitle')}
          actionLabel={t('cart.browseBtn')}
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1E3F20]">{t('cart.title')} ({items.length} {t('cart.itemsCount')})</h1>
        <p className="mt-1 text-xs text-[#4E3629]/70">{isTamil ? 'சரிபார்க்கப்பட்ட பண்ணைகளிலிருந்து நேரடியாக ஒதுக்கப்பட்ட விளைபொருட்கள்' : 'Produce allocated directly from verified farms'}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column: Cart Visual & Items List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Physical Basket Representation */}
          <CartBasketVisual items={items} />

          {/* Cart Items List with Exit Animations */}
          <div className="divide-y divide-[#4E3629]/10 rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-6 shadow-sm">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={cart.items[idx]?._id || item.productId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -25,
                    scale: 0.9,
                    transition: { duration: 0.3 },
                  }}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-[#4E3629]/15 shadow-sm"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#1E3F20]">{item.name}</h3>
                      <p className="text-xs text-[#4E3629]/70">{item.farmer?.farmName || item.farmer?.name || t('productCard.directFarm')}</p>
                      <span className="text-xs font-extrabold text-[#74A12E]">₹{item.price} / {translateUnit(item.unit)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:space-x-6">
                    {/* 3D Quantity Stepper */}
                    <QuantityStepper3D
                      value={item.quantity}
                      min={item.minimumOrderQuantity || 1}
                      max={9999}
                      onChange={(newQty) => updateQuantity(cart.items[idx]._id, newQty)}
                      size="sm"
                    />

                    <span className="text-sm font-black text-[#1E3F20] w-20 text-right">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeFromCart(cart.items[idx]._id)}
                      className="p-1.5 text-[#4E3629]/50 hover:text-rose-600 transition-colors"
                      title={isTamil ? 'கூடையிலிருந்து நீக்கு' : 'Remove from basket'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Pricing Summary & Checkout Button */}
        <div className="space-y-6">
          <PriceBreakdown
            subtotal={cart.subtotal}
            platformFee={cart.platformFee}
            deliveryFee={cart.deliveryFee}
            totalAmount={cart.totalAmount}
            feePercentage={cart.feePercentage}
          />

          <Button3D
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/buyer/checkout')}
            className="w-full shadow-[#74A12E]/30"
          >
            {t('cart.checkoutBtn')}
          </Button3D>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
