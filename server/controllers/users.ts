import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { configObject } from '../config/configObject'

import { BadRequestError, InternalError, UnauthorizedError, NotFoundError } from '../models/customErrors'
import { UserModel } from '../models/databaseModels'
import httpStatusCodes from '../models/httpStatusCodes'
import { authLogger } from '../utils/logger'

const saltRounds = 10

export function register(req: Request, res: Response, next: NextFunction): void {
  const { username, password, confirmPassword } = req.body
  if (password !== confirmPassword) {
    next(new BadRequestError('Password and Confirm Password do not match', true))
  } else {
    bcrypt.hash(password, saltRounds, async (error, hash) => {
      if (error) {
        next(new InternalError(error.message, true))
      }
      try {
        await UserModel.create({ username, password: hash })
        authLogger.info(`User ${username} successfully added.`)
        res.status(httpStatusCodes.CREATED).send({ message: 'User successfully added.' })
      } catch (err) {
        next(err)
      }
    })
  }
}

export function getUser(req: Request, res: Response, next: NextFunction): void {
  if (req.session.user) {
    res.status(httpStatusCodes.OK).send({ loggedIn: true })
  } else {
    next(new UnauthorizedError('User not properly authenticated.', true))
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, password } = req.body
  try {
    const findUser = await UserModel.findOne({ where: { username } })
    if (findUser === null) {
      next(new NotFoundError("Username doesn't exist.", true))
    } else {
      const userFound = findUser.toJSON()
      bcrypt.compare(password, userFound.password, (error, response) => {
        if (response) {
          const { id } = userFound
          const accessToken = jwt.sign({ id, username }, configObject.jwtSecret, {
            expiresIn: '300s',
          })
          const refreshToken = jwt.sign({ id, username }, configObject.jwtSecretRefresh, {
            expiresIn: '10d',
          })
          req.session.user = { id, username }
          authLogger.info(`User ${req.session.user.id} successfully logged in.`)
          res.status(httpStatusCodes.OK).send({
            loggedIn: true,
            accessToken,
            refreshToken,
          })
        } else {
          next(new BadRequestError('Wrong password.', true))
        }
      })
    }
  } catch (err) {
    next(err)
  }
}

export function refreshAccessToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization
  if (!token) {
    next(new UnauthorizedError('Unable to find a refresh token. Please, try to re-authenticate correctly', true))
  } else {
    jwt.verify(token.split(' ')[1], configObject.jwtSecretRefresh, (err, decoded) => {
      if (err) {
        next(new BadRequestError('Request made with a bad refresh token.', true))
      } else {
        req.session.user = (({ id, username }) => ({ id, username }))(decoded as JwtPayload)
        const refreshedToken = jwt.sign(req.session.user, configObject.jwtSecret, {
          expiresIn: '300s',
        })
        res.status(httpStatusCodes.OK).send({ loggedIn: true, accessToken: refreshedToken })
      }
    })
  }
}

export function logout(req: Request, res: Response, next: NextFunction): void {
  if (req.session.user) {
    const userId = req.session.user.id
    req.session.destroy(err => {
      if (err) {
        next(new InternalError(err.message, true))
      }
      authLogger.info(`User ${userId} successfully logged out.`)
      res.status(httpStatusCodes.OK).send({ loggedIn: false })
    })
  } else {
    next(new UnauthorizedError('User not properly authenticated.', true))
  }
}
