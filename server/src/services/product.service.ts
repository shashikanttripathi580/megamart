import { Types } from 'mongoose';
import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { ApiError } from '../utils/apiError.js';
import { isDbConnected } from '../config/db.js';

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'sellingPrice' | 'name' | 'discountPercentage';
  sortOrder?: 'asc' | 'desc';
}

export class ProductService {
  /**
   * Fetch paginated list of products with flexible filters and search
   */
  async getProducts(options: ProductQueryOptions = {}) {
    if (!isDbConnected()) {
      throw new ApiError(503, 'Database is disconnected. Please configure MONGODB_URI in server/.env');
    }

    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { isActive: true };

    // Filter by category (handles both ObjectId string and slug)
    if (options.category) {
      if (Types.ObjectId.isValid(options.category)) {
        // If it's a parent category, we should also include all its subcategories
        const subcategories = await Category.find({
          parentCategory: options.category,
          isActive: true,
        }).select('_id');

        const categoryIds = [
          new Types.ObjectId(options.category),
          ...subcategories.map((c) => c._id),
        ];

        filter.$or = [
          { category: { $in: categoryIds } },
          { subcategory: { $in: categoryIds } },
        ];
      } else {
        // Assume category slug
        const categoryDoc = await Category.findOne({
          slug: options.category,
          isActive: true,
        });

        if (categoryDoc) {
          const subcategories = await Category.find({
            parentCategory: categoryDoc._id,
            isActive: true,
          }).select('_id');

          const categoryIds = [categoryDoc._id, ...subcategories.map((c) => c._id)];

          filter.$or = [
            { category: { $in: categoryIds } },
            { subcategory: { $in: categoryIds } },
          ];
        } else {
          // Category slug does not exist, return empty
          filter.category = new Types.ObjectId();
        }
      }
    }

    // Filter by subcategory
    if (options.subcategory) {
      if (Types.ObjectId.isValid(options.subcategory)) {
        filter.subcategory = new Types.ObjectId(options.subcategory);
      } else {
        const subCat = await Category.findOne({
          slug: options.subcategory,
          isActive: true,
        });
        if (subCat) {
          filter.subcategory = subCat._id;
        }
      }
    }

    // Filter by brand
    if (options.brand) {
      filter.brand = { $regex: new RegExp(`^${options.brand.trim()}$`, 'i') };
    }

    // Filter by featured
    if (typeof options.isFeatured === 'boolean') {
      filter.isFeatured = options.isFeatured;
    }

    // Filter by price range (minPrice, maxPrice) applied to sellingPrice
    if (typeof options.minPrice === 'number' || typeof options.maxPrice === 'number') {
      const priceFilter: Record<string, number> = {};
      if (typeof options.minPrice === 'number') {
        priceFilter.$gte = options.minPrice;
      }
      if (typeof options.maxPrice === 'number') {
        priceFilter.$lte = options.maxPrice;
      }
      filter.sellingPrice = priceFilter;
    }

    // Basic search keyword filtering
    if (options.search && options.search.trim()) {
      const searchTerm = options.search.trim();
      const regex = new RegExp(searchTerm, 'i');
      filter.$or = [
        ...(filter.$or as any[] || []),
        { name: regex },
        { brand: regex },
        { tags: regex },
        { description: regex },
      ];
    }

    // Dynamic sorting
    const sortBy = options.sortBy || 'createdAt';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortDirection };

    const [docs, totalDocs] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      docs,
      pagination: {
        totalDocs,
        limit,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Fetch single product by MongoDB ObjectId
   */
  async getProductById(id: string) {
    if (!isDbConnected()) {
      throw new ApiError(503, 'Database is disconnected. Please configure MONGODB_URI in server/.env');
    }

    if (!Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest(`Invalid product ID format: '${id}'`);
    }

    const product = await Product.findOne({ _id: id, isActive: true })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .lean();

    if (!product) {
      throw ApiError.notFound(`Product not found with ID '${id}'`);
    }

    return product;
  }

  /**
   * Fetch single product by URL slug
   */
  async getProductBySlug(slug: string) {
    if (!isDbConnected()) {
      throw new ApiError(503, 'Database is disconnected. Please configure MONGODB_URI in server/.env');
    }

    const product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .lean();

    if (!product) {
      throw ApiError.notFound(`Product not found with slug '${slug}'`);
    }

    return product;
  }
}

export const productService = new ProductService();
