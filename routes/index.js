const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const WithdrawController = require('../controllers/withdraw-controller')
const UserController = require('../controllers/user-controller')
const SettingController = require('../controllers/setting-controller')
const User = require('../models/user-model')

router.get('/users', UserController.index)

router.get('/me', authMiddleware, UserController.me);

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', authMiddleware, UserController.logout);
router.post('/refresh', UserController.refresh);

router.post('/withdraw', authMiddleware, WithdrawController.store);
router.put('/options', authMiddleware, UserController.update);
router.put('/balance', authMiddleware, UserController.updateBalance);

router.get('/settings', SettingController.index);
router.put('/settings', SettingController.update);

router.put('/make/default', UserController.makeDefault);
router.put('/make/pro', UserController.makePro);


router.get('/test', async (req, res, next) => {
    const user = await User.findByPk(1)

    return res.json({test: user.createdAt.getSeconds()})
});

module.exports = router;