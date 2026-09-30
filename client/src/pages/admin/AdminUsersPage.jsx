import React, { useState, useEffect } from 'react';
import { Users, UserX, UserCheck, Shield } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/users${roleFilter !== 'All' ? `?role=${roleFilter}` : ''}`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const toggleUser = async (userId) => {
    try {
      const res = await API.patch(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        alert(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Toggle failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500">Monitor active buyers, farmers, and suspend non-compliant accounts</p>
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600"
        >
          <option value="All">All Roles</option>
          <option value="farmer">Farmers</option>
          <option value="buyer">Buyers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading platform users..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-400">
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Verification</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <img src={u.profileImage} alt={u.name} className="h-8 w-8 rounded-lg object-cover" />
                      <div>
                        <span>{u.name}</span>
                        <span className="block text-[10px] text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-extrabold uppercase text-slate-700">{u.role}</td>
                  <td className="p-3.5">{u.address?.city}, {u.address?.state}</td>
                  <td className="p-3.5">
                    {u.role === 'farmer' ? (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {u.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="p-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => toggleUser(u._id)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
                          u.isActive ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? 'Suspend' : 'Reactivate'}
                      </button>
                    )}
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

export default AdminUsersPage;
