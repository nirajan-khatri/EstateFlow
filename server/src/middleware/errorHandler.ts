import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { MulterError } from 'multer';

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'fail',
                message: 'File is too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }

    console.error('ERROR 💥', err);

    res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
    });
};
