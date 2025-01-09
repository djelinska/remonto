const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/router.js');
require('dotenv/config');

const app = express();

const corsOptions = {
	origin: 'http://localhost:4200',
	credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));

mongoose
	.connect(process.env.DB_URI)
	.then(() => console.log('DB Connected'))
	.catch((err) => console.log(err));

app.use('/', router);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
