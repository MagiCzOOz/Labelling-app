import { Request, Response, NextFunction } from 'express'

import { BadRequestError } from '../models/customErrors'
import { ClipModel } from '../models/databaseModels'
import httpStatusCodes from '../models/httpStatusCodes'
import { appLogger } from '../utils/logger'

async function updateLabels(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session.user && req.body.clip) {
    try {
      await ClipModel.update(
        {
          labelledBy: req.session.user.id,
          ...req.body.clipLabels,
        },
        {
          where: {
            id: req.body.clip.id,
          },
        },
      )
      req.session.previousClip = req.body.clip
      if (req.session.previousClip) {
        req.session.previousClip.labels = req.body.clipLabels
      }
      appLogger.info(`User ${req.session.user.id} has successfully labelled the clip ${req.body.clip.id}`)
      res.status(httpStatusCodes.CREATED).send({ message: 'Label successfully submitted.' })
    } catch (err) {
      next(err)
    }
    return
  }
  next(new BadRequestError('User or clip missing in the request aiming to update the clip.'))
}

export default updateLabels
