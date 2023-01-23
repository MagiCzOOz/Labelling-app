import { Request, Response, NextFunction } from 'express'

import { BadRequestError } from '../models/customErrors'
import { UserModel } from '../models/databaseModels'

async function verifyUsernameDisponibility(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username } = req.body
  const isUsed = await UserModel.findOne({ where: { username }, attributes: ['username'] })
  if (isUsed === null) {
    next()
  } else {
    next(new BadRequestError('Username already exists. Please, choose another one.', true))
  }
}

export default verifyUsernameDisponibility
