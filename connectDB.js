const db = require("./db");

const connectDB = () => {
    require("./models");

    return db.sync({force: false})
	.catch((err) => {
	    console.log("Failed to sync db: " + err.message);
	});
}

module.exports = connectDB