import fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import ffmpeg from 'fluent-ffmpeg'
import thumbsupply from 'thumbsupply'

import { InternalError } from '../models/customErrors'
import httpStatusCodes from '../models/httpStatusCodes'
import { configObject } from '../config/configObject'

export function partVideoStreaming(req: Request, res: Response, next: NextFunction): void {
  const path = `${configObject.videosDirectoryPath}/${req.params.videoName}`
  try {
    const startTime = parseInt(req.params.startTime, 10)
    const endTime = parseInt(req.params.endTime, 10)
    res.setHeader('Content-Type', 'video/mp4')
    ffmpeg(path)
      .outputOptions([
        '-f mp4',
        `-ss ${startTime}`,
        `-to ${endTime}`,
        '-movflags frag_keyframe+empty_moov',
        '-c:v libx264',
        '-c:a aac',
        '-strict -2',
      ])
      .pipe(res, { end: true })
  } catch (err) {
    next(new InternalError(`${err}`))
  }
}

// This function is not used as the current state of the App
export function fullVideoStreaming(req: Request, res: Response): void {
  const path = `${configObject.videosDirectoryPath}/${req.params.videoName}`
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const { range } = req.headers
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunksize = end - start + 1
    const file = fs.createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
}

export function getVideoThumbnail(req: Request, res: Response, next: NextFunction): void {
  const path = `${configObject.videosDirectoryPath}/${req.params.videoName}`
  thumbsupply
    .generateThumbnail(path, {
      size: thumbsupply.ThumbSize.LARGE, // or ThumbSize.LARGE
      timestamp: `${parseInt(req.params.startTime, 10)}`, // or `30` for 30 seconds
      forceCreate: true,
      cacheDir: '/data/.cache',
    })
    .then((thumb: string) => res.status(httpStatusCodes.OK).sendFile(thumb))
    .catch(err => {
      next(new InternalError(err.message))
    })
}
