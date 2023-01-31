import { Request, Response, NextFunction } from 'express'

import { CustomError, InternalError } from '../models/customErrors'
import { appLogger, authLogger } from '../utils/logger'

const errorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof CustomError && !(err instanceof InternalError)) {
    // eslint-disable-next-line no-unused-expressions
    err.authRelated ? authLogger.error(err.stack) : appLogger.error(err.stack)
    res.status(err.statusCode).json({ error: err.message })
  } else {
    appLogger.error(err.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default errorMiddleware
