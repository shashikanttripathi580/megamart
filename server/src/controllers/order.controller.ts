import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await orderService.createOrder(req.body);

    res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message: 'Order placed successfully',
        data: order,
      }).toJSON()
    );
  } catch (error) {
    next(error);
  }
};

export const validateCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await orderService.validateCart(req.body.items);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: 'Cart validated successfully',
        data: result,
      }).toJSON()
    );
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdentifier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identifier } = req.params;
    const order = await orderService.getOrderByIdentifier(identifier);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: 'Order retrieved successfully',
        data: order,
      }).toJSON()
    );
  } catch (error) {
    next(error);
  }
};
