import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../models/customErrors';
import { appLogger, authLogger } from '../utils/logger';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        err.authRelated ? authLogger.error(err.message) : appLogger.error(err.message);
        res.status(err.statusCode).json({ error: err.message });
    } else {
        appLogger.error(err.stack);
        res.status(500).json({ error: err.message });
    }
};

export default errorMiddleware;
