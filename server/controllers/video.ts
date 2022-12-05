import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import thumbsupply = require('thumbsupply');

import { InternalError } from '../models/customErrors';
import httpStatusCodes from '../models/httpStatusCodes';

export const videoStreaming = (req: Request, res: Response) => {
    const path = process.env.VIDEOS_DIR_PATH + `/${req.params.videoName}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
};

export const getVideoThumbnail = (req: Request, res: Response, next: NextFunction) => {
    const path = process.env.VIDEOS_DIR_PATH + `/${req.params.videoName}`;
    thumbsupply
        .generateThumbnail(path, {
            size: thumbsupply.ThumbSize.LARGE, // or ThumbSize.LARGE
            timestamp: `${parseInt(req.params.startTime)}`, // or `30` for 30 seconds
            forceCreate: true,
            cacheDir: '/data/.cache',
        })
        .then((thumb: string) => res.status(httpStatusCodes.OK).sendFile(thumb))
        .catch((err) => {
            next(new InternalError(err.message));
        });
};
