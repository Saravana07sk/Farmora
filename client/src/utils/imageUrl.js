/**
 * Helper to ensure image URLs (local uploads, data URLs, remote URLs) are correctly formatted
 */
export const DEFAULT_PRODUCE_IMAGE =
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800';

export const getImageUrl = (image) => {
  if (!image || typeof image !== 'string' || !image.trim()) {
    return DEFAULT_PRODUCE_IMAGE;
  }

  const clean = image.trim();

  // Web remote URLs or data URLs
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  // Already prefixed with leading slash
  if (clean.startsWith('/uploads/')) {
    return clean;
  }

  // Relative path without leading slash
  if (clean.startsWith('uploads/')) {
    return `/${clean}`;
  }

  return clean;
};

export const handleImageError = (e) => {
  if (e.target.src !== DEFAULT_PRODUCE_IMAGE) {
    e.target.src = DEFAULT_PRODUCE_IMAGE;
  }
};
