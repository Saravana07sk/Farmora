import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button3D from '../components/ui/Button3D';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t, isTamil } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.success) {
        const role = res.user.role;
        if (role === 'farmer') navigate('/farmer/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
        else navigate('/buyer/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (!err.response
          ? (isTamil ? 'பின்னணி சேவையகத்துடன் இணைக்க முடியவில்லை.' : 'Cannot connect to backend server. Please verify the server is running.')
          : (isTamil ? 'உள்நுழைவு தோல்வியடைந்தது. விவரங்களைச் சரிபார்க்கவும்.' : 'Login failed. Please check credentials.'))
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-[#4E3629]/15 bg-[#FDFBF7] p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#74A12E] text-[#FDFBF7] shadow-md shadow-[#74A12E]/30">
            <Sprout className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-[#1E3F20]">{t('auth.loginTitle')}</h2>
          <p className="mt-1 text-xs text-[#4E3629]/70">{t('auth.loginSub')}</p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#1E3F20]">{t('auth.email')}</label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-3 pl-10 text-sm font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[#4E3629]/50" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1E3F20]">{t('auth.password')}</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#4E3629]/20 bg-[#FAF6EE] p-3 pl-10 text-sm font-semibold text-[#1E3F20] outline-none focus:border-[#74A12E]"
              />
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#4E3629]/50" />
            </div>
          </div>

          <Button3D
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full"
          >
            {loading ? t('auth.signingIn') : t('auth.signInBtn')}
          </Button3D>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="rounded-2xl border border-[#4E3629]/15 bg-[#FAF6EE] p-4">
          <p className="text-xs font-bold uppercase text-[#1E3F20] mb-2">{t('auth.demoBoxTitle')}</p>
          <div className="flex flex-wrap gap-2">
            <Button3D
              size="sm"
              variant="primary"
              onClick={() => fillDemoAccount('farmer@agrilink.demo', 'Password123!')}
            >
              {t('auth.farmerDemo')}
            </Button3D>
            <Button3D
              size="sm"
              variant="primary"
              onClick={() => fillDemoAccount('buyer@agrilink.demo', 'Password123!')}
            >
              {t('auth.buyerDemo')}
            </Button3D>
            <Button3D
              size="sm"
              variant="accent"
              onClick={() => fillDemoAccount('admin@agrilink.demo', 'Password123!')}
            >
              {t('auth.adminDemo')}
            </Button3D>
          </div>
        </div>

        <p className="text-center text-xs text-[#4E3629]/70">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-bold text-[#74A12E] hover:underline">
            {t('auth.registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
