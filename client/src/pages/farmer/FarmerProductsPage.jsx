import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

const FarmerProductsPage = () => {
  const { user } = useAuth();
  const { t, translateCategory, translateUnit, translateStatus } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFarmerProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/farmer/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch farmer listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('farmer.deleteConfirm'))) return;
    try {
      const res = await API.delete(`/products/${id}`);
      if (res.data.success) {
        alert(t('farmer.deletedMsg'));
        fetchFarmerProducts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('farmer.myListings')}</h1>
          <p className="text-xs text-slate-500">{t('farmer.manageSub')}</p>
        </div>

        <Link
          to="/farmer/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4" /> {t('farmer.addBtn')}
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label={t('farmer.loadingInventory')} />
      ) : products.length === 0 ? (
        <EmptyState
          title={t('farmer.noListings')}
          message={t('farmer.noListingsSub')}
          actionLabel={t('farmer.addFirstBtn')}
          onAction={() => window.location.href = '/farmer/products/new'}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-400">
                <th className="p-3.5">{t('farmer.tableProduce')}</th>
                <th className="p-3.5">{t('farmer.tableCategory')}</th>
                <th className="p-3.5">{t('farmer.tablePrice')}</th>
                <th className="p-3.5">{t('farmer.tableStock')}</th>
                <th className="p-3.5">{t('farmer.tableHarvest')}</th>
                <th className="p-3.5">{t('farmer.tableStatus')}</th>
                <th className="p-3.5 text-right">{t('farmer.tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getImageUrl(p.images?.[0])}
                        alt={p.name}
                        onError={handleImageError}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-100 shadow-sm"
                      />
                      <div>
                        <span>{p.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">{translateCategory(p.category)}</td>
                  <td className="p-3.5 font-extrabold text-emerald-800">₹{p.price} / {translateUnit(p.unit)}</td>
                  <td className="p-3.5 font-bold">{p.quantityAvailable} {translateUnit(p.unit)}</td>
                  <td className="p-3.5">{new Date(p.harvestDate).toLocaleDateString()}</td>
                  <td className="p-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {translateStatus(p.status)}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <Link
                      to={`/farmer/products/${p._id}/edit`}
                      className="inline-flex p-1.5 text-slate-500 hover:text-emerald-700"
                      title={t('farmer.edit')}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="inline-flex p-1.5 text-slate-400 hover:text-rose-600"
                      title={t('farmer.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FarmerProductsPage;
