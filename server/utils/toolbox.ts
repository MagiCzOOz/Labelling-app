import type { Clip } from '../controllers/selectClip'

export const endsWithAny = (suffixes: string[], str: string): boolean => {
  return suffixes.some((suffix: string) => str.toLowerCase().endsWith(suffix))
}

export const shuffleArray = (array: (string | number)[][]): (string | number)[][] => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    // eslint-disable-next-line no-param-reassign
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const generateTimesArray = (duration: number): number[] => {
  const times = []
  for (let i = 0; i <= duration; i += parseInt(process.env.CLIPS_DURATION || '4', 10)) {
    times.push(i)
  }
  return times
}

export const camelCaseToClassicCase = (varName: string): string => {
  return varName.replace(/([A-Z, 0-9])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

export const maintainPreviousClipsDepth = (clip: Clip, index: number): void => {
  if (index === parseInt(process.env.MAX_CLIP_DEPTH || '40', 10)) {
    if (clip.previousClip) {
      // eslint-disable-next-line no-param-reassign
      clip.previousClip = null
    }
  } else if (clip.previousClip) {
    maintainPreviousClipsDepth(clip.previousClip, index + 1)
  }
}
