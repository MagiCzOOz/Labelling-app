import fs, { PathLike } from 'fs'
import { getVideoDurationInSeconds } from 'get-video-duration'
import mysql, { Pool, MysqlError, OkPacket } from 'mysql'

import { appLogger } from '../utils/logger'
import { endsWithAny, shuffleArray, generateTimesArray } from '../utils/toolbox'
import { LabelConfig } from './labels'

const supportedFormat = ['.3gp', '.mpg', '.mpeg', '.mp4', '.m4v', '.m4p', '.ogv', '.ogg', '.mov', '.webm']

const createClipsTable = (pool: Pool): Promise<boolean> => {
  let sql =
    'CREATE TABLE IF NOT EXISTS clips ' +
    '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,' +
    'videoName VARCHAR(255), startTime FLOAT(3), endTime FLOAT(3), labelledBy INT,'
  ;[...LabelConfig.labelNames, ...LabelConfig.issueNames].forEach((key: string) => {
    sql += `${key} INT,`
  })
  // remove the last coma and add the closure bracket
  sql = `${sql.slice(0, -1)})`
  return new Promise<boolean>((resolve, reject) => {
    pool.query(sql, (err: MysqlError) => {
      if (err) reject(err)
      resolve(true)
    })
  })
}

const createUsersTable = (pool: Pool): Promise<boolean> => {
  const sql =
    'CREATE TABLE IF NOT EXISTS users ' +
    '(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,' +
    'username VARCHAR(255), password VARCHAR(255))'
  return new Promise<boolean>((resolve, reject) => {
    pool.query(sql, (err: MysqlError) => {
      if (err) reject(err)
      resolve(true)
    })
  })
}

const generateClipsInfoFromVideos = async (): Promise<(string | number)[][]> => {
  const numberOfLabels = [...LabelConfig.labelNames, ...LabelConfig.issueNames].length
  const files = await fs.promises.readdir(process.env.VIDEOS_DIR_PATH as PathLike)
  const values: (string | number)[][] = []
  await Promise.all(
    files.map(async (file: string) => {
      if (endsWithAny(supportedFormat, file)) {
        const duration = await getVideoDurationInSeconds(`${process.env.VIDEOS_DIR_PATH}/${file}`)
        const times = generateTimesArray(duration)
        for (let i = 0; i < times.length - 1; i += 1) {
          values.push([file, times[i], times[i + 1], 0, ...Array(numberOfLabels).fill(-1)])
        }
      }
    }),
  )
  return shuffleArray(values)
}

const fillNewClipsTable = (pool: Pool): void => {
  generateClipsInfoFromVideos()
    .then((values: (string | number)[][]) => {
      let sql = 'INSERT INTO clips (videoName, startTime, endTime, labelledBy,'
      ;[...LabelConfig.labelNames, ...LabelConfig.issueNames].forEach((key: string) => {
        sql += `${key},`
      })
      // remove the last coma and add the end of the query
      sql = mysql.format(`${sql.slice(0, -1)}) VALUES?`, [values])
      pool.query(sql, (err: MysqlError, res: OkPacket) => {
        if (err) {
          appLogger.error(err)
          throw err
        }
        appLogger.info(`Clips table filled with ${res.affectedRows} rows`)
      })
    })
    .catch(err => {
      appLogger.error(err)
      throw err
    })
}

const checkIfTableExists = async (sql: string, pool: Pool): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    pool.query(sql, (err: MysqlError, rows: string[]) => {
      if (err) {
        appLogger.error(err)
        reject(err)
      }
      if (rows) {
        resolve(rows.length > 0)
      } else {
        resolve(false)
      }
    })
  })
}

export const createTablesIfNotExists = async (pool: Pool): Promise<void> => {
  const sql = 'SHOW TABLES LIKE'
  try {
    let exists = await checkIfTableExists(`${sql} "clips"`, pool)
    if (!exists) {
      createClipsTable(pool)
        .then((status: boolean) => {
          if (status) {
            fillNewClipsTable(pool)
            appLogger.info('Clips table created.')
          }
        })
        .catch((err: Error) => {
          appLogger.error(err)
          throw err
        })
    }
    exists = await checkIfTableExists(`${sql} "users"`, pool)
    if (!exists) {
      createUsersTable(pool)
        .then((status: boolean) => {
          if (status) appLogger.info('User table created')
        })
        .catch((err: Error) => {
          appLogger.error(err)
          throw err
        })
    }
  } catch (err) {
    appLogger.error(err)
    throw err
  }
}

const pool = mysql.createPool({
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '40', 10),
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  debug: false,
})

export default pool
