import { Sequelize } from 'sequelize'

import { configObject } from './configObject'

export const sequelize = new Sequelize(configObject.mysqlDB, configObject.mysqlUser, configObject.mysqlPassword, {
  host: configObject.mysqlHost,
  dialect: 'mysql',
  logging: false,
  pool: { max: configObject.connectionLimit },
})
