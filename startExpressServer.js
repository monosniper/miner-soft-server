const express = require('express');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error-middleware')
const cors = require("cors");
const indexRouter = require('./routes/index');
const {createServer} = require("http");

const startExpressServer = () => {
    const app = express();
    const server = createServer(app)

    const corsOptions = {
	credentials: true,
	// origin: [
	//     process.env.ADMIN_ORIGIN,
	//     process.env.DEV ? "http://localhost:3000" : process.env.SITE_ORIGIN,
	// ],

	origin: function (origin, callback) {
	    callback(null, true)
	}
    };

    app.use(cors(corsOptions));
    app.use(express.json({ limit: "200mb" }));
    app.use(express.urlencoded({ extended: true, limit: "200mb" }));
    app.use(cookieParser());
    app.use(express.static('admin'));

    app.use('/api', indexRouter);

    app.use(errorMiddleware);

    server.listen(process.env.API_PORT);

    return server
}

module.exports = startExpressServer