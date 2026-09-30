import React, { useState } from 'react';
import { ShieldCheck, Upload, CheckCircle2, FileText, Camera } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import VerifiedBadge from '../../components/VerifiedBadge';
import CameraCaptureModal from '../../components/camera/CameraCaptureModal';
import Button3D from '../../components/ui/Button3D';

const FarmerVerificationPage = () => {
  const { user, updateProfileState } = useAuth();
  const [formData, setFormData] = useState({
    farmName: user?.farmName || '',
    farmSize: user?.farmSize || '',
    farmingType: user?.farmingType || 'Organic',
    crops: Array.isArray(user?.crops) ? user.crops.join(', ') : '',
    docType: 'Land Records (7/12 Extract)',
  });
  const [file, setFile] = useState(null);
  const [cameraDocUrl, setCameraDocUrl] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCameraCaptured = async (url) => {
    setCameraDocUrl(url);
    // Fetch the uploaded image blob to attach to FormData
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const capturedFile = new File([blob], 'farm-verification-photo.jpg', { type: 'image/jpeg' });
      setFile(capturedFile);
    } catch (e) {
      console.warn('Could not convert camera url to file object:', e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('farmName', formData.farmName);
      data.append('farmSize', formData.farmSize);
      data.append('farmingType', formData.farmingType);
      data.append('crops', formData.crops);
      data.append('docType', formData.docType);
      if (file) data.append('document', file);

      const res = await API.post('/farmer/verification', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setMessage('Verification documents submitted successfully! Admin review in progress.');
        updateProfileState(res.data.data);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-black text-slate-900">Farmer Profile Verification</h1>
          <VerifiedBadge isVerified={user?.isVerified} size="md" />
        </div>
        <p className="text-xs text-slate-500">
          Verified farmers receive the official Verified Farmer badge on all produce listings.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
        <p className="text-xs font-bold text-emerald-900">Current Status: <span className="uppercase">{user?.verificationStatus || 'PENDING'}</span></p>
        {user?.isVerified && (
          <p className="mt-1 text-xs text-emerald-700 font-semibold flex items-center">
            <CheckCircle2 className="mr-1 h-4 w-4" /> Profile Verified! Your produce displays the Verified badge.
          </p>
        )}
      </div>

      {message && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 shadow-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold text-slate-700">Farm Name</label>
            <input
              type="text"
              name="farmName"
              required
              value={formData.farmName}
              onChange={handleChange}
              placeholder="e.g. Patel Organic Farm"
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Farm Size (Acres / Hectares)</label>
            <input
              type="text"
              name="farmSize"
              required
              value={formData.farmSize}
              onChange={handleChange}
              placeholder="e.g. 10 Acres"
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold text-slate-700">Farming Method</label>
            <select
              name="farmingType"
              value={formData.farmingType}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600 bg-white"
            >
              <option value="Organic">Organic</option>
              <option value="Natural / Hydroponic">Natural / Hydroponic</option>
              <option value="Conventional">Conventional</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Primary Crops (Comma-separated)</label>
            <input
              type="text"
              name="crops"
              value={formData.crops}
              onChange={handleChange}
              placeholder="Tomatoes, Onions, Wheat"
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700">Document Type</label>
          <select
            name="docType"
            value={formData.docType}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600 bg-white"
          >
            <option value="Land Records (7/12 Extract)">Land Records (7/12 Extract)</option>
            <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC)</option>
            <option value="Farmer Aadhaar / Govt ID">Farmer Govt ID</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700">Verification Document / Farm Photo</label>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button3D
              type="button"
              variant="primary"
              size="sm"
              icon={Camera}
              onClick={() => setIsCameraOpen(true)}
            >
              Take Photo with Camera
            </Button3D>

            <label className="cursor-pointer">
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setCameraDocUrl('');
                }}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              <span className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                <Upload className="h-3.5 w-3.5" />
                <span>{file && !cameraDocUrl ? file.name : 'Choose File from Device'}</span>
              </span>
            </label>
          </div>

          {/* Captured Document Preview */}
          {cameraDocUrl && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3">
              <img
                src={cameraDocUrl}
                alt="Document Snapshot"
                className="h-16 w-20 rounded-xl object-cover border border-emerald-300 shadow-sm"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Photo Captured from Camera
                </p>
                <p className="text-[11px] text-emerald-700">Ready to submit with your verification application.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCameraDocUrl('');
                  setFile(null);
                }}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <Button3D
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full shadow-emerald-900/20"
        >
          {loading ? 'Submitting Documents...' : 'Submit Verification Request'}
        </Button3D>
      </form>

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCaptured={handleCameraCaptured}
        title="Capture Document / Farm Location Photo"
      />
    </div>
  );
};

export default FarmerVerificationPage;
