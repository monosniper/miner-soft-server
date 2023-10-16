const Token = require('./token-model')
const Withdraw = require('./withdraw-model')
const Session = require('./session-model')
const User = require('./user-model')

Token.belongsTo(User, { as: 'User' })
Withdraw.belongsTo(User, { as: 'User' })
Session.belongsTo(User, { as: 'User' })

const { Model } = require("sequelize");
const sequelize = require("../db");

class UserRef extends Model {}
const UserRefThrough = UserRef.init({}, {
    sequelize,
    tableName: 'user_refs'
});

User.belongsToMany(User, { through: UserRefThrough, targetKey: 'ref_user_id', })