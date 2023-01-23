import { Request, Response, NextFunction } from 'express'

import { LabelConfig } from '../config/labels'
import { ClipModel } from '../models/databaseModels'
import httpStatusCodes from '../models/httpStatusCodes'
import { camelCaseToClassicCase } from '../utils/toolbox'

type LabelCount = {
  label: string
  count: number
}

async function getCount(namesArray: string[]): Promise<LabelCount[]> {
  const counts: LabelCount[] = []
  await Promise.all(
    namesArray.map(async (labelName: string) => {
      const { count } = await ClipModel.findAndCountAll({
        where: {
          [labelName]: 1,
        },
      })
      counts.push({ label: camelCaseToClassicCase(labelName), count })
    }),
  )
  return counts
}

export function globalLabelCount(req: Request, res: Response, next: NextFunction): void {
  getCount(LabelConfig.labelNames)
    .then((count: LabelCount[]) => {
      res.status(httpStatusCodes.OK).send(count)
    })
    .catch(err => {
      next(err)
    })
}

export function globalIssueCount(req: Request, res: Response, next: NextFunction): void {
  getCount(LabelConfig.issueNames)
    .then((count: LabelCount[]) => {
      res.status(httpStatusCodes.OK).send(count)
    })
    .catch(err => {
      next(err)
    })
}
