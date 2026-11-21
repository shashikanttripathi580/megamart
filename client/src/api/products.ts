import { apiRequest } from './client';
import { PaginatedProductsResponse, SingleProductResponse, Product } from '@/types/store';

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

  return apiRequest<PaginatedProductsResponse>(endpoint);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await apiRequest<SingleProductResponse>(`/products/slug/${encodeURIComponent(slug)}`);
  return res.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await apiRequest<SingleProductResponse>(`/products/${encodeURIComponent(id)}`);
  return res.data;
}
