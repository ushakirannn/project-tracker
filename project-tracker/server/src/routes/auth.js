const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

router.get('/me', authMiddleware, authController.getMe);
router.get('/users', authMiddleware, authController.getAllUsers);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
