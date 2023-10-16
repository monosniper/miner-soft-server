const UserService = require('../services/user-service');
const ApiError = require("../exceptions/api-error");
const User = require('../models/user-model')
const UserDto = require('../dtos/user-dto')

class UserController {
    async index(req, res, next) {
	const users = await User.findAll({include: [
	    {model: User, as: 'refs'}
	]})
	return res.json(users.map(user => new UserDto(user)))
    }

    async register(req, res, next) {
	try {
	    const {name, username, password, ref_code} = req.body;

	    const errors = []

	    !username && errors.push('Никнейм обязателен к заполнению')
	    !name && errors.push('Имя обязательно к заполнению')
	    !password && errors.push('Пароль обязателен к заполнению')

	    if (errors.length) {
		next(ApiError.BadRequest('Ошибка валидации', errors));
	    }

	    const userData = await UserService.register(name, username, password, ref_code);

	    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true});

	    return res.json(userData);
	} catch (e) {
	    next(e);
	}
    }

    async login(req, res, next) {
	try {
	    const {username, password} = req.body;
	    const userData = await UserService.login(username, password);

	    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true});

	    return res.json(userData);
	} catch (e) {
	    next(e);
	}
    }

    async logout(req, res, next) {
	try {
	    const {refreshToken} = req.cookies;
	    const token = await UserService.logout(refreshToken);

	    res.clearCookie('refreshToken');

	    return res.json(token);
	} catch (e) {
	    next(e);
	}
    }

    async update(req, res, next) {
	try {
	    const user = await UserService.updateUser(req.user.id, {options: req.body});
	    return res.json(user);
	} catch (e) {
	    next(e)
	}
    }

    async refresh(req, res, next) {
	try {
	    const {refreshToken} = req.body;
	    const userData = await UserService.refresh(refreshToken);

	    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true});

	    return res.json(userData);

	} catch (e) {
	    next(e);
	}
    }

    async updateBalance(req, res, next) {
	try {
	    const user = await UserService.updateUser(req.user.id, {balance: req.body});
	    return res.json(user);
	} catch (e) {
	    next(e)
	}
    }

    async makePro(req, res, next) {
	try {
	    const user = await UserService.updateUser(req.body.id, {status: 'pro'});
	    return res.json(user);
	} catch (e) {
	    next(e)
	}
    }

    async makeDefault(req, res, next) {
	try {
	    const user = await UserService.updateUser(req.body.id, {status: 'default'});
	    return res.json(user);
	} catch (e) {
	    next(e)
	}
    }
}

module.exports = new UserController();