const express = require('express');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error-middleware')
const cors = require("cors");
const indexRouter = require('./routes/index');

const startExpressServer = () => {
    const app = express();

    const corsOptions = {
	credentials: true,
	origin: [
	    process.env.ADMIN_ORIGIN,
	    process.env.DEV ? "http://localhost:3000" : process.env.SITE_ORIGIN,
	],
    };

    app.use(cors(corsOptions));
    app.use(express.json({ limit: "200mb" }));
    app.use(express.urlencoded({ extended: true, limit: "200mb" }));
    app.use(cookieParser());
    app.use(express.static('uploads'));

    app.use('/api', indexRouter);

    app.use(errorMiddleware);

    app.listen(process.env.API_PORT, () => {
	console.log(`Express server is running on port ${process.env.API_PORT}.`);
    });
}

module.exports = startExpressServer