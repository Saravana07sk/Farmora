const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// @desc    Upload image file (multipart/form-data)
// @route   POST /api/upload
// @access  Private
router.post('/', authenticate, upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file was uploaded.',
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully.',
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Upload base64 snapshot directly from camera viewfinder
// @route   POST /api/upload/base64
// @access  Private
router.post('/base64', authenticate, async (req, res, next) => {
  try {
    const { imageBase64, filenamePrefix = 'camera' } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid base64 image string.',
      });
    }

    // Extract base64 data and mime type
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base64 image format.',
      });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const ext = mimeType === 'image/png' ? '.png' : mimeType === 'image/webp' ? '.webp' : '.jpg';

    const filename = `${filenamePrefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filePath, Buffer.from(base64Data, 'base64'));

    const fileUrl = `/uploads/${filename}`;
    res.json({
      success: true,
      message: 'Camera snapshot saved successfully.',
      url: fileUrl,
      filename,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
