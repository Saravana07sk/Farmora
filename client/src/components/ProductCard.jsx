import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ShoppingBag, Star } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import Button3D from './ui/Button3D';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useProductAnimation } from './ProductToCartAnimation';
import { getImageUrl, handleImageError } from '../utils/imageUrl';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t, translateCategory, translateFarmingMethod, translateUnit } = useLanguage();
  const { triggerFlyToCart } = useProductAnimation();
  const cardRef = useRef(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Capture starting coordinates of the product image for the 3D flying trajectory
    if (cardRef.current) {
      const imgEl = cardRef.current.querySelector('img');
      const rect = imgEl ? imgEl.getBoundingClientRect() : cardRef.current.getBoundingClientRect();
      triggerFlyToCart({
        imageSrc,
        startRect: rect,
        productName: product.name,
      });
    }

    const res = await addToCart(product._id, product.minimumOrderQuantity || 1);
    if (!res?.success) {
      alert(res?.message || 'Could not add product');
    }
  };

  const imageSrc = getImageUrl(product.images?.[0]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={(e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
        setTilt({ x: y, y: x });
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-[#1E3F20]/15 hover:border-[#74A12E]/50"
    >
      {/* 3D Produce Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6EE]" style={{ transform: 'translateZ(20px)' }}>
        <img
          src={imageSrc}
          alt={product.name}
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Category Badge */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5" style={{ transform: 'translateZ(30px)' }}>
          <span className="rounded-full bg-[#FDFBF7]/95 px-2.5 py-1 text-xs font-bold text-[#1E3F20] shadow-sm backdrop-blur-md">
            {translateCategory(product.category)}
          </span>
        </div>

        {/* Farming Method Badge */}
        {product.farmingMethod && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5" style={{ transform: 'translateZ(30px)' }}>
            <span className="rounded-full bg-[#74A12E]/90 px-2.5 py-1 text-[11px] font-bold text-[#FDFBF7] shadow-sm">
              {translateFarmingMethod(product.farmingMethod)}
            </span>
          </div>
        )}

        {/* Subtle glass lighting overlay on hover */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 opacity-0 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : ''
          }`}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5" style={{ transform: 'translateZ(10px)' }}>
        {/* Farmer Info */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="truncate text-xs font-semibold text-[#4E3629]/75">
              {product.farmer?.farmName || product.farmer?.name || t('productCard.directFarm')}
            </span>
            <VerifiedBadge isVerified={product.isVerified || product.farmer?.isVerified} size="sm" />
          </div>
          {product.rating > 0 && (
            <div className="flex items-center text-xs font-bold text-amber-500 shrink-0">
              <Star className="mr-0.5 h-3.5 w-3.5 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug || product._id}`}>
          <h3 className="line-clamp-1 text-base font-bold text-[#1E3F20] transition-colors duration-200 group-hover:text-[#74A12E]">
            {product.name}
          </h3>
        </Link>

        {/* Location & MOQ */}
        <div className="mt-1 flex items-center justify-between text-xs text-[#4E3629]/70">
          <span className="flex items-center truncate">
            <MapPin className="mr-1 h-3.5 w-3.5 text-[#4E3629]/50 shrink-0" />
            <span className="truncate">{product.location?.city}, {product.location?.state}</span>
          </span>
          <span className="shrink-0 text-[11px] font-medium text-[#4E3629]/60">
            {t('productCard.moq')}: {product.minimumOrderQuantity} {translateUnit(product.unit)}
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-4 flex items-center justify-between border-t border-[#4E3629]/10 pt-3">
          <div>
            <span className="text-[11px] font-medium text-[#4E3629]/60">{t('productCard.directPrice')}</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-[#1E3F20]">
                ₹{product.price}
              </span>
              <span className="text-xs font-bold text-[#4E3629]/75">/ {translateUnit(product.unit)}</span>
            </div>
          </div>

          <Button3D
            variant={product.quantityAvailable <= 0 ? 'secondary' : 'primary'}
            size="sm"
            icon={ShoppingBag}
            onClick={handleAddToCart}
            disabled={product.quantityAvailable <= 0}
          >
            {product.quantityAvailable <= 0 ? t('productCard.outOfStock') : t('productCard.addToCart')}
          </Button3D>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
