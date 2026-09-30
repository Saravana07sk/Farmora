import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, User, Mail, Lock, Phone, MapPin, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'farmer' ? 'farmer' : 'buyer';

  const [role, setRole] = useState(defaultRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    farmName: '',
    farmSize: '',
    farmingType: 'Organic',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { t, translateFarmingMethod, translateRole, isTamil } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register({ ...formData, role });
      if (res?.success) {
        if (role === 'farmer') navigate('/farmer/dashboard');
        else navigate('/buyer/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (isTamil ? 'பதிவு தோல்வியடைந்தது. உள்ளீடுகளைச் சரிபார்க்கவும்.' : 'Registration failed. Check inputs.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6 rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#74A12E] text-[#FDFBF7] shadow-md shadow-[#74A12E]/30">
            <Sprout className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-[#1E3F20]">{t('auth.registerTitle')}</h2>
          <p className="mt-1 text-xs text-[#4E3629]/70">{t('auth.registerSub')}</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#FAF6EE] border border-[#4E3629]/15 p-1.5">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`rounded-xl py-2.5 text-xs font-bold transition ${
              role === 'buyer' ? 'bg-[#74A12E] text-[#FDFBF7] shadow-sm' : 'text-[#1E3F20]/70 hover:text-[#1E3F20]'
            }`}
          >
            {t('auth.buyerRoleTab')}
          </button>
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`rounded-xl py-2.5 text-xs font-bold transition ${
              role === 'farmer' ? 'bg-[#74A12E] text-[#FDFBF7] shadow-sm' : 'text-[#1E3F20]/70 hover:text-[#1E3F20]'
            }`}
          >
            {t('auth.farmerRoleTab')}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#1E3F20]">{t('auth.fullName')}</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t('auth.namePlaceholder')}
                className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-sm font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E3F20]">{t('auth.email')}</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.emailPlaceholder')}
                className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-sm font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#1E3F20]">{t('auth.phone')}</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-sm font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E3F20]">{t('auth.password')}</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-sm font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
            </div>
          </div>

          {/* Farmer Specific Fields */}
          {role === 'farmer' && (
            <div className="rounded-2xl border border-[#4E3629]/15 bg-[#FAF6EE] p-4 space-y-3">
              <p className="text-xs font-bold uppercase text-[#1E3F20]">{t('auth.farmDetails')}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-bold text-[#1E3F20]">{t('auth.farmName')}</label>
                  <input
                    type="text"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleChange}
                    placeholder={t('auth.farmNamePlaceholder')}
                    className="mt-1 w-full rounded-xl border border-[#4E3629]/20 p-2 text-xs font-semibold outline-none focus:border-[#74A12E] bg-[#FDFBF7] text-[#1E3F20]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1E3F20]">{t('auth.farmSize')}</label>
                  <input
                    type="text"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    placeholder={t('auth.farmSizePlaceholder')}
                    className="mt-1 w-full rounded-xl border border-[#4E3629]/20 p-2 text-xs font-semibold outline-none focus:border-[#74A12E] bg-[#FDFBF7] text-[#1E3F20]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1E3F20]">{t('auth.farmingType')}</label>
                  <select
                    name="farmingType"
                    value={formData.farmingType}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-[#4E3629]/20 p-2 text-xs font-semibold outline-none focus:border-[#74A12E] bg-[#FDFBF7] text-[#1E3F20]"
                  >
                    <option value="Organic">{translateFarmingMethod('Organic')}</option>
                    <option value="Natural / Hydroponic">{translateFarmingMethod('Natural / Hydroponic')}</option>
                    <option value="Conventional">{translateFarmingMethod('Conventional')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Location Address */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-[#1E3F20]">{t('auth.cityDistrict')}</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder={isTamil ? 'சேலம் / திருச்சி' : 'Nashik'}
                className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E3F20]">{t('auth.state')}</label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder={isTamil ? 'தமிழ்நாடு' : 'Maharashtra'}
                className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#1E3F20]">{t('auth.pincode')}</label>
              <input
                type="text"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                placeholder="636001"
                className="mt-1 w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-2.5 text-xs font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#82B134] to-[#74A12E] py-3.5 text-sm font-extrabold text-[#FDFBF7] shadow-md shadow-[#74A12E]/25 transition hover:brightness-105"
          >
            {loading ? t('auth.creatingAccount') : `${t('auth.createAccountBtn')} ${translateRole(role)}`}
          </button>
        </form>

        <p className="text-center text-xs text-[#4E3629]/70">
          {t('auth.alreadyAccount')}{' '}
          <Link to="/login" className="font-bold text-[#74A12E] hover:underline">
            {t('auth.signInHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
