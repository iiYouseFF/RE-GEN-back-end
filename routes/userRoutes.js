import express from 'express';
import { getUserProfile, getEcoStats, updateProfile, deleteProfile } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile' , protect , getUserProfile);
router.get('/eco-stats' , protect , getEcoStats);
router.put('/profile' , protect , updateProfile);
router.delete('/profile' , protect , deleteProfile);

export default router;