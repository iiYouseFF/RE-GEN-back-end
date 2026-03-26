import express from 'express';
import { proposeSwap, updateSwapStatus } from '../controllers/swapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/' , protect , proposeSwap);
router.put('/:id' , protect , updateSwapStatus);

export default router;