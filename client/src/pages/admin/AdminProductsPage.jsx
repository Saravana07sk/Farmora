import React, { useState, useEffect } from 'react';
import { Trash2, ShieldAlert } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products?limit=50');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products for moderation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this listing for policy violations?')) return;
    try {
      const res = await API.delete(`/products/${id}`);
      if (res.data.success) {
        alert('Listing removed successfully.');
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Produce Moderation</h1>
        <p className="text-xs text-slate-500">Audit produce listings, check quality claims, and remove non-compliant items</p>
      </div>

      {loading ? (
        <LoadingSpinner label="Fetching produce catalog..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-400">
                <th className="p-3.5">Produce Item</th>
                <th className="p-3.5">Farmer</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                  <td className="p-3.5">{p.farmer?.name} ({p.farmer?.farmName})</td>
                  <td className="p-3.5">{p.category}</td>
                  <td className="p-3.5 font-extrabold text-emerald-800">₹{p.price} / {p.unit}</td>
                  <td className="p-3.5">{p.quantityAvailable} {p.unit}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
                    >
                      Remove Listing
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

export default AdminProductsPage;
