import { Request, Response, NextFunction } from 'express';

import pool from '../config/database';
import type { Labels } from '../config/labels';
import { DatabaseConnectionError, UnauthorizedError } from '../models/customErrors';
import httpStatusCodes from '../models/httpStatusCodes';

export type Clip = {
    id: number;
    videoName: string;
    startTime: number;
    endTime: number;
    labelledBy?: number;
    labels: Labels;
    previousClip?: Clip | null;
};

const setClipAsUsed = async (userId: number, clipId: number) => {
    const sql = `UPDATE clips SET labelledBy=-${userId} WHERE id=${clipId}`;
    return new Promise<boolean>((resolve, reject) => {
        pool.query(sql, (err) => {
            if (err) {
                reject(new DatabaseConnectionError(err.message));
            }
            resolve(true);
        });
    });
};

const maintainPreviousClipsDepth = (clip: Clip) => {
    const iterateThroughClips = (clip: Clip, index: number) => {
        if (index === parseInt(process.env.MAX_CLIP_DEPTH || '40')) {
            if (clip.previousClip) {
                clip.previousClip = null;
            }
        } else {
            if (clip.previousClip) {
                iterateThroughClips(clip.previousClip, index + 1);
            }
        }
    };
    iterateThroughClips(clip, 0);
};

const getClipFromRows = (rows: Record<string, number | string>[], previousClip: Clip | undefined): Clip => {
    const { id, videoName, startTime, endTime, labelledBy, ...rest } = rows[0];
    const clip: Clip = { id, videoName, startTime, endTime, labels: rest } as Clip;
    if (previousClip) {
        clip.previousClip = previousClip;
    }
    maintainPreviousClipsDepth(clip);
    return clip;
};

const sendClip = (sql: string, req: Request, res: Response): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        pool.query(sql, (err, rows) => {
            if (err) {
                reject(new DatabaseConnectionError(err.message));
            }
            if (rows.length > 0) {
                if (req.session.user) {
                    const clip = getClipFromRows(rows, req.session.previousClip);
                    setClipAsUsed(req.session.user.id, clip.id)
                        .then((status: boolean) => {
                            if (status) {
                                res.status(httpStatusCodes.OK).send(clip);
                                resolve(true);
                            }
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else reject(new UnauthorizedError('User not properly authenticated.', true));
            } else {
                resolve(false);
            }
        });
    });
};

const selectClip = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        try {
            const sql = 'SELECT * FROM clips WHERE labelledBy';
            let tag = `=-${req.session.user.id}`;
            let status = await sendClip(sql + tag, req, res);
            if (!status) {
                tag = '=0';
                status = await sendClip(sql + tag, req, res);
                if (!status) {
                    tag = '<0';
                    status = await sendClip(sql + tag, req, res);
                }
            }
        } catch (err) {
            next(err);
        }
    } else {
        next(new UnauthorizedError('User not properly authenticated.', true));
    }
};

export default selectClip;
