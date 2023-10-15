const Token = require('./token-model')
const Withdraw = require('./withdraw-model')
const Session = require('./session-model')
const User = require('./user-model')

Token.belongsTo(User, { as: 'User' })
Withdraw.belongsTo(User, { as: 'User' })
Session.belongsTo(User, { as: 'User' })