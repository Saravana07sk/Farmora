import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react';
import CameraCaptureModal from './CameraCaptureModal';
import Button3D from '../ui/Button3D';
import API from '../../services/api';

const ProduceImageUploader = ({
  value = '',
  onChange,
  label = 'Produce Real Harvest Photo',
  required = false,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle image selected via Camera Modal
  const handleCameraPhotoCaptured = (url) => {
    onChange(url);
    setIsCameraOpen(false);
  };

  // Handle native file input (gallery or mobile native camera)
  const handleNativeFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        onChange(res.data.url);
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert(err.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500" /> Real farm photos build 3x more buyer trust
        </span>
      </div>

      {value ? (
        /* Preview of Uploaded Real Image */
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-slate-900 shadow-md aspect-[16/9] max-h-56 group">
          <img
            src={value}
            alt="Uploaded Produce"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Real Photo Badge */}
          <div className="absolute top-3 left-3 rounded-full bg-emerald-700/90 px-3 py-1 text-[11px] font-black text-white shadow-md backdrop-blur-md flex items-center gap-1.5 border border-emerald-400/40">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Real Harvest Photo</span>
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
            <span className="text-xs font-semibold text-white/80 truncate max-w-[200px]">
              {value.startsWith('/uploads') ? 'Uploaded Local Photo' : value}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center gap-1 rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md transition"
                title="Retake with Camera"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retake</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="flex items-center gap-1 rounded-xl bg-rose-600/80 hover:bg-rose-600 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md transition"
                title="Remove photo"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Image Selection Controls (Camera / Gallery / URL) */
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-5 text-center transition hover:border-emerald-500 hover:bg-emerald-50/30">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-sm mb-3">
            <Camera className="h-6 w-6" />
          </div>

          <h4 className="text-sm font-bold text-slate-800">
            Snap Real Produce Photo from Farm
          </h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Take a real photo with your phone or laptop camera right now, or upload from your gallery.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {/* 1. Live Camera Button */}
            <Button3D
              type="button"
              variant="primary"
              size="md"
              icon={Camera}
              onClick={() => setIsCameraOpen(true)}
            >
              Open Live Camera
            </Button3D>

            {/* 2. Device Gallery / Native Camera */}
            <label className="cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleNativeFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <span className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-emerald-700 transition">
                <Upload className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Choose File / Camera'}</span>
              </span>
            </label>

            {/* 3. Toggle Web URL */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>{showUrlInput ? 'Hide URL input' : 'Paste Image URL'}</span>
            </button>
          </div>

          {/* Fallback Web URL Input */}
          {showUrlInput && (
            <div className="mt-4 pt-3 border-t border-slate-200/70 max-w-md mx-auto flex items-center gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
              />
            </div>
          )}
        </div>
      )}

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCaptured={handleCameraPhotoCaptured}
        title="Snap Real Harvest Produce Photo"
      />
    </div>
  );
};

export default ProduceImageUploader;
