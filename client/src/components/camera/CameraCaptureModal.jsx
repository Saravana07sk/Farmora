import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  RotateCw,
  Check,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Flashlight,
  Sliders,
} from 'lucide-react';
import API from '../../services/api';
import Button3D from '../ui/Button3D';

const CameraCaptureModal = ({ isOpen, onClose, onImageCaptured, title = 'Real Harvest Photo Capture' }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  // Initialize Camera Stream
  const startCamera = async (mode = facingMode) => {
    setCameraError('');
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your current browser.');
      }

      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera initialization issue:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser settings, or use the Native Camera / File Upload option below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on your device. You can upload an existing farm photo from your device.');
      } else {
        // Try fallback with simple constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play();
            setCameraActive(true);
            return;
          }
        } catch (fallbackErr) {
          setCameraError(err.message || 'Unable to open camera.');
        }
      }
      setCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Flip between front and rear cameras
  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Take Snapshot
  const capturePhoto = () => {
    if (!videoRef.current) return;

    // Trigger visual shutter flash
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (facingMode === 'user') {
      // Mirror front camera
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  // Confirm & Upload captured photo to backend
  const handleConfirmUpload = async () => {
    if (!capturedImage) return;

    try {
      setUploading(true);
      const res = await API.post('/upload/base64', {
        imageBase64: capturedImage,
        filenamePrefix: 'farmer-real-produce',
      });

      if (res.data.success) {
        onImageCaptured(res.data.url);
        onClose();
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert(err.response?.data?.message || 'Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Native input fallback (for mobile devices or if camera permission denied)
  const handleNativeFileInput = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        onImageCaptured(res.data.url);
        onClose();
      }
    } catch (err) {
      console.error('File upload failed:', err);
      alert(err.response?.data?.message || 'Failed to upload image file.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative z-10 flex flex-col w-full max-w-xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/20 bg-slate-900 text-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/90">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Camera className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">{title}</h3>
                <p className="text-[11px] text-white/60">Capture authentic harvest & produce in real-time</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Viewfinder / Preview Body */}
          <div className="relative flex-1 bg-black flex items-center justify-center min-h-[360px] max-h-[480px] overflow-hidden">
            {/* Shutter Flash Animation */}
            {flashEffect && (
              <div className="absolute inset-0 z-30 bg-white transition-opacity duration-150 pointer-events-none" />
            )}

            {capturedImage ? (
              /* Review Captured Snapshot */
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <img
                  src={capturedImage}
                  alt="Captured Produce"
                  className="max-h-[460px] w-full object-contain"
                />
                <div className="absolute top-3 left-3 rounded-full bg-emerald-700/90 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md flex items-center gap-1.5 border border-emerald-400/40">
                  <Check className="h-3.5 w-3.5" />
                  <span>Real Photo Captured</span>
                </div>
              </div>
            ) : cameraError ? (
              /* Camera Permission / Error Fallback Screen */
              <div className="p-8 text-center space-y-4 max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <h4 className="text-base font-bold text-white">Camera Permission Needed</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  {cameraError}
                </p>

                <div className="pt-2 flex flex-col gap-2.5">
                  <label className="cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition">
                    <Camera className="h-4 w-4" />
                    <span>Open Device Camera / Photo Library</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleNativeFileInput}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => startCamera(facingMode)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-bold text-white/80 hover:bg-white/10"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Retry Camera Access
                  </button>
                </div>
              </div>
            ) : (
              /* Active Live Viewfinder */
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />

                {/* Viewfinder Farm Target Reticle Overlay */}
                <div className="pointer-events-none absolute inset-8 border border-white/20 rounded-2xl flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-t-2 border-l-2 border-lime-400 rounded-tl-sm" />
                    <div className="w-5 h-5 border-t-2 border-r-2 border-lime-400 rounded-tr-sm" />
                  </div>
                  {/* Central Reticle */}
                  <div className="self-center flex items-center justify-center w-12 h-12 rounded-full border border-lime-400/40 bg-lime-400/10 backdrop-blur-xs">
                    <div className="w-2 h-2 rounded-full bg-lime-400 shadow-sm" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-b-2 border-l-2 border-lime-400 rounded-bl-sm" />
                    <div className="w-5 h-5 border-b-2 border-r-2 border-lime-400 rounded-br-sm" />
                  </div>
                </div>

                {/* Live Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-lime-400 backdrop-blur-md border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-lime-400 animate-ping" />
                  <span>LIVE VIEWFINDER</span>
                </div>

                {/* Camera Flip Control */}
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="absolute top-4 right-4 flex items-center gap-1 rounded-xl bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10 hover:bg-black/80 transition"
                  title="Switch between front and back camera"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>{facingMode === 'environment' ? 'Back Camera' : 'Front Camera'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Bar Footer */}
          <div className="p-4 sm:p-5 bg-slate-900 border-t border-white/10 flex items-center justify-between">
            {capturedImage ? (
              /* Review Actions: Retake vs Confirm */
              <>
                <Button3D
                  variant="secondary"
                  size="md"
                  onClick={handleRetake}
                  icon={RefreshCw}
                  disabled={uploading}
                >
                  Retake Photo
                </Button3D>

                <Button3D
                  variant="lime"
                  size="md"
                  onClick={handleConfirmUpload}
                  icon={Check}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading Photo...' : 'Use This Real Photo'}
                </Button3D>
              </>
            ) : (
              /* Live Capture Actions */
              <>
                <label className="cursor-pointer text-xs font-bold text-white/70 hover:text-white flex items-center gap-1.5 transition">
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">Use Native Camera / File</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleNativeFileInput}
                    className="hidden"
                  />
                </label>

                {/* Big Tactile Shutter Button */}
                <button
                  type="button"
                  onClick={capturePhoto}
                  disabled={!cameraActive}
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-lime-400 text-slate-950 shadow-xl transition-transform active:scale-90 hover:scale-105 ${
                    !cameraActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer ring-4 ring-lime-400/30'
                  }`}
                  title="Capture Photo"
                >
                  <div className="h-10 w-10 rounded-full border-2 border-slate-950 bg-lime-300" />
                </button>

                <div className="w-24 text-right">
                  <span className="text-[11px] font-semibold text-white/40">HD 1080p</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CameraCaptureModal;
