const router = require('express').Router();
const authController = require('./controller');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { police_check } = require('../../middlewares');

passport.use(new localStrategy({ usernameField: 'email' }, authController.localStrategy));

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/me', authController.me);
router.get('/users',police_check('manage', 'all'), authController.users);

module.exports = router;
