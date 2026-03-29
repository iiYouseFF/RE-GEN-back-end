import express from 'express';
import { getProducts, getProductById, getProductsByCategory, addProduct, getMyProducts, getCategories, getPublicStats } from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/stats', getPublicStats);
router.get('/' , getProducts);
router.get('/categories', getCategories);
router.get('/my-products' , protect, getMyProducts);
router.get('/category/:category' , getProductsByCategory);
router.get('/:id' , getProductById);
router.post('/' , protect , upload.single('image'), addProduct);

export default router;