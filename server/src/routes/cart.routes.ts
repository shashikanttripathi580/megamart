import { Router, Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

// Placeholder for future cart persistence endpoints
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: 'Cart service ready. Cart synchronization endpoints will be implemented in upcoming phase.',
      data: { status: 'prepared' },
    }).toJSON()
  );
});

export default router;
