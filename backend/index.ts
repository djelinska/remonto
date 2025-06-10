import { MongooseError } from "mongoose";
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/router'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import UserModel from "./models/userModel";
import { encryptPassword } from "./utils/validation";

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
const server = app.listen(port, async () => {
    console.log(`Server started on port ${port}`);
    const adminCount = await UserModel.countDocuments({ type: 'ADMIN' });
    if (adminCount === 0) {
        const hashedPassword = await encryptPassword('admin');
        await UserModel.create({
            firstName: 'Default',
            lastName: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            type: 'ADMIN',
        });
        console.warn(
            'No admin found. Default admin account created.\nUsername: admin@example.com\nPassword: admin\nPlease change this password immediately.'
        );
    }

});
