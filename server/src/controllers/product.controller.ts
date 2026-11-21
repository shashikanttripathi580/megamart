import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await productService.getProducts(req.query as any);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: 'Products retrieved successfully',
        data: result.docs,
        meta: result.pagination,
      }).toJSON()
    );
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: 'Product retrieved successfully',
        data: product,
      }).toJSON()
    );
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: 'Product retrieved successfully',
        data: product,
      }).toJSON()
    );
  } catch (error) {
    next(error);
  }
};
