import React from 'react'

import type { LabelConfig, ErrorMessage } from '../../App'
import fetchLabels from '../../api/fetchLabels'

const initialConfigState = {
  labels: {},
  issues: {},
  labelNames: [],
  issueNames: [],
  totalLabelNames: [],
  labelFormModel: {},
}

interface labelsItem {
  labelConfig: LabelConfig
  setLabelConfig: React.Dispatch<React.SetStateAction<LabelConfig>>
}

export default function useLabels(loginStatus: boolean): labelsItem {
  const [labelConfig, setLabelConfig] = React.useState<LabelConfig>(initialConfigState)

  React.useEffect(() => {
    if (loginStatus) {
      fetchLabels('GET')
        .then((result: LabelConfig | ErrorMessage) => {
          if (!('error' in result)) setLabelConfig(result)
        })
        .catch(err => {
          throw new Error(err.message)
        })
    }
  }, [loginStatus])

  return {
    labelConfig,
    setLabelConfig,
  }
}
