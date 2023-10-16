const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const TokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const {uuid} = require("uuidv4");

class UserService {
    async register(name, username, password) {
	if (await UserModel.findOne({where: {username}})) {
	    throw ApiError.BadRequest('Пользователь с данным никнеймом уже существует');
	}

	const hashPassword = await bcrypt.hash(password, 1);

	const socket_token = uuid()
	const ref_code = Math.random().toString(36).slice(2).toUpperCase()

	const user = await UserModel.create({
	    username,
	    name,
	    password: hashPassword,
	    options: {},
	    token: socket_token,
	    ref_code
	});

	const userDto = new UserDto(user);
	const tokens = await TokenService.generateTokens({...userDto});

	await TokenService.saveToken(userDto.id, tokens.refreshToken);

	return {
	    ...tokens, user: userDto
	};
    }

    async login(username, password) {
	const user = await UserModel.findOne({where: {username}});

	if (!user) {
	    throw ApiError.BadRequest('Пользователя с таким логином не существует');
	}
	const isPassEquals = await bcrypt.compare(password, user.password);

	if (!isPassEquals) {
	    throw ApiError.BadRequest('Данные для входа не верны');
	}

	const userDto = new UserDto(user);
	const tokens = await TokenService.generateTokens({...userDto});

	await TokenService.saveToken(userDto.id, tokens.refreshToken);

	return {
	    ...tokens, user: userDto
	};
    }

    async logout(refreshToken) {
	return await TokenService.removeToken(refreshToken);
    }

    async updateUser(id, data) {
	const user = await UserModel.findByPk(id)
	await user.update(data)
	await user.save()

	return new UserDto(user);
    }

    async refresh(refreshToken) {
	if (!refreshToken) {
	    throw ApiError.UnauthorizedError();
	}

	const userData = TokenService.validateRefreshToken(refreshToken);
	const tokenData = TokenService.findToken(refreshToken);

	if (!userData || !tokenData) {
	    throw ApiError.UnauthorizedError();
	}

	const user = await UserModel.findByPk(userData.id);
	const userDto = new UserDto(user);
	const tokens = await TokenService.generateTokens({...userDto});

	await TokenService.saveToken(userDto.id, tokens.refreshToken);

	return {
	    ...tokens, user: userDto
	};
    }
}


module.exports = new UserService();