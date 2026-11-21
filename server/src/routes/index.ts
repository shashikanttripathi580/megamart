import { Router } from 'express';
import healthRoutes from './health.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import userRoutes from './user.routes.js';
import orderRoutes from './order.routes.js';
import cartRoutes from './cart.routes.js';

const router = Router();

// Mount domain routes under /api/v1
router.use('/health', healthRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);

export default router;
