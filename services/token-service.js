const TokenModel = require('../models/token-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class TokenService {
    async generateTokens(payload) {
	const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
	const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

	return {
	    accessToken,
	    refreshToken
	};
    }

    validateAccessToken(token) {
	try {
	    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
	} catch (e) {
	    return null;
	}
    }

    validateRefreshToken(token) {
	try {
	    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
	} catch (e) {
	    return null;
	}
    }

    async findUserToken(user_id) {
	return TokenModel.findOne({where: {user_id}});
    }

    async saveToken(user_id, refreshToken) {
	const tokenData = await TokenModel.findOne({where: {user_id}});

	if (await this.findUserToken(user_id)) {
	    tokenData.refreshToken = refreshToken;

	    return tokenData.save();
	}

	return TokenModel.create({user_id, refreshToken});
    }

    async removeToken(refreshToken) {
	return await TokenModel.destroy({where: {refreshToken}});
    }

    async findToken(refreshToken) {
	return await TokenModel.findOne({where: {refreshToken}});
    }
}

module.exports = new TokenService();