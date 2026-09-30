import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  CheckCircle,
  BarChart3,
  Users,
  ShieldAlert,
  FileText,
  Store,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import VerifiedBadge from './VerifiedBadge';

const Sidebar = () => {
  const { user, isFarmer, isBuyer, isAdmin } = useAuth();
  const { t, translateRole } = useLanguage();

  const activeStyle = 'flex items-center gap-3 rounded-xl bg-emerald-700 px-3.5 py-2.5 text-sm font-bold text-white shadow-sm';
  const inactiveStyle = 'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900';

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4">
      {/* User Info Header */}
      <div className="mb-6 rounded-2xl bg-slate-50 p-4 border border-slate-100">
        <div className="flex items-center space-x-3">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
            alt={user?.name}
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div className="overflow-hidden">
            <h4 className="truncate text-sm font-bold text-slate-900">{user?.name}</h4>
            <p className="capitalize text-xs font-semibold text-emerald-700">
              {translateRole(user?.role)} {t('sidebar.portalBadge')}
            </p>
          </div>
        </div>
        {isFarmer && (
          <div className="mt-3 border-t border-slate-200/60 pt-2">
            <VerifiedBadge isVerified={user?.isVerified} size="sm" />
            {!user?.isVerified && (
              <p className="mt-1 text-[11px] font-semibold text-amber-600">
                {t('sidebar.verificationPending')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="space-y-1">
        {isFarmer && (
          <>
            <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">{t('sidebar.farmerOps')}</p>
            <NavLink to="/farmer/dashboard" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <LayoutDashboard className="h-4 w-4" /> {t('sidebar.overview')}
            </NavLink>
            <NavLink to="/farmer/products" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <Package className="h-4 w-4" /> {t('sidebar.myListings')}
            </NavLink>
            <NavLink to="/farmer/products/new" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <PlusCircle className="h-4 w-4" /> {t('sidebar.addProduce')}
            </NavLink>
            <NavLink to="/farmer/orders" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <ShoppingBag className="h-4 w-4" /> {t('sidebar.customerOrders')}
            </NavLink>
            <NavLink to="/farmer/analytics" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <BarChart3 className="h-4 w-4" /> {t('sidebar.revenueAnalytics')}
            </NavLink>
            <NavLink to="/farmer/verification" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <CheckCircle className="h-4 w-4" /> {t('sidebar.verification')}
            </NavLink>
          </>
        )}

        {isBuyer && (
          <>
            <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">{t('sidebar.buyerPortal')}</p>
            <NavLink to="/buyer/dashboard" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <LayoutDashboard className="h-4 w-4" /> {t('sidebar.buyerDashboard')}
            </NavLink>
            <NavLink to="/marketplace" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <Store className="h-4 w-4" /> {t('sidebar.browseProduce')}
            </NavLink>
            <NavLink to="/buyer/cart" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <ShoppingBag className="h-4 w-4" /> {t('sidebar.shoppingCart')}
            </NavLink>
            <NavLink to="/buyer/orders" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <Package className="h-4 w-4" /> {t('sidebar.ordersHistory')}
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">{t('sidebar.platformControl')}</p>
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <LayoutDashboard className="h-4 w-4" /> {t('sidebar.adminMetrics')}
            </NavLink>
            <NavLink to="/admin/verifications" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <CheckCircle className="h-4 w-4" /> {t('sidebar.farmerVerifications')}
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <Users className="h-4 w-4" /> {t('sidebar.userManagement')}
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <ShieldAlert className="h-4 w-4" /> {t('sidebar.produceModeration')}
            </NavLink>
            <NavLink to="/admin/audit-logs" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              <FileText className="h-4 w-4" /> {t('sidebar.auditLogs')}
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
