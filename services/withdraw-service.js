const Withdraw = require('../models/withdraw-model')

class WithdrawService {
    async store(amount, wallet, user_id) {
	console.log(user_id)
	return await Withdraw.create({amount, wallet, user_id});
    }
}

module.exports = new WithdrawService();