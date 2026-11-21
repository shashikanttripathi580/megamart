import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { SEED_CATEGORIES, SEED_PRODUCTS } from './data.js';

export async function seedDatabase(mongoUri?: string): Promise<{ categoriesCount: number; productsCount: number }> {
  const uri = mongoUri || env.MONGODB_URI;

  if (mongoose.connection.readyState === 0) {
    console.log(`Connecting to MongoDB for seeding: ${uri}...`);
    await mongoose.connect(uri);
  }

  console.log('Clearing existing product and category collections...');
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
  ]);

  console.log('Seeding categories...');
  const categoryMap = new Map<string, mongoose.Types.ObjectId>();

  // 1. Seed root categories (no parentSlug)
  const rootCategories = SEED_CATEGORIES.filter((c) => !c.parentSlug);
  for (const cat of rootCategories) {
    const created = await Category.create({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      parentCategory: null,
      sortOrder: cat.sortOrder,
      isActive: true,
    });
    categoryMap.set(cat.slug, created._id);
  }

  // 2. Seed subcategories (with parentSlug)
  const subCategories = SEED_CATEGORIES.filter((c) => c.parentSlug);
  for (const sub of subCategories) {
    const parentId = categoryMap.get(sub.parentSlug!);
    const created = await Category.create({
      name: sub.name,
      slug: sub.slug,
      description: sub.description,
      image: sub.image,
      parentCategory: parentId || null,
      sortOrder: sub.sortOrder,
      isActive: true,
    });
    categoryMap.set(sub.slug, created._id);
  }

  console.log(`✅ Seeded ${categoryMap.size} categories.`);

  console.log('Seeding supermarket products...');
  let productsCount = 0;

  for (const p of SEED_PRODUCTS) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`Category slug '${p.categorySlug}' not found for product '${p.name}'. Skipping.`);
      continue;
    }

    const subcategoryId = p.subcategorySlug ? categoryMap.get(p.subcategorySlug) : undefined;

    await Product.create({
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      category: categoryId,
      subcategory: subcategoryId,
      sku: p.sku,
      barcode: p.barcode,
      mrp: p.mrp,
      sellingPrice: p.sellingPrice,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      unit: p.unit,
      weight: p.weight,
      tags: p.tags,
      shortDescription: p.shortDescription,
      description: p.description,
      images: p.images,
      specifications: p.specifications,
      variants: p.variants,
      isFeatured: p.isFeatured,
      isActive: true,
    });

    productsCount++;
  }

  console.log(`✅ Seeded ${productsCount} products.`);
  return { categoriesCount: categoryMap.size, productsCount };
}

// Standalone execution
if (process.argv[1]?.endsWith('seed/index.ts') || process.argv[1]?.endsWith('seed\\index.ts')) {
  seedDatabase()
    .then(({ categoriesCount, productsCount }) => {
      console.log(`🎉 MegaMart seeding complete! (${categoriesCount} categories, ${productsCount} products)`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
