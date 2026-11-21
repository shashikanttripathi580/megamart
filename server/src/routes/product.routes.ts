import { Router } from 'express';
import {
  listProducts,
  getProductById,
  getProductBySlug,
} from '../controllers/product.controller.js';
import { validateRequest } from '../middleware/validate.js';
import {
  listProductsQuerySchema,
  productIdParamSchema,
  productSlugParamSchema,
} from '../validators/product.validator.js';

const router = Router();

// GET /api/v1/products
router.get('/', validateRequest({ query: listProductsQuerySchema }), listProducts);

// GET /api/v1/products/slug/:slug (must precede /:id)
router.get('/slug/:slug', validateRequest({ params: productSlugParamSchema }), getProductBySlug);

// GET /api/v1/products/:id
router.get('/:id', validateRequest({ params: productIdParamSchema }), getProductById);

export default router;
