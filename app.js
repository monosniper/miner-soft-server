require('dotenv').config()

const connectDB = require("./connectDB");
const startExpressServer = require("./startExpressServer");
const startSocketIOServer = require("./startSocketIOServer");

connectDB().then(() => {
    const httpServer = startExpressServer()
    startSocketIOServer(httpServer)
})