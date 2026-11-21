import { Category, ICategoryDocument } from '../models/category.model.js';
import { ApiError } from '../utils/apiError.js';
import { isDbConnected } from '../config/db.js';

export interface CategoryTreeNode extends Omit<ICategoryDocument, 'toObject'> {
  subcategories?: CategoryTreeNode[];
}

export class CategoryService {
  /**
   * List active categories, optionally organized as a nested parent-child tree
   */
  async getCategories(options: { tree?: boolean; parentOnly?: boolean } = {}) {
    if (!isDbConnected()) {
      throw new ApiError(503, 'Database is disconnected. Please configure MONGODB_URI in server/.env');
    }

    if (options.tree) {
      return this.getCategoryTree();
    }

    const query: Record<string, unknown> = { isActive: true };
    if (options.parentOnly) {
      query.parentCategory = null;
    }

    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return categories;
  }

  /**
   * Build hierarchical category tree: Root Categories -> Subcategories
   */
  async getCategoryTree() {
    const allCategories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    const rootCategories: Array<any> = [];
    const subcategoryMap = new Map<string, Array<any>>();

    for (const cat of allCategories) {
      if (!cat.parentCategory) {
        rootCategories.push({ ...cat, subcategories: [] });
      } else {
        const parentId = cat.parentCategory.toString();
        if (!subcategoryMap.has(parentId)) {
          subcategoryMap.set(parentId, []);
        }
        subcategoryMap.get(parentId)!.push(cat);
      }
    }

    for (const root of rootCategories) {
      const rootId = root._id.toString();
      root.subcategories = subcategoryMap.get(rootId) || [];
    }

    return rootCategories;
  }

  /**
   * Retrieve category by unique slug
   */
  async getCategoryBySlug(slug: string): Promise<Record<string, any>> {
    if (!isDbConnected()) {
      throw new ApiError(503, 'Database is disconnected. Please configure MONGODB_URI in server/.env');
    }

    const category = await Category.findOne({ slug, isActive: true })
      .populate('parentCategory', 'name slug')
      .lean();

    if (!category) {
      throw ApiError.notFound(`Category with slug '${slug}' not found`);
    }

    // Also find subcategories if this is a parent category
    const subcategories = await Category.find({
      parentCategory: category._id,
      isActive: true,
    })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return {
      ...category,
      subcategories,
    };
  }
}

export const categoryService = new CategoryService();
