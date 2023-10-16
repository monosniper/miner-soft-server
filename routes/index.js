const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const WithdrawController = require('../controllers/withdraw-controller')
const UserController = require('../controllers/user-controller')
const SettingController = require('../controllers/setting-controller')

router.get('/users', UserController.index);

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', authMiddleware, UserController.logout);
router.post('/refresh', UserController.refresh);

router.post('/withdraw', authMiddleware, WithdrawController.store);
router.put('/options', authMiddleware, UserController.update);
router.put('/balance', authMiddleware, UserController.updateBalance);

router.get('/settings', SettingController.index);
router.put('/settings', SettingController.update);

router.put('/pro', UserController.makePro);

module.exports = router;