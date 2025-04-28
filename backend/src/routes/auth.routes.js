const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/login',authController.login)

router.post('/register', authController.register)

router.get('/me', authMiddleware, authController.getMe);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

router.post('/me/:id', authMiddleware, authController.update);

router.delete('/me/delete-account/:id', authMiddleware, authController.delete);

module.exports = router;

