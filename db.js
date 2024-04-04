const Sequelize = require('sequelize')

const sequelize = new Sequelize(
    'fc404394_minersoft',
    'fc404394_minersoft',
    '3pst+6T3-D',
    {
        host: 'fc404394.mysql.tools',
        dialect: 'mysql',
    },
);


module.exports = sequelize