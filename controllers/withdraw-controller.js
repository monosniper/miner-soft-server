const WithdrawService = require('../services/withdraw-service');

class UserController {
    async store(req, res, next) {
	try {
	    const {amount, wallet} = req.body;

	    await WithdrawService.store(amount, wallet, req.user.id);

	    return res.json({success: true});
	} catch (e) {
	    next(e);
	}
    }
}

module.exports = new UserController();