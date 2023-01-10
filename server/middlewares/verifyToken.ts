import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

import { UnauthorizedError } from '../models/customErrors'

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['x-access-token'] as string
  if (!token) {
    next(new UnauthorizedError('User not authenticated. Please, provide an access token.', true))
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY as Secret, (err, decoded) => {
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
