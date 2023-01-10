import express from 'express'

import selectClip from '../controllers/selectClip'
import sendLabels from '../controllers/sendLabels'
import { globalLabelCount, globalIssueCount } from '../controllers/stats'
import updateLabels from '../controllers/updateLabels'
import { getUser, register, login, logout, refreshToken } from '../controllers/users'
import { videoStreaming, getVideoThumbnail } from '../controllers/video'
import verifyToken from '../middlewares/verifyToken'
import verifyUsernameDisponibility from '../middlewares/verifyUsernameDisponibility'

const router = express.Router()

router.post('/api/register', verifyUsernameDisponibility, register)
router.post('/api/labelled', verifyToken, updateLabels)
router.post('/api/logout', verifyToken, logout)
router.post('/api/login', login)

router.get('/api/token', refreshToken)
router.get('/api/login', verifyToken, getUser)
router.get('/api/countLabel', verifyToken, globalLabelCount)
router.get('/api/countIssue', verifyToken, globalIssueCount)
router.get('/api/clip', verifyToken, selectClip)
router.get('/api/videos/:videoName', videoStreaming)
router.get('/api/thumbnail/:videoName/:startTime', getVideoThumbnail)
router.get('/api/labels', verifyToken, sendLabels)

export default router
