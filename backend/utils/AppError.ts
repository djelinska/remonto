interface AppError extends Error {
    statusCode: number
    isOperational: boolean
}
class AppError extends Error {
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode || 400;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError
