const db = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class User extends Model {}

const model = User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    },
    options: {
        type: DataTypes.JSON,
    },
    balance: {
        type: DataTypes.JSON,
    },
    token: {
        type: DataTypes.STRING,
        unique: true
    },
    ref_code: {
        type: DataTypes.STRING,
        unique: true
    },
    isPro: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
}, {
    sequelize: db,
    tableName: 'users',
    timestamps: true,
    underscored: true
})

module.exports = model