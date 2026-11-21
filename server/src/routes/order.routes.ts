import { Router, Request, Response } from 'express';
import {
  createOrder,
  validateCart,
  getOrderByIdentifier,
} from '../controllers/order.controller.js';
import { validateRequest } from '../middleware/validate.js';
import {
  createOrderSchema,
  validateCartSchema,
  orderIdentifierParamSchema,
} from '../validators/order.validator.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

// GET /api/v1/orders - Base status endpoint
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: 'Orders service ready.',
      data: { status: 'prepared' },
    }).toJSON()
  );
});

// POST /api/v1/orders - Place an order (guest checkout supported)
router.post('/', validateRequest({ body: createOrderSchema }), createOrder);

// POST /api/v1/orders/validate-cart - Verify cart products, real prices, and stock
router.post('/validate-cart', validateRequest({ body: validateCartSchema }), validateCart);

// GET /api/v1/orders/:identifier - Retrieve order by orderNumber or MongoDB ObjectId
router.get(
  '/:identifier',
  validateRequest({ params: orderIdentifierParamSchema }),
  getOrderByIdentifier
);

export default router;
