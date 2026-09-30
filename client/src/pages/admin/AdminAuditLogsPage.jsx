import React, { useState, useEffect } from 'react';
import { FileText, Clock } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/audit-logs');
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <LoadingSpinner label="Fetching platform audit trail..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Platform Audit Logs</h1>
        <p className="text-xs text-slate-500">Immutable audit log tracking registrations, verifications, orders, and status updates</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-400">
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">Target Entity</th>
              <th className="p-3.5">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-slate-50">
                <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-3.5 font-bold text-slate-900">
                  {log.user ? `${log.user.name} (${log.user.role})` : 'System'}
                </td>
                <td className="p-3.5 font-extrabold text-emerald-800">{log.action}</td>
                <td className="p-3.5 font-mono text-[11px]">{log.entity} (#{log.entityId?.slice(-6)})</td>
                <td className="p-3.5 font-mono text-[11px] text-slate-600">
                  {JSON.stringify(log.metadata || {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogsPage;
