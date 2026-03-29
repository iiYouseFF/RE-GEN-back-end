import express from 'express';
import { getCategories, createCategory, deleteCategory, getPendingProducts, moderateProduct, getAllOrders, getPlatformStats, getAllUsers, toggleUserRole } from '../controllers/adminController.js';
import authenticate, { adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require authentication and administrative clearance
router.use(authenticate, adminOnly);

router.get('/stats', getPlatformStats);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/moderation', getPendingProducts);
router.put('/moderation/:id', moderateProduct);
router.get('/orders', getAllOrders);
router.get('/users', getAllUsers);
router.put('/users/:id/role', toggleUserRole);

export default router;
