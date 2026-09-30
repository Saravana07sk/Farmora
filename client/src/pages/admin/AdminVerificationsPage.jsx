import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, FileText, ExternalLink } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import VerifiedBadge from '../../components/VerifiedBadge';

const AdminVerificationsPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/verifications');
      if (res.data.success) {
        setFarmers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch verification requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleReview = async (farmerId, action) => {
    if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this farmer's verification?`)) return;
    try {
      const res = await API.patch(`/admin/verifications/${farmerId}`, { action });
      if (res.data.success) {
        alert(res.data.message);
        fetchVerifications();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Farmer Verification Requests</h1>
        <p className="text-xs text-slate-500">Audit submitted land records and Kisan IDs to issue official Verified Farmer badges</p>
      </div>

      {loading ? (
        <LoadingSpinner label="Fetching farmer verification queue..." />
      ) : farmers.length === 0 ? (
        <EmptyState title="No pending verifications" message="All submitted farmer verification requests have been audited." />
      ) : (
        <div className="space-y-4">
          {farmers.map((farmer) => (
            <div key={farmer._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <img src={farmer.profileImage} alt={farmer.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{farmer.farmName || `${farmer.name}'s Farm`}</h3>
                    <p className="text-xs text-slate-500">{farmer.name} • {farmer.address?.city}, {farmer.address?.state}</p>
                  </div>
                </div>
                <VerifiedBadge isVerified={farmer.isVerified} size="md" />
              </div>

              {/* Farm Metadata */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
                <div>
                  <span className="text-slate-400">Farm Size:</span>
                  <p className="font-bold text-slate-800">{farmer.farmSize || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Farming Method:</span>
                  <p className="font-bold text-slate-800">{farmer.farmingType}</p>
                </div>
                <div>
                  <span className="text-slate-400">Crops Cultivated:</span>
                  <p className="font-bold text-slate-800">{farmer.crops?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Contact:</span>
                  <p className="font-bold text-slate-800">{farmer.phone}</p>
                </div>
              </div>

              {/* Documents Preview */}
              {farmer.verificationDocuments && farmer.verificationDocuments.length > 0 && (
                <div className="rounded-xl bg-slate-50 p-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Submitted Documents</span>
                  {farmer.verificationDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="flex items-center text-slate-700 font-semibold">
                        <FileText className="mr-2 h-4 w-4 text-emerald-700" /> {doc.docType}
                      </span>
                      <a
                        href={doc.docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center font-bold text-emerald-700 hover:underline"
                      >
                        View Document <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleReview(farmer._id, 'REJECT')}
                  className="flex items-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                >
                  <XCircle className="mr-1.5 h-4 w-4" /> Reject Request
                </button>
                <button
                  onClick={() => handleReview(farmer._id, 'APPROVE')}
                  className="flex items-center rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve & Grant Verified Badge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerificationsPage;
