import express from 'express';
import { proposeSwap, updateSwapStatus, getUserSwaps, getPotentialMatches } from '../controllers/swapController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-swaps' , protect , getUserSwaps);
router.get('/matches' , protect , getPotentialMatches);
router.post('/' , protect , proposeSwap);
router.put('/:id' , protect , updateSwapStatus);

export default router;