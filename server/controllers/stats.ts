import { Request, Response, NextFunction } from 'express'

import { pool } from '../config/database'
import { LabelConfig } from '../config/labels'
import { DatabaseConnectionError } from '../models/customErrors'
import httpStatusCodes from '../models/httpStatusCodes'
import { camelCaseToClassicCase } from '../utils/toolbox'

type LabelCount = {
  label: string
  count: number
}

const getCount = (namesArray: string[]): Promise<LabelCount[]> => {
  let sql = 'SELECT '
  namesArray.forEach((key: string) => {
    sql += `(SUM(CASE WHEN ${key} = 1 THEN 1 ELSE 0 END)) AS ${key},`
  })
  // remove last coma and add the end of the query
  sql = `${sql.slice(0, -1)} FROM clips;`
  return new Promise<LabelCount[]>((resolve, reject) => {
    pool.query(sql, (err, rows) => {
      if (err) {
        reject(new DatabaseConnectionError(err.message))
      }
      const row: Record<string, number> = rows[0]
      const count: LabelCount[] = []
      Object.entries(row).forEach(([k, v]: [string, number]) => {
        count.push({ label: camelCaseToClassicCase(k), count: v })
      })
      resolve(count)
    })
  })
}

export const globalLabelCount = (req: Request, res: Response, next: NextFunction): void => {
  getCount(LabelConfig.labelNames)
    .then((count: LabelCount[]) => {
      res.status(httpStatusCodes.OK).send(count)
    })
    .catch(err => {
      next(err)
    })
}

export const globalIssueCount = (req: Request, res: Response, next: NextFunction): void => {
  getCount(LabelConfig.issueNames)
    .then((count: LabelCount[]) => {
      res.status(httpStatusCodes.OK).send(count)
    })
    .catch(err => {
      next(err)
    })
}
