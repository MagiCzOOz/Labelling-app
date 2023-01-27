import React, { ReactElement } from 'react'
import { MdNotInterested } from 'react-icons/md'
import fetchThumbnail from '../../api/fetchThumbnail'

import { camelCaseToClassicCase } from '../form/FormValues'
import type { Clip } from '../video_player/VideoPlayer'

export default function PreviousClipThumbnail({
  currentClip,
  setCurrentClip,
}: {
  currentClip: Clip | null
  setCurrentClip: React.Dispatch<React.SetStateAction<Clip | null>>
}): ReactElement {
  const [previousLabels, setPreviousLabels] = React.useState<string[]>([])
  const [imgUrl, setImgUrl] = React.useState<string>()

  // set labels on thumbnail
  React.useEffect(() => {
    setPreviousLabels([])
    if (currentClip && currentClip.previousClip) {
      const labelsArray: string[] = []
      Object.entries(currentClip.previousClip.labels).forEach(([k, v]: [string, boolean]) => {
        if (v) {
          labelsArray.push(`${camelCaseToClassicCase(k)} `)
        }
      })
      if (labelsArray.length > 0) {
        labelsArray[labelsArray.length - 1] = labelsArray[labelsArray.length - 1].slice(0, -1)
        setPreviousLabels(labelsArray)
      } else {
        setPreviousLabels(['No label'])
      }
    }
  }, [currentClip])

  // fetch the thumbnail image
  React.useEffect(() => {
    async function fetchImg(): Promise<void> {
      if (currentClip?.previousClip) {
        setImgUrl(await fetchThumbnail(currentClip.previousClip))
      }
    }
    fetchImg()
  }, [currentClip])

  function reloadPreviousClip(): void {
    if (currentClip) setCurrentClip(currentClip.previousClip)
  }

  return (
    <div className="previousClipThumbnail">
      {currentClip && currentClip.previousClip ? (
        <div
          className="thumbnailContainer"
          onClick={reloadPreviousClip}
          onKeyDown={reloadPreviousClip}
          role="button"
          tabIndex={0}
        >
          <img
            src={imgUrl}
            crossOrigin="use-credentials"
            width="100%"
            height="100%"
            alt="Unable to render the thumbnail"
          />
          <div className="thumbnailLabel">{previousLabels}</div>
        </div>
      ) : (
        <div className="noThumbnailContainer">
          <div className="thumbnailLabel">
            <MdNotInterested size={50} />
          </div>
        </div>
      )}
    </div>
  )
}
