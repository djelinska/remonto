import {Request} from 'express'
export default interface TokenRequest extends Request {
    body: {
        token: string;
    }
}

