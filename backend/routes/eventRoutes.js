import express from 'express';
import {
  getEvents,
  createEvent,
  joinEvent,
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', protect, admin, createEvent);
router.post('/join', protect, joinEvent);

export default router;
