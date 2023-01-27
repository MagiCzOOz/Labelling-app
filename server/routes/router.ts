import express from 'express'

import { sendClip } from '../controllers/selectClip'
import sendLabels from '../controllers/sendLabels'
import { globalLabelCount, globalIssueCount } from '../controllers/stats'
import updateLabels from '../controllers/updateLabels'
import { getUser, register, login, logout, refreshAccessToken } from '../controllers/users'
import { getVideoThumbnail, partVideoStreaming } from '../controllers/video'
import verifyToken from '../middlewares/verifyToken'
import verifyUsernameDisponibility from '../middlewares/verifyUsernameDisponibility'

const router = express.Router()

// Authentication related
router.post('/register', verifyUsernameDisponibility, register)
router.post('/logout', verifyToken, logout) // restricted
router.post('/login', login)
router.get('/token', refreshAccessToken) // restricted with the refresh JWT token
router.get('/login', verifyToken, getUser) // restricted

// API routes all restricted
router.post('/api/labelled', updateLabels)
router.get('/api/countLabel', globalLabelCount)
router.get('/api/countIssue', globalIssueCount)
router.get('/api/clip', sendClip)
router.get('/api/videos/:videoName/:startTime/:endTime', partVideoStreaming)
router.get('/api/thumbnail/:videoName/:startTime', getVideoThumbnail)
router.get('/api/labels', sendLabels)

export default router
