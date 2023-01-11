import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql'

import { pool } from '../config/database'
import { BadRequestError, DatabaseConnectionError } from '../models/customErrors'

const verifyUsernameDisponibility = (req: Request, res: Response, next: NextFunction): void => {
  const { username } = req.body
  const sql = mysql.format('SELECT * FROM users WHERE username = ?;', username)
  pool.query(sql, (err, rows) => {
    if (err) {
      next(new DatabaseConnectionError(err.message, true))
    }
    if (rows.length > 0) {
      next(new BadRequestError('Username already exists. Please, choose another one.', true))
    } else {
      next()
    }
  })
}

export default verifyUsernameDisponibility
