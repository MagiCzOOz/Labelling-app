import { Request, Response } from 'express'

import { LabelConfig } from '../config/labels'
import httpStatusCodes from '../models/httpStatusCodes'

function sendLabels(req: Request, res: Response): void {
  res.status(httpStatusCodes.OK).send(LabelConfig)
}

export default sendLabels
