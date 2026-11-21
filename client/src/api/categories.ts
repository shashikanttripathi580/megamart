import { apiRequest } from './client';
import { CategoriesResponse, SingleCategoryResponse, Category } from '@/types/store';

export interface CategoryFilterParams {
  tree?: boolean;
  parentOnly?: boolean;
}

export async function fetchCategories(options: CategoryFilterParams = {}): Promise<Category[]> {
  const query = new URLSearchParams();
  if (options.tree) query.set('tree', 'true');
  if (options.parentOnly) query.set('parentOnly', 'true');

  const queryString = query.toString();
  const endpoint = queryString ? `/categories?${queryString}` : '/categories';

  const res = await apiRequest<CategoriesResponse>(endpoint);
  return res.data;
}

export async function fetchCategoryBySlug(slug: string): Promise<Category> {
  const res = await apiRequest<SingleCategoryResponse>(`/categories/slug/${encodeURIComponent(slug)}`);
  return res.data;
}
