import express from 'express';
import {
  createReport,
  getReports,
  getMyReports,
  updateReportStatus,
} from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReport);
router.get('/', protect, admin, getReports);
router.get('/my', protect, getMyReports);
router.put('/:id/status', protect, admin, updateReportStatus);

export default router;
