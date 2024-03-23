const express = require('express');
const { register, login, verifyUserAccount, reSendEmailVerificationLink, sendOtpCodeResetThePassword, reSendOtpCodeResetThePassword, verifyOtpCodeResetThePassword, resetThePassword } = require('../controllers/auth_controller');


const router = express.Router();


/**
 * @desc     Register New User
 * @route    /api/auth/register
 * @methods  POST
 * @access   public
 */
router.post('/register', register);


/**
 * @desc     Login User
 * @route    /api/auth/login
 * @methods  POST
 * @access   public
 */
router.post('/login', login);


/**
 * @desc     Verfiy User Account
 * @route    /api/verify-user-account/:token
 * @methods  GET
 * @access   public
 */
router.get('/verify-user-account/:token', verifyUserAccount);


/**
 * @desc     Re Send Email Verification Link
 * @route    /api/re-send-email-verification-link
 * @methods  POST
 * @access   public
 */
router.post('/re-send-email-verification-link', reSendEmailVerificationLink);


/**
 * @desc     Send OTP Code Reset The Password
 * @route    /api/send-otp-code-reset-the-password
 * @methods  POST
 * @access   public
 */
router.post('/send-otp-code-reset-the-password', sendOtpCodeResetThePassword);


/**
 * @desc     Re Send OTP Code Reset The Password
 * @route    /api/re-send-otp-code-reset-the-password/:token
 * @methods  POST
 * @access   public
 */
router.post('/re-send-otp-code-reset-the-password', reSendOtpCodeResetThePassword);


/**
 * @desc     Verfiy OTP Code Reset The Password
 * @route    /api/verify-otp-code-reset-the-password/:token
 * @methods  POST
 * @access   public
 */
router.post('/verify-otp-code-reset-the-password', verifyOtpCodeResetThePassword);


/**
 * @desc     Reset The Passwrord
 * @route    /api/reset-the-password
 * @methods  PUT
 * @access   public
 */
router.put('/reset-the-password', resetThePassword);


module.exports = router;