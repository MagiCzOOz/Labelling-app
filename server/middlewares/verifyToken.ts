import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { configObject } from '../config/configObject'

import { UnauthorizedError } from '../models/customErrors'

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization
  if (!token) {
    next(new UnauthorizedError('User not authenticated. Please, provide an access token.', true))
  } else {
    jwt.verify(token.split(' ')[1], configObject.jwtSecret, (err, decoded) => {
      if (err) {
        next(new UnauthorizedError('Request made with a bad JWT.', true))
      } else {
        req.session.user = (({ id, username }) => ({ id, username }))(decoded as JwtPayload)
        next()
      }
    })
  }
}

export default verifyToken
