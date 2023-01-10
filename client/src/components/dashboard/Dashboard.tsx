import React, { ReactElement } from 'react'
import './DashboardStyles.scss'

import type { LabelConfig } from '../../App'
import type { Clip } from '../video_player/VideoPlayer'
import LabelCountTable from './LabelCountTable'
import PreviousClipThumbnail from './PreviousClipThumbnail'

export default function Dashboard({
  currentClip,
  setCurrentClip,
  labelConfig,
}: {
  currentClip: Clip | null
  setCurrentClip: React.Dispatch<React.SetStateAction<Clip | null>>
  labelConfig: LabelConfig
}): ReactElement {
  return (
    <div className="dashboard">
      <PreviousClipThumbnail currentClip={currentClip} setCurrentClip={setCurrentClip} />
      <LabelCountTable currentClip={currentClip} />
      {labelConfig.issueNames.length > 0 ? <LabelCountTable currentClip={currentClip} issues /> : null}
    </div>
  )
}
