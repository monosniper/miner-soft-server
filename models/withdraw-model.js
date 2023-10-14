const db = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class Withdraw extends Model {}

const model = Withdraw.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wallet: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
}, {
    sequelize: db,
    tableName: 'withdraws',
    timestamps: true,
    underscored: true
})

module.exports = model