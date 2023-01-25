import { QueryTypes } from 'sequelize'

import { sequelize } from '../config/database'
import { ClipModel } from '../models/databaseModels'
import { LabelConfig } from '../config/labels'
import { InternalError } from '../models/customErrors'
import { configObject } from '../config/configObject'

export async function checkLabelsModelConsistency(): Promise<void> {
  // Get the labels name currently defined in the Clips table
  const clip = await sequelize.query(`SELECT * FROM ${ClipModel.tableName} LIMIT 1`, { type: QueryTypes.SELECT })
  const modelLabels: string[] = []
  if (clip.length > 0) {
    Object.keys(clip[0]).forEach((column: string) => {
      if (LabelConfig.totalLabelNames.includes(column)) {
        modelLabels.push(column)
      }
    })
    if (modelLabels.length !== LabelConfig.totalLabelNames.length) {
      throw new InternalError(
        `There is a missmatch between the labelsconfig.json file and the SQL ${ClipModel.tableName} table.\n\n` +
          `Labels in labelsconfig.json file :\n- ${LabelConfig.totalLabelNames.join('\n- ')}\n\n` +
          `Labels in the SQL ${ClipModel.tableName} table from the database ${configObject.mysqlDB} :\n` +
          `- ${modelLabels.join('\n- ')}\n\n` +
          `Here are the options to address this issue :\n\n` +
          `  1) Change the database name in the .env file.\n` +
          ` This will create a fresh database with a new ${ClipModel.tableName} table matching the labelsconfig.json file.\n` +
          `WARNING: This will also create a new users and sessions table forcing the users to register again.\n\n` +
          `  2) Drop the existing ${ClipModel.tableName} table.\n` +
          ` WARNING: You have to save it somewhere else first if you don't want to lose all your existing labels.\n\n` +
          `  3) Edit the code of the sequelize model "ClipModel" in models/databaseModels.ts to change the table name.\n` +
          ` This will create a fresh clips table with this new name.\n\n` +
          `  4) Edit the labelsconfig.json file back to match the existing database.\n` +
          ` In this case, you will continue to work on the existing database without modification.`,
      )
    }
  }
}
