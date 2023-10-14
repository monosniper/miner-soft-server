const { Server } = require("socket.io");

const startSocketIOServer = () => {
    const io = new Server({ /* options */ });

    io.on("connection", (socket) => {
	console.log('new connection')
    });

    io.listen(process.env.SOCKET_IO_PORT);
}

module.exports = startSocketIOServer