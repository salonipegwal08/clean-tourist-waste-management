import express from 'express';
import { getDustbins, createDustbin, deleteDustbin } from '../controllers/dustbinController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDustbins);
router.post('/', protect, createDustbin);
router.delete('/:id', protect, deleteDustbin);

export default router;
