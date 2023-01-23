import { Request, Response, NextFunction } from 'express'
import { Op, WhereOperators } from 'sequelize'

import type { Labels } from '../config/labels'
import { UnauthorizedError } from '../models/customErrors'
import { ClipModel } from '../models/databaseModels'
import httpStatusCodes from '../models/httpStatusCodes'
import { maintainPreviousClipsDepth } from '../utils/toolbox'

export interface Clip {
  id: number
  videoName: string
  startTime: number
  endTime: number
  labelledBy?: number
  labels: Labels
  previousClip?: Clip | null
}

async function getClip(labelledByValue: number | WhereOperators, previousClip: Clip | undefined): Promise<Clip | null> {
  const findClip = await ClipModel.findOne({
    where: {
      labelledBy: labelledByValue,
    },
  })
  if (findClip === null) {
    return null
  }
  const { id, videoName, startTime, endTime, labelledBy, createdAt, updatedAt, ...rest } = findClip.toJSON()
  const clip: Clip = { id, videoName, startTime, endTime, labels: rest }
  if (previousClip) {
    clip.previousClip = previousClip
  }
  maintainPreviousClipsDepth(clip, 0)
  return clip
}

export async function sendClip(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.session.user) {
    try {
      // send a clip that has been already send to this user before
      const clipAlreadySend = await getClip(-req.session.user.id, req.session.previousClip)
      if (clipAlreadySend !== null) {
        res.status(httpStatusCodes.OK).send(clipAlreadySend)
        return
      }
      // ... or a new clip that has never been send
      const newClip = await getClip(0, req.session.previousClip)
      if (newClip !== null) {
        // set clip as used before send it
        await ClipModel.update(
          { labelledBy: -req.session.user.id },
          {
            where: {
              id: newClip.id,
            },
          },
        )
        res.status(httpStatusCodes.OK).send(newClip)
        return
      }
      // ... or a clip that has been send to another user but never labelled
      const lastUncompleteClip = await getClip({ [Op.lt]: 0 }, req.session.previousClip)
      if (lastUncompleteClip !== null) {
        res.status(httpStatusCodes.OK).send(lastUncompleteClip)
        return
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new UnauthorizedError('User not properly authenticated.', true))
  }
}
