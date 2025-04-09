// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// // router.post('/register', authController.registerUser);
// router.post('/login', authController.loginUser);
// router.post('/verifyEmail', authController.verifyEmail);
// router.post('/updatePassword', authController.updatePassword);
// router.post('/requestLoginOTP', authController.requestLoginOTP);
// router.post('/verifyLoginOTP', authController.verifyLoginOTP);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);


// module.exports = router;




const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication routes
// router.post('/register', authController.registerUser);

// New auth flow routes
router.post('/initiate-login', authController.initiateLogin); // Step 1: Email entry and OTP sending
router.post('/verify-login-otp', authController.verifyLoginOTP); // Step 2: OTP verification
router.post('/login', authController.loginUser); // Step 3: Password verification and login completion

router.post('/verifyEmail', authController.verifyEmail);
router.post('/updatePassword', authController.updatePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;