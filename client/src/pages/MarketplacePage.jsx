import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import CategoryPills3D from '../components/3d/CategoryPills3D';
import Button3D from '../components/ui/Button3D';
import { useLanguage } from '../context/LanguageContext';

const MarketplacePage = () => {
  const { t, translateCategory, translateFarmingMethod, translateState, isTamil } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [farmingMethod, setFarmingMethod] = useState('All');
  const [locationState, setLocationState] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Other'];
  const farmingMethods = ['All', 'Organic', 'Natural / Hydroponic', 'Conventional'];
  const indianStates = ['All', 'Maharashtra', 'Punjab', 'Karnataka', 'Andhra Pradesh', 'Himachal Pradesh'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (farmingMethod !== 'All') params.append('farmingMethod', farmingMethod);
      if (locationState !== 'All') params.append('locationState', locationState);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (verifiedOnly) params.append('verifiedOnly', 'true');
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 12);

      const res = await API.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching marketplace produce:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, farmingMethod, locationState, verifiedOnly, sort, page]);

  // Handle Search submit / debounce
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setFarmingMethod('All');
    setLocationState('All');
    setMinPrice('');
    setMaxPrice('');
    setVerifiedOnly(false);
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="agri-market-hero mb-8">
        <p className="agri-kicker text-[#74A12E]">{isTamil ? 'நேரடி சந்தை • சரிபார்க்கப்பட்ட பண்ணைகள்' : 'Live shelf / verified network'}</p>
        <div className="relative z-10 mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-black tracking-tight text-[#FDFBF7] sm:text-5xl">{t('nav.marketplace')}</h1>
            <p className="mt-2 max-w-xl text-sm text-[#FDFBF7]/70">
              {isTamil
                ? 'இந்தியா முழுவதும் உள்ள சரிபார்க்கப்பட்ட விவசாயிகளிடமிருந்து புதிய விளைபொருட்களைப் பெறுங்கள்.'
                : 'Browse verified produce directly from farms across India.'}
            </p>
          </div>
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('marketplace.searchPlaceholder')}
              className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-11 pr-24 text-sm text-[#FDFBF7] outline-none backdrop-blur-md transition placeholder:text-white/40 focus:border-[#74A12E]"
            />
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-white/50" />
            <div className="absolute right-1.5 top-1.5">
              <Button3D
                variant="lime"
                size="sm"
                type="submit"
              >
                {isTamil ? 'தேடு' : 'Search'}
              </Button3D>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6 rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-5 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-[#4E3629]/10 pb-3">
            <h3 className="flex items-center text-sm font-bold text-[#1E3F20]">
              <SlidersHorizontal className="mr-2 h-4 w-4 text-[#74A12E]" /> {t('marketplace.filterHeading')}
            </h3>
            <button
              onClick={resetFilters}
              className="flex items-center text-xs font-semibold text-[#74A12E] hover:underline"
            >
              <RefreshCw className="mr-1 h-3 w-3" /> {t('marketplace.resetFilters')}
            </button>
          </div>

          {/* Verified Farmers Only Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer rounded-xl border border-[#74A12E]/25 bg-[#74A12E]/10 p-3">
              <span className="text-xs font-bold text-[#1E3F20]">{t('marketplace.verifiedOnly')}</span>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => {
                  setVerifiedOnly(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-[#74A12E]/40 text-[#74A12E] focus:ring-[#74A12E]"
              />
            </label>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#4E3629]/60">{t('marketplace.category')}</label>
            <div className="mt-2 space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`w-full text-left rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    category === cat
                      ? 'bg-[#74A12E] text-[#FDFBF7] font-bold shadow-sm'
                      : 'text-[#1E3F20]/80 hover:bg-[#FAF6EE] hover:text-[#1E3F20]'
                  }`}
                >
                  {translateCategory(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Location State */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#4E3629]/60">{t('marketplace.state')}</label>
            <select
              value={locationState}
              onChange={(e) => {
                setLocationState(e.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
            >
              {indianStates.map((st) => (
                <option key={st} value={st}>{st === 'All' ? t('marketplace.allStates') : translateState(st)}</option>
              ))}
            </select>
          </div>

          {/* Farming Method */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#4E3629]/60">{t('marketplace.farmingMethod')}</label>
            <select
              value={farmingMethod}
              onChange={(e) => {
                setFarmingMethod(e.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
            >
              {farmingMethods.map((fm) => (
                <option key={fm} value={fm}>{translateFarmingMethod(fm)}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#4E3629]/60">{t('marketplace.priceRange')}</label>
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="number"
                placeholder={t('marketplace.minPrice')}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
              <span className="text-[#4E3629]/40">-</span>
              <input
                type="number"
                placeholder={t('marketplace.maxPrice')}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
            </div>
            <button
              onClick={() => {
                setPage(1);
                fetchProducts();
              }}
              className="mt-2 w-full rounded-xl bg-[#FAF6EE] border border-[#4E3629]/15 py-1.5 text-xs font-bold text-[#1E3F20] hover:bg-[#74A12E] hover:text-[#FDFBF7] transition"
            >
              {isTamil ? 'விலை பொருத்துக' : 'Apply Price'}
            </button>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 space-y-6">
          {/* 3D Floating Category Switcher */}
          <div className="rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7]/80 p-2 shadow-sm backdrop-blur-md">
            <CategoryPills3D
              activeCategory={category}
              onSelectCategory={(cat) => {
                setCategory(cat);
                setPage(1);
              }}
            />
          </div>

          {/* Bar with Total Count and Sorting */}
          <div className="flex items-center justify-between rounded-2xl border border-[#4E3629]/15 bg-[#FDFBF7] p-4 shadow-sm">
            <span className="text-xs font-bold text-[#4E3629]/80">
              {isTamil
                ? <>மொத்தம் <span className="text-[#74A12E] font-extrabold">{pagination.total}</span> விளைபொருட்களில் {products.length} காட்டப்படுகிறது</>
                : <>Showing <span className="text-[#74A12E] font-extrabold">{products.length}</span> of {pagination.total} Produce Listings</>}
            </span>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-[#4E3629]/70">{isTamil ? 'வரிசைப்படுத்து:' : 'Sort By:'}</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2 text-xs font-bold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              >
                <option value="newest">{t('marketplace.sortNewest')}</option>
                <option value="price_asc">{t('marketplace.sortPriceLow')}</option>
                <option value="price_desc">{t('marketplace.sortPriceHigh')}</option>
                <option value="rating">{t('marketplace.sortRating')}</option>
                <option value="popularity">{isTamil ? 'மிகவும் பிரபலம்' : 'Most Popular'}</option>
              </select>
            </div>
          </div>

          {/* Grid Content */}
          {loading ? (
            <LoadingSpinner label={isTamil ? 'விளைபொருட்கள் தேடப்படுகிறது...' : 'Searching verified produce catalog...'} />
          ) : products.length === 0 ? (
            <EmptyState
              title={t('marketplace.noResults')}
              message={t('marketplace.tryClearing')}
              actionLabel={t('marketplace.resetFilters')}
              onAction={resetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition ${
                    page === p
                      ? 'bg-[#74A12E] text-[#FDFBF7] shadow-md'
                      : 'bg-[#FDFBF7] text-[#1E3F20] border border-[#4E3629]/20 hover:bg-[#FAF6EE]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
