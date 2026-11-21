const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const dataContent = fs.readFileSync(path.join(__dirname, '../server/src/seed/data.ts'), 'utf8');
const js = ts.transpileModule(dataContent, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

const mod = { exports: {} };
const fn = new Function('module', 'exports', 'require', js);
fn(mod, mod.exports, require);

const { SEED_CATEGORIES, SEED_PRODUCTS } = mod.exports;

const categoryMap = new Map();
const parentCategories = [];

SEED_CATEGORIES.forEach((c, idx) => {
  const cat = {
    _id: 'cat_' + (idx + 1),
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    parentCategory: c.parentSlug ? ('cat_' + c.parentSlug) : null,
    isActive: true,
    sortOrder: c.sortOrder || 1,
    subcategories: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  categoryMap.set(c.slug, cat);
});

SEED_CATEGORIES.forEach(c => {
  if (c.parentSlug && categoryMap.has(c.parentSlug)) {
    const parent = categoryMap.get(c.parentSlug);
    const child = categoryMap.get(c.slug);
    child.parentCategory = { _id: parent._id, name: parent.name, slug: parent.slug };
    parent.subcategories.push(child);
  } else if (!c.parentSlug) {
    parentCategories.push(categoryMap.get(c.slug));
  }
});

const products = SEED_PRODUCTS.map((p, idx) => {
  const catObj = categoryMap.get(p.categorySlug) || { _id: 'cat_1', name: 'Groceries', slug: p.categorySlug };
  const subcatObj = p.subcategorySlug ? categoryMap.get(p.subcategorySlug) : undefined;
  const mrp = p.mrp || 0;
  const sellingPrice = p.sellingPrice || 0;
  const discountPercentage = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  return {
    _id: 'prod_' + (idx + 1),
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    shortDescription: p.shortDescription || '',
    brand: p.brand || '',
    category: { _id: catObj._id, name: catObj.name, slug: catObj.slug },
    subcategory: subcatObj ? { _id: subcatObj._id, name: subcatObj.name, slug: subcatObj.slug } : undefined,
    sku: p.sku,
    barcode: p.barcode,
    mrp: mrp,
    sellingPrice: sellingPrice,
    discountPercentage: discountPercentage,
    stock: p.stock || 50,
    lowStockThreshold: p.lowStockThreshold || 5,
    unit: p.unit || 'unit',
    weight: p.weight,
    tags: p.tags || [],
    images: (p.images || []).map(img => ({
      url: img.url,
      alt: img.alt || p.name,
      isDefault: img.isDefault || false
    })),
    specifications: p.specifications || [],
    variants: (p.variants || []).map(v => ({
      sku: v.sku,
      barcode: v.barcode,
      name: v.name,
      attributes: v.attributes || {},
      mrp: v.mrp,
      sellingPrice: v.sellingPrice,
      stock: v.stock
    })),
    isActive: true,
    isFeatured: p.isFeatured || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});

const outTs = `import { Product, Category } from '@/types/store';

export const FALLBACK_CATEGORIES: Category[] = ${JSON.stringify(parentCategories, null, 2)};

export const ALL_FALLBACK_CATEGORIES: Category[] = ${JSON.stringify(Array.from(categoryMap.values()), null, 2)};

export const FALLBACK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.mkdirSync(path.join(__dirname, '../client/src/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../client/src/data/fallbackData.ts'), outTs, 'utf8');
console.log('Successfully generated client/src/data/fallbackData.ts with', products.length, 'products and', parentCategories.length, 'categories');
