import { apiRequest } from './client';
import { PaginatedProductsResponse, SingleProductResponse, Product } from '@/types/store';
import { FALLBACK_PRODUCTS } from '@/data/fallbackData';

export interface ProductFilterParams {
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

function filterFallbackProducts(params: ProductFilterParams): PaginatedProductsResponse {
  let list = [...FALLBACK_PRODUCTS];

  if (params.category) {
    const cat = params.category.toLowerCase();
    list = list.filter((p) => {
      const cSlug = typeof p.category === 'object' ? p.category.slug : p.category;
      const subSlug = typeof p.subcategory === 'object' ? p.subcategory?.slug : p.subcategory;
      return cSlug?.toLowerCase() === cat || subSlug?.toLowerCase() === cat;
    });
  }

  if (params.subcategory) {
    const sub = params.subcategory.toLowerCase();
    list = list.filter((p) => {
      const subSlug = typeof p.subcategory === 'object' ? p.subcategory?.slug : p.subcategory;
      return subSlug?.toLowerCase() === sub;
    });
  }

  if (params.brand) {
    const b = params.brand.toLowerCase();
    list = list.filter((p) => p.brand.toLowerCase() === b);
  }

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (params.isFeatured) {
    list = list.filter((p) => p.isFeatured);
  }

  if (params.minPrice !== undefined) {
    list = list.filter((p) => p.sellingPrice >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    list = list.filter((p) => p.sellingPrice <= params.maxPrice!);
  }

  // Sorting
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';
  const multiplier = sortOrder === 'asc' ? 1 : -1;

  list.sort((a, b) => {
    if (sortBy === 'sellingPrice') {
      return (a.sellingPrice - b.sellingPrice) * multiplier;
    }
    if (sortBy === 'discountPercentage') {
      return (a.discountPercentage - b.discountPercentage) * multiplier;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name) * multiplier;
    }
    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * multiplier;
  });

  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 12);
  const totalDocs = list.length;
  const totalPages = Math.ceil(totalDocs / limit) || 1;
  const startIndex = (page - 1) * limit;
  const data = list.slice(startIndex, startIndex + limit);

  return {
    success: true,
    message: 'Products retrieved successfully',
    data,
    meta: {
      totalDocs,
      limit,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function fetchProducts(params: ProductFilterParams = {}): Promise<PaginatedProductsResponse> {
  const query = new URLSearchParams();

  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.category) query.set('category', params.category);
  if (params.subcategory) query.set('subcategory', params.subcategory);
  if (params.brand) query.set('brand', params.brand);
  if (params.search) query.set('search', params.search);
  if (params.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
  if (typeof params.isFeatured === 'boolean') query.set('isFeatured', params.isFeatured.toString());
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const queryString = query.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';

  try {
    const res = await apiRequest<PaginatedProductsResponse>(endpoint);
    if (res && res.data && res.data.length > 0) {
      return res;
    }
  } catch (error) {
    console.warn('API unavailable for products, serving embedded local catalog:', error);
  }

  // Seamless fallback for mobile APK and offline users
  return filterFallbackProducts(params);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  try {
    const res = await apiRequest<SingleProductResponse>(`/products/slug/${encodeURIComponent(slug)}`);
    if (res && res.data) {
      return res.data;
    }
  } catch (error) {
    console.warn(`API unavailable for product ${slug}, searching local store:`, error);
  }

  const found = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (found) {
    return found;
  }
  throw new Error(`Product not found: ${slug}`);
}

export async function fetchProductById(id: string): Promise<Product> {
  try {
    const res = await apiRequest<SingleProductResponse>(`/products/${encodeURIComponent(id)}`);
    if (res && res.data) {
      return res.data;
    }
  } catch (error) {
    console.warn(`API unavailable for product ID ${id}, searching local store:`, error);
  }

  const found = FALLBACK_PRODUCTS.find((p) => p._id === id || p.sku === id);
  if (found) {
    return found;
  }
  throw new Error(`Product not found with ID: ${id}`);
}
