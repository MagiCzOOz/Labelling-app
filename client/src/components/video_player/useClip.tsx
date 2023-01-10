import React, { useState } from 'react'

import type { ErrorMessage } from '../../App'
import fetchNextClip from '../../api/fetchNextClip'
import type { Clip } from './VideoPlayer'

interface clipAndSetters {
  currentClip: Clip | null
  setCurrentClip: React.Dispatch<React.SetStateAction<Clip | null>>
  setPreviousClip: React.Dispatch<React.SetStateAction<Clip | null>>
}

export default function useClip(loginStatus: boolean): clipAndSetters {
  const [currentClip, setCurrentClip] = useState<Clip | null>(null)
  const [previousClip, setPreviousClip] = useState<Clip | null>(null)

  React.useEffect(() => {
    if (!currentClip && loginStatus) {
      fetchNextClip()
        .then((nextClip: Clip | ErrorMessage) => {
          if (!('error' in nextClip)) setCurrentClip(nextClip)
        })
        .catch(err => {
          throw new Error(err.message)
        })
    }
  }, [previousClip, currentClip, loginStatus])

  return {
    currentClip,
    setCurrentClip,
    setPreviousClip,
  }
}
