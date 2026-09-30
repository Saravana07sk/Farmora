import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ShoppingCart, LogOut, LayoutDashboard, Shield, ChevronDown, Menu, X, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useProductAnimation } from './ProductToCartAnimation';
import VerifiedBadge from './VerifiedBadge';
import Button3D from './ui/Button3D';

const Navbar = () => {
  const { user, logout, isAuthenticated, isFarmer, isAdmin, isBuyer } = useAuth();
  const { itemCount } = useCart();
  const { lang, toggleLang, t, translateRole, isTamil } = useLanguage();
  const { cartBouncing } = useProductAnimation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className={`agri-nav-sheen sticky top-0 z-40 w-full border-b backdrop-blur-md transition-all duration-300 ${
        isHome
          ? 'agri-nav-home border-[#FDFBF7]/10 shadow-sm'
          : 'border-[#4E3629]/15 bg-[#FDFBF7]/95 shadow-sm text-[#1E3F20]'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-md ${
              isHome
                ? 'bg-[#74A12E] text-[#FDFBF7] shadow-[#74A12E]/30'
                : 'bg-[#74A12E] text-[#FDFBF7] shadow-[#74A12E]/25'
            }`}
          >
            <Sprout className="h-6 w-6" />
          </motion.div>
          <div>
            <span className={`text-xl font-black tracking-tight ${isHome ? 'text-[#FDFBF7]' : 'text-[#1E3F20]'}`}>
              Agri<span className={isHome ? 'text-[#95CB41]' : 'text-[#74A12E]'}>Link</span>
            </span>
            <span className={`block text-[10px] font-semibold uppercase tracking-widest ${isHome ? 'text-[#FDFBF7]/60' : 'text-[#4E3629]/70'}`}>
              {t('nav.brandSub')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center space-x-7 md:flex">
          <Link
            to="/"
            className={`text-sm font-semibold transition ${
              isHome ? 'text-[#FDFBF7]/85 hover:text-[#95CB41]' : 'text-[#1E3F20]/80 hover:text-[#74A12E]'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/marketplace"
            className={`text-sm font-semibold transition ${
              isHome ? 'text-[#FDFBF7]/85 hover:text-[#95CB41]' : 'text-[#1E3F20]/80 hover:text-[#74A12E]'
            }`}
          >
            {t('nav.marketplace')}
          </Link>
          <Link
            to="/about"
            className={`text-sm font-semibold transition ${
              isHome ? 'text-[#FDFBF7]/85 hover:text-[#95CB41]' : 'text-[#1E3F20]/80 hover:text-[#74A12E]'
            }`}
          >
            {t('nav.pricing')}
          </Link>

          {isFarmer && (
            <Link
              to="/farmer/dashboard"
              className={`text-sm font-bold ${isHome ? 'text-[#95CB41] hover:text-white' : 'text-[#74A12E] hover:text-[#5C8223]'}`}
            >
              {t('nav.farmerPortal')}
            </Link>
          )}
          {isBuyer && (
            <Link
              to="/buyer/dashboard"
              className={`text-sm font-bold ${isHome ? 'text-[#95CB41] hover:text-white' : 'text-[#74A12E] hover:text-[#5C8223]'}`}
            >
              {t('nav.buyerPortal')}
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/dashboard" className="text-sm font-bold text-[#AD8B77] hover:text-[#4E3629]">
              {t('nav.adminPortal')}
            </Link>
          )}
        </nav>

        {/* Desktop Right Action Bar */}
        <div className="hidden items-center space-x-3.5 md:flex">
          {/* Language Switcher: English / தமிழ் */}
          <button
            type="button"
            onClick={toggleLang}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${
              isHome
                ? 'bg-white/15 text-[#FDFBF7] hover:bg-white/25 border border-white/25'
                : 'bg-[#FAF6EE] text-[#1E3F20] hover:bg-[#F4ECE0] border border-[#4E3629]/20'
            }`}
            title={isTamil ? 'Switch to English' : 'தமிழுக்கு மாற்றவும்'}
          >
            <Globe className="h-3.5 w-3.5 text-[#74A12E]" />
            <span className="font-tamil">{isTamil ? 'English' : 'தமிழ்'}</span>
          </button>

          {/* Cart Icon for Buyers */}
          {(!user || isBuyer) && (
            <motion.div
              id="navbar-cart-icon"
              animate={
                cartBouncing
                  ? { scale: [1, 1.35, 0.85, 1.15, 1], rotate: [0, -10, 10, -5, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            >
              <Link
                to="/buyer/cart"
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  isHome
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-[#FAF6EE] text-[#1E3F20] hover:bg-[#E8F5D0] hover:text-[#74A12E]'
                }`}
                title={t('nav.cartTitle')}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#74A12E] text-[11px] font-bold text-[#FDFBF7] shadow-sm"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          )}

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 rounded-xl border border-[#4E3629]/20 bg-[#FDFBF7] p-1.5 pr-3 shadow-sm transition hover:border-[#4E3629]/40"
              >
                <img
                  src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                  alt={user.name}
                  className="h-7 w-7 rounded-lg object-cover"
                />
                <span className="text-xs font-bold text-[#1E3F20]">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#4E3629]/60" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] py-2 shadow-xl ring-1 ring-black/5 z-50">
                  <div className="border-b border-[#4E3629]/10 px-4 py-2.5">
                    <p className="text-xs font-bold text-[#1E3F20]">{user.name}</p>
                    <p className="text-[11px] text-[#4E3629]/70 truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="rounded-full bg-[#FAF6EE] px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#4E3629]">
                        {translateRole(user.role)}
                      </span>
                      {user.role === 'farmer' && <VerifiedBadge isVerified={user.isVerified} size="sm" />}
                    </div>
                  </div>

                  <div className="py-1">
                    {isFarmer && (
                      <Link
                        to="/farmer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-[#1E3F20] hover:bg-[#FAF6EE]"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4 text-[#74A12E]" /> {t('nav.dashboard')}
                      </Link>
                    )}
                    {isBuyer && (
                      <Link
                        to="/buyer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-[#1E3F20] hover:bg-[#FAF6EE]"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4 text-[#74A12E]" /> {t('nav.dashboard')}
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-[#1E3F20] hover:bg-[#FAF6EE]"
                      >
                        <Shield className="mr-2 h-4 w-4 text-[#4E3629]" /> {t('nav.adminPortal')}
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-[#4E3629]/10 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> {t('nav.signOut')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className={`text-sm font-bold transition ${
                  isHome ? 'text-[#FDFBF7] hover:text-[#95CB41]' : 'text-[#1E3F20] hover:text-[#74A12E]'
                }`}
              >
                {t('nav.signIn')}
              </Link>
              <Link to="/register">
                <Button3D
                  variant="primary"
                  size="sm"
                >
                  {t('nav.register')}
                </Button3D>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Mobile Language Toggle */}
          <button
            type="button"
            onClick={toggleLang}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold shadow-sm ${
              isHome
                ? 'bg-white/15 text-[#FDFBF7] border border-white/20'
                : 'bg-[#FAF6EE] text-[#1E3F20] border border-[#4E3629]/20'
            }`}
          >
            <Globe className="h-3 w-3 text-[#74A12E]" />
            <span className="font-tamil">{isTamil ? 'EN' : 'தமிழ்'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`rounded-lg p-2 ${isHome ? 'text-white hover:bg-white/10' : 'text-[#1E3F20] hover:bg-[#FAF6EE]'}`}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[#4E3629]/15 bg-[#FDFBF7] px-4 pb-6 pt-2 md:hidden text-[#1E3F20]">
          <div className="space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-[#1E3F20] hover:bg-[#FAF6EE]"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-[#1E3F20] hover:bg-[#FAF6EE]"
            >
              {t('nav.marketplace')}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-[#1E3F20] hover:bg-[#FAF6EE]"
            >
              {t('nav.pricing')}
            </Link>

            {isFarmer && (
              <Link
                to="/farmer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-bold text-[#74A12E] hover:bg-[#FAF6EE]"
              >
                {t('nav.farmerPortal')}
              </Link>
            )}
            {isBuyer && (
              <Link
                to="/buyer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-bold text-[#74A12E] hover:bg-[#FAF6EE]"
              >
                {t('nav.buyerPortal')}
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center rounded-lg px-3 py-2 text-base font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="mr-2 h-5 w-5" /> {t('nav.signOut')}
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] px-4 py-2.5 text-center text-sm font-bold text-[#1E3F20]"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-[#74A12E] px-4 py-2.5 text-center text-sm font-bold text-[#FDFBF7]"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
