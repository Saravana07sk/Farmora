const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, upload.single('profileImage'), updateProfile);

module.exports = router;
