import { Router } from 'express';
import { listCategories, getCategoryBySlug } from '../controllers/category.controller.js';
import { validateRequest } from '../middleware/validate.js';
import {
  listCategoriesQuerySchema,
  categorySlugParamSchema,
} from '../validators/category.validator.js';

const router = Router();

// GET /api/v1/categories
router.get('/', validateRequest({ query: listCategoriesQuerySchema }), listCategories);

// GET /api/v1/categories/slug/:slug
router.get('/slug/:slug', validateRequest({ params: categorySlugParamSchema }), getCategoryBySlug);

export default router;
