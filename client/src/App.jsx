import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { useAuth } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProductsPage from './pages/farmer/FarmerProductsPage';
import FarmerProductFormPage from './pages/farmer/FarmerProductFormPage';
import FarmerOrdersPage from './pages/farmer/FarmerOrdersPage';
import FarmerOrderDetailPage from './pages/farmer/FarmerOrderDetailPage';
import FarmerVerificationPage from './pages/farmer/FarmerVerificationPage';
import FarmerAnalyticsPage from './pages/farmer/FarmerAnalyticsPage';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import CartPage from './pages/buyer/CartPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import BuyerOrdersPage from './pages/buyer/BuyerOrdersPage';
import BuyerOrderDetailPage from './pages/buyer/BuyerOrderDetailPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVerificationsPage from './pages/admin/AdminVerificationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs text-slate-500">Authenticating...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
      <Route path="/marketplace" element={<MainLayout><MarketplacePage /></MainLayout>} />
      <Route path="/products/:slug" element={<MainLayout><ProductDetailsPage /></MainLayout>} />
      <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />

      {/* Farmer Portal */}
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <DashboardLayout><FarmerDashboard /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/products"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <DashboardLayout><FarmerProductsPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/products/new"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <DashboardLayout><FarmerProductFormPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/products/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <DashboardLayout><FarmerProductFormPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/orders"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <DashboardLayout><FarmerOrdersPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <DashboardLayout><FarmerOrderDetailPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/verification"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <DashboardLayout><FarmerVerificationPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/analytics"
        element={
          <ProtectedRoute allowedRoles={['farmer', 'admin']}>
            <DashboardLayout><FarmerAnalyticsPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Buyer Portal */}
      <Route
        path="/buyer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['buyer', 'admin']}>
            <DashboardLayout><BuyerDashboard /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/buyer/cart" element={<MainLayout><CartPage /></MainLayout>} />
      <Route
        path="/buyer/checkout"
        element={
          <ProtectedRoute allowedRoles={['buyer', 'admin']}>
            <MainLayout><CheckoutPage /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/orders"
        element={
          <ProtectedRoute allowedRoles={['buyer', 'admin']}>
            <DashboardLayout><BuyerOrdersPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['buyer', 'admin']}>
            <DashboardLayout><BuyerOrderDetailPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Portal */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/verifications"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminVerificationsPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminUsersPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminProductsPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminAuditLogsPage /></DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
