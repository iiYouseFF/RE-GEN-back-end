import express from 'express';
import { getUserProfile, getEcoStats } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile' , protect , getUserProfile);
router.get('/eco-stats' , protect , getEcoStats);

export default router;