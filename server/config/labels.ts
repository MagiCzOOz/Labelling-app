import config from './labelsconfig.json'

const labelNames: string[] = []
Object.values(config.labels).forEach((group: string[]) => {
  labelNames.push(...group)
})

export type Labels = Record<(typeof labelNames)[number] | (typeof config.issues)[number], number>

const labelFormModel = [...labelNames, ...config.issues].reduce((o, key) => ({ ...o, [key]: false }), {})

export const LabelConfig = {
  labels: config.labels,
  labelNames,
  issueNames: config.issues,
  totalLabelNames: [...labelNames, ...config.issues],
  labelFormModel,
}
