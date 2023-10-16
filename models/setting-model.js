const db = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class Setting extends Model {}

const model = Setting.init({
    id: {
	type: DataTypes.INTEGER,
	primaryKey: true,
	autoIncrement: true,
    },
    key: {
	type: DataTypes.STRING,
	unique: true
    },
    value: {
	type: DataTypes.STRING,
	allowNull: true
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
}, {
    sequelize: db,
    tableName: 'settings',
    timestamps: true,
    underscored: true
})

module.exports = model