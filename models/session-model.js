const db = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class Session extends Model {}

const model = Session.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    data: {
        type: DataTypes.JSON,
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
}, {
    sequelize: db,
    tableName: 'sessions',
    timestamps: true,
    underscored: true
})

module.exports = model