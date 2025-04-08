const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/verifyEmail', authController.verifyEmail);
router.post('/updatePassword', authController.updatePassword);
router.post('/requestLoginOTP', authController.requestLoginOTP);
router.post('/verifyLoginOTP', authController.verifyLoginOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


module.exports = router;