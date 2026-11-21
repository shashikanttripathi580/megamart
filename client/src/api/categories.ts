import { apiRequest } from './client';
import { CategoriesResponse, SingleCategoryResponse, Category } from '@/types/store';
import { FALLBACK_CATEGORIES, ALL_FALLBACK_CATEGORIES } from '@/data/fallbackData';

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

  try {
    const res = await apiRequest<CategoriesResponse>(endpoint);
    if (res && res.data && res.data.length > 0) {
      return res.data;
    }
  } catch (error) {
    console.warn('API unavailable for categories, serving local catalog:', error);
  }

  // Graceful fallback for mobile APK and offline mode
  if (options.tree || options.parentOnly) {
    return FALLBACK_CATEGORIES;
  }
  return ALL_FALLBACK_CATEGORIES;
}

export async function fetchCategoryBySlug(slug: string): Promise<Category> {
  try {
    const res = await apiRequest<SingleCategoryResponse>(`/categories/slug/${encodeURIComponent(slug)}`);
    if (res && res.data) {
      return res.data;
    }
  } catch (error) {
    console.warn(`API unavailable for category ${slug}, serving local match:`, error);
  }

  const found = ALL_FALLBACK_CATEGORIES.find((c) => c.slug === slug);
  if (found) {
    return found;
  }
  throw new Error(`Category not found: ${slug}`);
}
