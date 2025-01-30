import { MongooseError } from "mongoose";
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/router'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

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
    .connect(process.env.DB_URI as string)
    .then(() => console.log('DB Connected'))
    .catch((err: MongooseError) => console.log(err));

app.use('/', routes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
