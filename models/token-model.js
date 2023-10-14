const db = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class Token extends Model {}

const model = Token.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
}, {
    sequelize: db,
    tableName: 'tokens',
    timestamps: true,
    underscored: true
})

module.exports = model