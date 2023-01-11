import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import mysql from 'mysql'
import { configObject } from '../config/configObject'

import { pool } from '../config/database'
import {
  BadRequestError,
  InternalError,
  DatabaseConnectionError,
  UnauthorizedError,
  NotFoundError,
} from '../models/customErrors'
import httpStatusCodes from '../models/httpStatusCodes'
import { authLogger } from '../utils/logger'

const saltRounds = 10

export const register = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password, confirmPassword } = req.body
  if (password !== confirmPassword) {
    next(new BadRequestError('Password and Confirm Password do not match', true))
  } else {
    bcrypt.hash(password, saltRounds, async (error, hash) => {
      if (error) {
        next(new InternalError(error.message, true))
      }
      const sql = mysql.format('INSERT INTO users (username, password) VALUES (?,?);', [username, hash])
      pool.query(sql, err => {
        if (err) {
          next(new DatabaseConnectionError(err.message, true))
        }
        authLogger.info(`User ${username} successfully added.`)
        res.status(httpStatusCodes.CREATED).send({ message: 'User successfully added.' })
      })
    })
  }
}

export const getUser = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.user) {
    res.status(httpStatusCodes.OK).send({ loggedIn: true })
  } else {
    next(new UnauthorizedError('User not properly authenticated.', true))
  }
}

export const login = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body
  const sql = mysql.format('SELECT * FROM users WHERE username = ?;', username)
  pool.query(sql, (err, rows) => {
    if (err) {
      next(new DatabaseConnectionError(err.message, true))
    }
    if (rows.length > 0) {
      bcrypt.compare(password, rows[0].password, (error, response) => {
        if (response) {
          const { id } = rows[0]
          const accessToken = jwt.sign({ id, username }, configObject.jwtSecret, {
            expiresIn: '300s',
          })
          const refreshToken = jwt.sign({ id, username }, configObject.jwtSecretRefresh, {
            expiresIn: '10d',
          })
          // req.session.user = (({ id, username }) => ({ id, username }))(rows[0])
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
    } else {
      next(new NotFoundError("Username doesn't exist.", true))
    }
  })
}

export const refreshToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['x-refresh-token'] as string
  if (!token) {
    next(new UnauthorizedError('Unable to find a refresh token. Please, try to re-authenticate correctly', true))
  } else {
    jwt.verify(token, configObject.jwtSecretRefresh, (err, decoded) => {
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

export const logout = (req: Request, res: Response, next: NextFunction): void => {
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
