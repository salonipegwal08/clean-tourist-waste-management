import express from 'express';
import {
  getPlaces,
  createPlace,
  ratePlace,
  deletePlace,
} from '../controllers/placeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPlaces);
router.post('/', protect, createPlace);
router.post('/:id/rate', protect, ratePlace);
router.delete('/:id', protect, deletePlace); // Temporarily allow all logged-in users to delete for testing

export default router;
