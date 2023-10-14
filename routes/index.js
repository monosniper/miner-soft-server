const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const WithdrawController = require('../controllers/withdraw-controller')
const UserController = require('../controllers/user-controller')
const {body} = require('express-validator');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', authMiddleware, UserController.logout);

router.post('/withdraw', authMiddleware, WithdrawController.store);
router.put('/options', authMiddleware, UserController.update);

module.exports = router;