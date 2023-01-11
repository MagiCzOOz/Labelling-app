import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import expressMySqlSession from 'express-mysql-session'
import * as expressSession from 'express-session'
import session from 'express-session'
import helmet from 'helmet'
import { v4 as uuidv4 } from 'uuid'

import { configObject } from './config/configObject'
import { pool, createTablesIfNotExists } from './config/database'
import type { Clip } from './controllers/selectClip'
import errorMiddleware from './middlewares/errorMiddleware'
import router from './routes/router'
import { appLogger } from './utils/logger'

// Declaration merging for adding its own properties to req.session
// (https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
declare module 'express-session' {
  export interface SessionData {
    user: {
      id: number
      username: string
    }
    previousClip: Clip
  }
}

const app = express()

const MySQLStore = expressMySqlSession(expressSession)
const sessionStore = new MySQLStore(
  {
    expiration: 86400000,
    createDatabaseTable: true,
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data',
      },
    },
  },
  pool,
)

app.use(
  cors({
    origin: configObject.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  }),
)
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(
  session({
    genid: function generateId() {
      return uuidv4() // use UUIDs for session IDs
    },
    secret: configObject.sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
)
app.use(router)
// uncomment the line below to serve the client build folder locally without nginx
// app.use(express.static('../client/build'));
app.use(errorMiddleware)

app.listen(configObject.port, '0.0.0.0', () => {
  appLogger.info(`Server is running at port ${configObject.port}`)
  createTablesIfNotExists(pool)
})
