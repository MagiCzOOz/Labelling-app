import { DataTypes } from 'sequelize'

import { sequelize } from '../config/database'
import { LabelConfig } from '../config/labels'

const labels = [...LabelConfig.labelNames, ...LabelConfig.issueNames].reduce(
  (o, key) => ({
    ...o,
    [key]: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }),
  {},
)

export const ClipModel = sequelize.define('Clip', {
  videoName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.FLOAT(3),
    allowNull: false,
  },
  endTime: {
    type: DataTypes.FLOAT(3),
    allowNull: false,
  },
  labelledBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ...labels,
})

export const UserModel = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(1234),
    allowNull: false,
  },
})
