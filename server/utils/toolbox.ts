import fs from 'fs'
import getVideoDurationInSeconds from 'get-video-duration'
import { configObject } from '../config/configObject'
import type { Clip } from '../controllers/selectClip'

// Check if a string end with one of the many ending provided in suffixes
export const endsWithAny = (suffixes: string[], str: string): boolean => {
  return suffixes.some((suffix: string) => str.toLowerCase().endsWith(suffix))
}

// Randomly shuffle the array
export const shuffleArray = (array: Record<string, string | number>[]): Record<string, string | number>[] => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    // eslint-disable-next-line no-param-reassign
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Generate the array of time indexes depending on the duration of the video and the desired clip duration
export const generateTimesArray = (duration: number): number[] => {
  const times = []
  for (let i = 0; i <= duration; i += configObject.clipDuration) {
    times.push(i)
  }
  return times
}

// Convert a camelCase string to a Normal Case one
export const camelCaseToClassicCase = (varName: string): string => {
  return varName.replace(/([A-Z, 0-9])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

// Maintain the depth of the clip object by setting the excess previous clip to null
export const maintainPreviousClipsDepth = (clip: Clip, index: number): void => {
  if (index === configObject.previousClipDepth) {
    if (clip.previousClip) {
      // eslint-disable-next-line no-param-reassign
      clip.previousClip = null
    }
  } else if (clip.previousClip) {
    maintainPreviousClipsDepth(clip.previousClip, index + 1)
  }
}

// Supported extensions for the video files (case unsensitive)
const supportedFormat = ['.3gp', '.mpg', '.mpeg', '.mp4', '.m4v', '.m4p', '.ogv', '.ogg', '.mov', '.webm']

// Read the videos folder and return an array of the videos infos (name, startTime, endTime)
export async function generateClipsInfoFromVideos(): Promise<Record<string, string | number>[]> {
  const files = await fs.promises.readdir(configObject.videosDirectoryPath)
  const values: Record<string, string | number>[] = []
  await Promise.all(
    files.map(async (file: string) => {
      if (endsWithAny(supportedFormat, file)) {
        const duration = await getVideoDurationInSeconds(`${configObject.videosDirectoryPath}/${file}`)
        const times = generateTimesArray(duration)
        for (let i = 0; i < times.length - 1; i += 1) {
          values.push({ videoName: file, startTime: times[i], endTime: times[i + 1], labelledBy: 0 })
        }
      }
    }),
  )
  return shuffleArray(values)
}
