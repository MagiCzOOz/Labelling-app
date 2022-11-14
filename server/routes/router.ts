import express from 'express';

import { sendLabels, updateLabels } from '../controllers/handleLabels';
import selectClip from '../controllers/selectClip';
import { globalLabelCount, globalIssueCount } from '../controllers/stats';
import { getUser, register, login, logout } from '../controllers/users';
import { videoStreaming, getVideoThumbnail } from '../controllers/video';
import verifyToken from '../middlewares/verifyToken';
import verifyUsernameDisponibility from '../middlewares/verifyUsernameDisponibility';

const router = express.Router();

router.post('/api/register', verifyUsernameDisponibility, register);
router.post('/api/labelled', updateLabels);
router.post('/api/logout', verifyToken, logout);
router.post('/api/login', login);

router.get('/api/login', verifyToken, getUser);
router.get('/api/countLabel', verifyToken, globalLabelCount);
router.get('/api/countIssue', verifyToken, globalIssueCount);
router.get('/api/clip', verifyToken, selectClip);
router.get('/api/videos/:videoName', videoStreaming);
router.get('/api/thumbnail/:videoName/:startTime', getVideoThumbnail);
router.get('/api/labels', sendLabels);

export default router;
