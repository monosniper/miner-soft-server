const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const WithdrawController = require('../controllers/withdraw-controller')
const UserController = require('../controllers/user-controller')
const {body} = require('express-validator');

router.get('/users', UserController.index);

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', authMiddleware, UserController.logout);
router.get('/refresh', UserController.refresh);

router.post('/withdraw', authMiddleware, WithdrawController.store);
router.put('/options', authMiddleware, UserController.update);
router.put('/balance', authMiddleware, UserController.updateBalance);

module.exports = router;