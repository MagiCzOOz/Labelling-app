import * as dotenv from 'dotenv'
import { Secret } from 'jsonwebtoken'

import { appLogger } from '../utils/logger'

dotenv.config()

interface Environment {
  port: number
  corsOrigin: string
  connectionLimit: number
  mysqlHost: string
  mysqlDB: string
  mysqlUser: string
  mysqlPassword: string
  sessionSecret: string
  jwtSecret: Secret
  jwtSecretRefresh: Secret
  clipDuration: number
  previousClipDepth: number
  videosDirectoryPath: string
}

const defaultValues: Environment = {
  port: 4000,
  corsOrigin: 'http://localhost:3050',
  connectionLimit: 40,
  mysqlHost: 'localhost',
  mysqlDB: 'videoClips',
  mysqlUser: 'default_user',
  mysqlPassword: 'password',
  sessionSecret: 'sessionsecret',
  jwtSecret: 'jwtsecret',
  jwtSecretRefresh: 'jwtrefreshsecret',
  clipDuration: 4,
  previousClipDepth: 40,
  videosDirectoryPath: './',
}

function parseEnvVariables(): Environment {
  try {
    const port = parseInt(process.env.SERVER_PORT || `${defaultValues.port}`, 10)
    const corsOrigin = process.env.CORS_ORIGIN || defaultValues.corsOrigin
    const connectionLimit = parseInt(process.env.DB_CONNECTION_LIMIT || `${defaultValues.connectionLimit}`, 10)
    const mysqlHost = process.env.MYSQL_HOST || defaultValues.mysqlHost
    const mysqlDB = process.env.MYSQL_DATABASE || defaultValues.mysqlDB
    const mysqlUser = process.env.MYSQL_USER || defaultValues.mysqlUser
    const mysqlPassword = process.env.MYSQL_PASSWORD || defaultValues.mysqlPassword
    const sessionSecret = process.env.SESSION_SECRET_KEY || defaultValues.sessionSecret
    const jwtSecret = process.env.JWT_SECRET_KEY || defaultValues.jwtSecret
    const jwtSecretRefresh = process.env.JWT_REFRESH_KEY || defaultValues.jwtSecretRefresh
    const clipDuration = parseInt(process.env.CLIPS_DURATION || `${defaultValues.clipDuration}`, 10)
    const previousClipDepth = parseInt(process.env.MAX_CLIP_DEPTH || `${defaultValues.port}`, 10)
    const videosDirectoryPath = process.env.VIDEOS_DIR_PATH || defaultValues.videosDirectoryPath

    const envVariables: Environment = {
      port,
      corsOrigin,
      connectionLimit,
      mysqlHost,
      mysqlDB,
      mysqlUser,
      mysqlPassword,
      sessionSecret,
      jwtSecret,
      jwtSecretRefresh,
      clipDuration,
      previousClipDepth,
      videosDirectoryPath,
    }

    // Get the variables with default values
    const areDefault: string[] = []
    Object.keys(envVariables).forEach((key: string) => {
      if (envVariables[key as keyof Environment] === defaultValues[key as keyof Environment]) areDefault.push(key)
    })

    // Log a warning for the default values
    if (areDefault.length > 0)
      appLogger.warn(
        `BE CAREFULL, THE FOLLOWING VARIABLES ARE STILL SET TO DEFAULT VALUES :\n- ${areDefault.join('\n- ')}\n` +
          'Please, edit the .env file to configure the app at your conveniance',
      )

    return envVariables
  } catch (err) {
    appLogger.error(err)
    throw err
  }
}

export const configObject = parseEnvVariables()
