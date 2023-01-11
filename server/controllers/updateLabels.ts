import { Request, Response, NextFunction } from 'express'

import { pool } from '../config/database'
import { DatabaseConnectionError, UnauthorizedError } from '../models/customErrors'
import httpStatusCodes from '../models/httpStatusCodes'
import { appLogger } from '../utils/logger'

const updateLabels = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.user && req.body.clip) {
    const userId = req.session.user.id
    let sql = 'UPDATE clips SET '
    Object.keys(req.body.clipLabels).forEach((key: string) => {
      let val = 0
      if (req.body.clipLabels[key]) {
        val = 1
      }
      sql += `${key}=${val},`
    })
    sql += `labelledBy=${req.session.user.id} WHERE id=${req.body.clip.id};`
    pool.query(sql, err => {
      if (err) {
        next(new DatabaseConnectionError(err.message))
      }
      req.session.previousClip = req.body.clip
      if (req.session.previousClip) {
        req.session.previousClip.labels = req.body.clipLabels
      }
      appLogger.info(`User ${userId} has successfully labelled the clip ${req.body.clip.id}`)
      res.status(httpStatusCodes.CREATED).send({ message: 'Label successfully submitted.' })
    })
  } else {
    next(new UnauthorizedError('User not properly authenticated.', true))
  }
}

export default updateLabels
