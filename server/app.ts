import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import sequelizeStore from 'connect-session-sequelize'
import session from 'express-session'
import helmet from 'helmet'
import { v4 as uuidv4 } from 'uuid'

import { configObject } from './config/configObject'
import { sequelize } from './config/database'
import { ClipModel, UserModel } from './models/databaseModels'
import type { Clip } from './controllers/selectClip'
import errorMiddleware from './middlewares/errorMiddleware'
import router from './routes/router'
import { appLogger } from './utils/logger'
import { generateClipsInfoFromVideos } from './utils/toolbox'

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

// Connect to the db and create the table Clips and Users if needed
sequelize
  .authenticate()
  .then(async () => {
    appLogger.info('Connection to the database has been established successfully.')

    await ClipModel.sync()
    const rows = await ClipModel.findAll()
    if (rows.length === 0) {
      const rawClips = await generateClipsInfoFromVideos()
      const newRows = await ClipModel.bulkCreate(rawClips)
      appLogger.info(`Clips table created and fill with ${newRows.length} clips.`)
    }

    await UserModel.sync()
  })
  .catch(error => {
    appLogger.error('Unable to connect to the database: ', error)
    throw error
  })

const app = express()

const SequelizeStore = sequelizeStore(session.Store)
const sessionStore = new SequelizeStore({ db: sequelize })
sessionStore.sync()

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
})
