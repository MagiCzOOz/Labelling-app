import { ClipModel, UserModel } from '../models/databaseModels'
import { sequelize } from '../config/database'
import { generateClipsInfoFromVideos } from './toolbox'
import { appLogger } from './logger'
import { checkLabelsModelConsistency } from './checkLabelsModelConsistency'
import { InternalError } from '../models/customErrors'

export async function connectAndSyncDB(): Promise<void> {
  // Connect to the DB
  try {
    await sequelize.authenticate()
    // Create table Clips if it does not exist
    await ClipModel.sync()
    // Check the consistency between the table and the labelsconfig.json file
    await checkLabelsModelConsistency()
    // Fill the table if it has just been created
    const rows = await ClipModel.findAll()
    if (rows.length === 0) {
      const rawClips = await generateClipsInfoFromVideos()
      const newRows = await ClipModel.bulkCreate(rawClips)
      appLogger.info(`Clips table created and fill with ${newRows.length} clips.`)
    }
    // Create table Users if it does not exist
    await UserModel.sync()
    appLogger.info('Connection to the database has been established successfully.')
  } catch (err) {
    appLogger.error('Unable to correctly connect to the database.\n', err)
    throw new InternalError('Error in database synchronization. Check logs for details.')
  }
}
