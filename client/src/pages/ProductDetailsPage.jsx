import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ShoppingBag,
  Star,
  CheckCircle2,
  Phone,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../services/api';
import VerifiedBadge from '../components/VerifiedBadge';
import PriceBreakdown from '../components/PriceBreakdown';
import LoadingSpinner from '../components/LoadingSpinner';
import Button3D from '../components/ui/Button3D';
import QuantityStepper3D from '../components/3d/QuantityStepper3D';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useProductAnimation } from '../components/ProductToCartAnimation';
import { getImageUrl, handleImageError, DEFAULT_PRODUCE_IMAGE } from '../utils/imageUrl';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t, translateCategory, translateFarmingMethod, translateUnit, isTamil } = useLanguage();
  const { triggerFlyToCart } = useProductAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.data);
          setQuantity(res.data.data.minimumOrderQuantity || 1);

          // Fetch reviews
          const reviewRes = await API.get(`/reviews/product/${res.data.data._id}`);
          if (reviewRes.data.success) {
            setReviews(reviewRes.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [slug]);

  if (loading) return <LoadingSpinner label={t('productDetails.loadingLabel')} />;
  if (!product) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">{t('productDetails.notFound')}</h2>
        <Link to="/marketplace" className="mt-4 inline-block font-bold text-emerald-700">{t('productDetails.back')}</Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const mainImgEl = document.querySelector('.product-main-gallery-img');
    const rect = mainImgEl ? mainImgEl.getBoundingClientRect() : null;
    triggerFlyToCart({
      imageSrc: images[selectedImage],
      startRect: rect,
      productName: product.name,
    });

    const res = await addToCart(product._id, quantity);
    if (!res?.success) {
      alert(res?.message || 'Could not add to cart');
    }
  };

  const rawImages = product.images && product.images.length > 0 ? product.images : [DEFAULT_PRODUCE_IMAGE];
  const images = rawImages.map(getImageUrl);

  // Fee calculation for live single product breakdown preview
  const subtotal = product.price * quantity;
  const platformFee = Math.round(subtotal * 0.03 * 100) / 100;
  const deliveryFee = subtotal >= 2500 || subtotal === 0 ? 0 : 70;
  const totalAmount = Math.round((subtotal + platformFee + deliveryFee) * 100) / 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Back */}
      <Link to="/marketplace" className="inline-flex items-center text-xs font-bold text-[#4E3629]/70 hover:text-[#74A12E] mb-6">
        <ChevronLeft className="mr-1 h-4 w-4" /> {t('productDetails.back')}
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#4E3629]/15 bg-[#FAF6EE] shadow-sm group">
            <img
              src={images[selectedImage]}
              alt={product.name}
              onError={handleImageError}
              className="product-main-gallery-img h-full w-full object-cover transition-all duration-300"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                    selectedImage === idx ? 'border-[#74A12E] ring-2 ring-[#74A12E]/30' : 'border-[#4E3629]/20'
                  }`}
                >
                  <img src={img} alt="Thumb" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Farmer Profile Card */}
          <div className="mt-6 rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={product.farmer?.profileImage || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400'}
                  alt={product.farmer?.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-base font-bold text-[#1E3F20]">{product.farmer?.farmName || product.farmer?.name || t('productCard.directFarm')}</h4>
                  <p className="text-xs text-[#4E3629]/70">{product.farmer?.name} • {product.farmer?.address?.city}, {product.farmer?.address?.state}</p>
                </div>
              </div>
              <VerifiedBadge isVerified={product.farmer?.isVerified || product.isVerified} size="md" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#4E3629]/10 pt-3 text-xs text-[#4E3629]/80">
              <div>
                <span className="text-[#4E3629]/60">{t('productDetails.farmSize')}:</span> <span className="font-bold">{product.farmer?.farmSize || (isTamil ? 'சரிபார்க்கப்பட்ட பண்ணை' : 'Verified Farm')}</span>
              </div>
              <div>
                <span className="text-[#4E3629]/60">{t('marketplace.farmingMethod')}:</span> <span className="font-bold">{translateFarmingMethod(product.farmer?.farmingType || product.farmingMethod)}</span>
              </div>
              <div>
                <span className="text-[#4E3629]/60">{t('productDetails.farmerRating')}:</span> <span className="font-bold text-amber-600">{product.farmer?.rating || 5.0} ★</span>
              </div>
              <div>
                <span className="text-[#4E3629]/60">{t('productDetails.totalReviews')}:</span> <span className="font-bold">{product.farmer?.numReviews || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Pricing */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-[#74A12E]/15 px-3 py-1 text-xs font-bold text-[#74A12E]">
                {translateCategory(product.category)}
              </span>
              {product.farmingMethod && (
                <span className="rounded-full bg-[#4E3629]/15 px-3 py-1 text-xs font-bold text-[#4E3629]">
                  {translateFarmingMethod(product.farmingMethod)}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-black text-[#1E3F20]">{product.name}</h1>
            <div className="mt-2 flex items-center space-x-4 text-xs text-[#4E3629]/70">
              <span className="flex items-center"><MapPin className="mr-1 h-3.5 w-3.5 text-[#4E3629]/50" /> {product.location?.city}, {product.location?.state}</span>
              <span className="flex items-center"><Calendar className="mr-1 h-3.5 w-3.5 text-[#4E3629]/50" /> {t('productDetails.harvestDate')}: {new Date(product.harvestDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Pricing & Stock Banner */}
          <div className="rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#4E3629]/60">{t('productDetails.directPrice')}</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-black text-[#1E3F20]">₹{product.price}</span>
                  <span className="text-sm font-bold text-[#4E3629]/70">/ {translateUnit(product.unit)}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#4E3629]/60">{t('productDetails.stockAvailability')}</span>
                <p className="text-sm font-bold text-[#1E3F20]">
                  {product.quantityAvailable > 0 ? (
                    <span className="text-[#74A12E]">{product.quantityAvailable} {translateUnit(product.unit)} {t('productDetails.available')}</span>
                  ) : (
                    <span className="text-rose-600">{t('productDetails.outOfStock')}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Quantity Selector with 3D Mechanics */}
            <div className="mt-5 flex items-center justify-between border-t border-[#4E3629]/10 pt-4">
              <div>
                <label className="text-xs font-bold text-[#1E3F20]">{t('productDetails.orderQuantity')} ({translateUnit(product.unit)})</label>
                <p className="text-[11px] text-[#4E3629]/60">{t('productDetails.minOrder')}: {product.minimumOrderQuantity} {translateUnit(product.unit)}</p>
              </div>
              <QuantityStepper3D
                value={quantity}
                min={product.minimumOrderQuantity || 1}
                max={product.quantityAvailable || 9999}
                unit={translateUnit(product.unit)}
                onChange={setQuantity}
                size="md"
              />
            </div>
          </div>

          {/* Transparent Price Breakdown */}
          <PriceBreakdown
            subtotal={subtotal}
            platformFee={platformFee}
            deliveryFee={deliveryFee}
            totalAmount={totalAmount}
          />

          {/* Action Button with Spatial 3D Physics */}
          <Button3D
            variant={product.quantityAvailable <= 0 ? 'secondary' : 'primary'}
            size="lg"
            icon={ShoppingBag}
            onClick={handleAddToCart}
            disabled={product.quantityAvailable <= 0}
            className="w-full shadow-[#74A12E]/30"
          >
            {product.quantityAvailable <= 0
              ? t('productDetails.outOfStock')
              : `${t('productDetails.addToBasket')} • ₹${totalAmount.toLocaleString('en-IN')}`}
          </Button3D>

          {/* Description */}
          <div className="rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-[#1E3F20]">{t('productDetails.description')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4E3629]/80">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-12 rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#1E3F20]">{t('productDetails.customerReviews')} ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="mt-3 text-xs text-[#4E3629]/60">{t('productDetails.noReviews')}</p>
        ) : (
          <div className="mt-4 divide-y divide-[#4E3629]/10">
            {reviews.map((rev) => (
              <div key={rev._id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#1E3F20]">{rev.buyer?.name}</span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-[#4E3629]/60">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-xs text-[#4E3629]/80">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetailsPage;
