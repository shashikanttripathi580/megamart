import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as Record<string, unknown>;
    const categories = await categoryService.getCategories({
      tree: query.tree === true || query.tree === 'true',
      parentOnly: query.parentOnly === true || query.parentOnly === 'true',
    });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: 'Categories retrieved successfully',
        data: categories,
      }).toJSON()
    );
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: 'Category retrieved successfully',
        data: category,
      }).toJSON()
    );
  } catch (error) {
    next(error);
  }
};
