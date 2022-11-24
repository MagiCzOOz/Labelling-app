import { Request, Response } from 'express';

import { LabelConfig } from '../config/labels';
import httpStatusCodes from '../models/httpStatusCodes';

const sendLabels = (req: Request, res: Response) => {
    res.status(httpStatusCodes.OK).send(LabelConfig);
};

export default sendLabels;
