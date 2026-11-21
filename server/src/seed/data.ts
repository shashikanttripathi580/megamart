export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentSlug?: string;
  sortOrder: number;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  // Parent Categories
  {
    name: 'Groceries & Staples',
    slug: 'groceries-staples',
    description: 'Essential kitchen staples including atta, rice, dals, edible oils, and spices',
    image: '/images/products/aashirvaad-shudh-chakki-atta.jpg',
    sortOrder: 1,
  },
  {
    name: 'Dairy, Bread & Eggs',
    slug: 'dairy-bread-eggs',
    description: 'Fresh farm milk, creamy butter, curd, paneer, and daily bakery essentials',
    image: '/images/products/amul-pasteurised-butter.jpg',
    sortOrder: 2,
  },
  {
    name: 'Snacks & Biscuits',
    slug: 'snacks-biscuits',
    description: 'Crispy namkeens, healthy dry fruits, tea-time biscuits, and sweet cookies',
    image: '/images/products/britannia-good-day-rich-cashew-cookies.jpg',
    sortOrder: 3,
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Aromatic teas, premium coffees, refreshing juices, and cold soft drinks',
    image: '/images/products/coca-cola-can.jpg',
    sortOrder: 4,
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Nourishing soaps, shampoos, oral care, and skin hygiene products',
    image: '/images/products/dettol-original-soap.jpg',
    sortOrder: 5,
  },
  {
    name: 'Household & Cleaning',
    slug: 'household-cleaning',
    description: 'Detergents, fabric care, surface cleaners, and dishwashing essentials',
    image: '/images/products/surf-excel-matic-detergent.jpg',
    sortOrder: 6,
  },

  // Subcategories under Groceries & Staples
  {
    name: 'Flour & Atta',
    slug: 'flour-atta',
    description: 'Whole wheat atta, multi-grain flours, maida, and besan',
    parentSlug: 'groceries-staples',
    sortOrder: 1,
  },
  {
    name: 'Rice & Rice Products',
    slug: 'rice-products',
    description: 'Premium basmati rice, everyday sona masoori, and poha',
    parentSlug: 'groceries-staples',
    sortOrder: 2,
  },
  {
    name: 'Dals & Pulses',
    slug: 'dals-pulses',
    description: 'Unpolished toor dal, moong dal, chana dal, and urad dal',
    parentSlug: 'groceries-staples',
    sortOrder: 3,
  },
  {
    name: 'Edible Oils & Ghee',
    slug: 'edible-oils-ghee',
    description: 'Mustard oil, sunflower oil, olive oil, and pure desi ghee',
    parentSlug: 'groceries-staples',
    sortOrder: 4,
  },

  // Subcategories under Snacks & Biscuits
  {
    name: 'Biscuits & Cookies',
    slug: 'biscuits-cookies',
    description: 'Glucose biscuits, cream biscuits, butter cookies, and rusks',
    parentSlug: 'snacks-biscuits',
    sortOrder: 1,
  },
  {
    name: 'Namkeen & Chips',
    slug: 'namkeen-chips',
    description: 'Aloo bhujia, roasted mixtures, chips, and potato crisps',
    parentSlug: 'snacks-biscuits',
    sortOrder: 2,
  },

  // Subcategories under Personal Care
  {
    name: 'Shampoo & Hair Care',
    slug: 'shampoo-hair-care',
    description: 'Anti-dandruff shampoos, conditioners, and herbal hair oils',
    parentSlug: 'personal-care',
    sortOrder: 1,
  },
  {
    name: 'Bathing Soaps & Body Wash',
    slug: 'soaps-body-wash',
    description: 'Antibacterial soaps, beauty bars, and moisturizing washes',
    parentSlug: 'personal-care',
    sortOrder: 2,
  },
  {
    name: 'Toothpaste & Oral Care',
    slug: 'toothpaste-oral-care',
    description: 'Cavity protection toothpastes, toothbrushes, and mouthwashes',
    parentSlug: 'personal-care',
    sortOrder: 3,
  },

  // Subcategories under Household
  {
    name: 'Detergents & Laundry',
    slug: 'detergents-laundry',
    description: 'Washing powders, liquid detergents, and fabric conditioners',
    parentSlug: 'household-cleaning',
    sortOrder: 1,
  },
];

export interface SeedProduct {
  name: string;
  slug: string;
  brand: string;
  categorySlug: string;
  subcategorySlug?: string;
  sku: string;
  barcode?: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  weight?: string;
  tags: string[];
  shortDescription?: string;
  description?: string;
  images: { url: string; alt?: string; isDefault?: boolean }[];
  specifications: { key: string; value: string }[];
  variants: {
    sku: string;
    name: string;
    attributes: Record<string, string>;
    mrp: number;
    sellingPrice: number;
    stock: number;
  }[];
  isFeatured: boolean;
}

export const SEED_PRODUCTS: SeedProduct[] = [
  // 1. Aashirvaad Atta
  {
    name: 'Aashirvaad Shudh Chakki Atta (100% Whole Wheat)',
    slug: 'aashirvaad-shudh-chakki-atta',
    brand: 'Aashirvaad',
    categorySlug: 'groceries-staples',
    subcategorySlug: 'flour-atta',
    sku: 'MM-ATT-001',
    barcode: '8901030010011',
    mrp: 295,
    sellingPrice: 245,
    stock: 210, // Derived aggregate sum of variants (50 + 120 + 40)
    lowStockThreshold: 10,
    unit: 'kg',
    weight: '5 kg',
    tags: ['atta', 'flour', 'wheat', 'rotis', 'staple', 'bestseller'],
    shortDescription: '100% pure whole wheat chakki atta with natural dietary fibres for soft, fluffy rotis.',
    description: 'Aashirvaad Shudh Chakki Atta is made from the grains which are heavy on the palm, golden amber in colour and hard in bite. It is carefully ground using modern chakki grinding process which retains the natural taste and nutrition.',
    images: [
      {
        url: '/images/products/aashirvaad-shudh-chakki-atta.jpg',
        alt: 'Aashirvaad Shudh Chakki Atta 5kg',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Dietary Preference', value: 'Vegetarian' },
      { key: 'Grain Type', value: '100% Whole Wheat' },
      { key: 'Country of Origin', value: 'India' },
    ],
    variants: [
      {
        sku: 'MM-ATT-001-1K',
        name: 'Aashirvaad Atta 1 kg',
        attributes: { size: '1 kg' },
        mrp: 65,
        sellingPrice: 58,
        stock: 50,
      },
      {
        sku: 'MM-ATT-001-5K',
        name: 'Aashirvaad Atta 5 kg',
        attributes: { size: '5 kg' },
        mrp: 295,
        sellingPrice: 245,
        stock: 120,
      },
      {
        sku: 'MM-ATT-001-10K',
        name: 'Aashirvaad Atta 10 kg',
        attributes: { size: '10 kg' },
        mrp: 580,
        sellingPrice: 475,
        stock: 40,
      },
    ],
    isFeatured: true,
  },

  // 2. Fortune Sunflower Oil
  {
    name: 'Fortune Sunlite Refined Sunflower Oil Pouch',
    slug: 'fortune-sunlite-refined-sunflower-oil',
    brand: 'Fortune',
    categorySlug: 'groceries-staples',
    subcategorySlug: 'edible-oils-ghee',
    sku: 'MM-OIL-002',
    barcode: '8906007280022',
    mrp: 165,
    sellingPrice: 129,
    stock: 125, // Derived aggregate sum of variants (90 + 35)
    lowStockThreshold: 15,
    unit: 'L',
    weight: '1 L',
    tags: ['oil', 'cooking oil', 'sunflower oil', 'fortune', 'healthy'],
    shortDescription: 'Light and healthy edible cooking oil enriched with Vitamins A and D.',
    description: 'Fortune Sunlite Refined Sunflower Oil is a light, healthy and nutritious cooking oil. Easy to digest and helps keep your heart healthy while preparing your favorite delicacies.',
    images: [
      {
        url: '/images/products/fortune-sunlite-refined-sunflower-oil-pouch.jpg',
        alt: 'Fortune Sunflower Oil 1L Pouch',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Oil Type', value: 'Refined Sunflower Oil' },
      { key: 'Vitamins', value: 'Enriched with Vitamins A & D' },
    ],
    variants: [
      {
        sku: 'MM-OIL-002-1L',
        name: 'Fortune Sunflower Oil 1 L Pouch',
        attributes: { volume: '1 L' },
        mrp: 165,
        sellingPrice: 129,
        stock: 90,
      },
      {
        sku: 'MM-OIL-002-5L',
        name: 'Fortune Sunflower Oil 5 L Can',
        attributes: { volume: '5 L' },
        mrp: 810,
        sellingPrice: 660,
        stock: 35,
      },
    ],
    isFeatured: true,
  },

  // 3. Tata Sampann Toor Dal
  {
    name: 'Tata Sampann Unpolished Toor Dal (Arhar Dal)',
    slug: 'tata-sampann-unpolished-toor-dal',
    brand: 'Tata Sampann',
    categorySlug: 'groceries-staples',
    subcategorySlug: 'dals-pulses',
    sku: 'MM-DAL-003',
    barcode: '8904043900033',
    mrp: 210,
    sellingPrice: 175,
    stock: 80,
    lowStockThreshold: 10,
    unit: 'kg',
    weight: '1 kg',
    tags: ['dal', 'toor dal', 'arhar', 'pulses', 'tata sampann', 'protein'],
    shortDescription: 'High protein unpolished toor dal for delicious and wholesome daily meals.',
    description: 'Tata Sampann Toor Dal is unpolished and does not undergo any artificial polishing with water, oil or leather, thereby retaining its wholesome goodness and authentic nutrient profile.',
    images: [
      {
        url: '/images/products/tata-sampann-unpolished-toor-dal.jpg',
        alt: 'Tata Sampann Toor Dal 1kg',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Type', value: 'Unpolished Arhar / Toor Dal' },
      { key: 'Protein Rich', value: 'Yes' },
    ],
    variants: [],
    isFeatured: true,
  },

  // 4. India Gate Basmati Rice
  {
    name: 'India Gate Feast Rozzana Basmati Rice',
    slug: 'india-gate-feast-rozzana-basmati-rice',
    brand: 'India Gate',
    categorySlug: 'groceries-staples',
    subcategorySlug: 'rice-products',
    sku: 'MM-RIC-004',
    barcode: '8901414000044',
    mrp: 499,
    sellingPrice: 389,
    stock: 135, // Derived aggregate sum of variants (70 + 65)
    lowStockThreshold: 8,
    unit: 'kg',
    weight: '5 kg',
    tags: ['rice', 'basmati', 'india gate', 'grains', 'pulao', 'biryani'],
    shortDescription: 'Aromatic, aged long grain basmati rice ideal for everyday cooking and special feasts.',
    description: 'India Gate Feast Rozzana Basmati rice is defined by its distinct aroma and fluffy slender grains, making everyday family meals hearty and memorable.',
    images: [
      {
        url: '/images/products/india-gate-feast-rozzana-basmati-rice.jpg',
        alt: 'India Gate Basmati Rice 5kg',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Grain Length', value: 'Medium-Long Basmati' },
      { key: 'Aged', value: 'Aged for superior aroma' },
    ],
    variants: [
      {
        sku: 'MM-RIC-004-1K',
        name: 'India Gate Rozzana Rice 1 kg',
        attributes: { size: '1 kg' },
        mrp: 110,
        sellingPrice: 89,
        stock: 70,
      },
      {
        sku: 'MM-RIC-004-5K',
        name: 'India Gate Rozzana Rice 5 kg',
        attributes: { size: '5 kg' },
        mrp: 499,
        sellingPrice: 389,
        stock: 65,
      },
    ],
    isFeatured: true,
  },

  // 5. Amul Pasteurised Butter
  {
    name: 'Amul Pasteurised Butter (Delicious & Creamy)',
    slug: 'amul-pasteurised-butter',
    brand: 'Amul',
    categorySlug: 'dairy-bread-eggs',
    sku: 'MM-BUT-005',
    barcode: '8901262010055',
    mrp: 285,
    sellingPrice: 275,
    stock: 240, // Derived aggregate sum of variants (100 + 140)
    lowStockThreshold: 20,
    unit: 'g',
    weight: '500 g',
    tags: ['butter', 'amul', 'dairy', 'breakfast', 'fresh'],
    shortDescription: 'Classic Utterly Butterly Delicious salted butter made from pure milk fat.',
    description: 'Amul Butter is an iconic Indian household staple. Spread it on bread, parathas, toast or use it in baking and cooking for wholesome richness.',
    images: [
      {
        url: '/images/products/amul-pasteurised-butter.jpg',
        alt: 'Amul Butter 500g',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Storage Condition', value: 'Keep Refrigerated at 4°C' },
      { key: 'Fat Content', value: '80% Milk Fat Minimum' },
    ],
    variants: [
      {
        sku: 'MM-BUT-005-100G',
        name: 'Amul Butter 100 g',
        attributes: { size: '100 g' },
        mrp: 58,
        sellingPrice: 56,
        stock: 100,
      },
      {
        sku: 'MM-BUT-005-500G',
        name: 'Amul Butter 500 g',
        attributes: { size: '500 g' },
        mrp: 285,
        sellingPrice: 275,
        stock: 140,
      },
    ],
    isFeatured: true,
  },

  // 6. Amul Taaza Milk
  {
    name: 'Amul Taaza Homogenised Toned Milk',
    slug: 'amul-taaza-homogenised-toned-milk',
    brand: 'Amul',
    categorySlug: 'dairy-bread-eggs',
    sku: 'MM-MLK-006',
    barcode: '8901262020066',
    mrp: 74,
    sellingPrice: 72,
    stock: 200,
    lowStockThreshold: 25,
    unit: 'L',
    weight: '1 L Tetra Pak',
    tags: ['milk', 'amul', 'dairy', 'toned milk', 'beverages'],
    shortDescription: 'Long shelf life UHT treated toned milk, fresh and free from preservatives.',
    description: 'Amul Taaza Toned Milk is hygienically packed in aseptic cartons ensuring pure freshness and zero chemical preservatives.',
    images: [
      {
        url: '/images/products/amul-taaza-homogenised-toned-milk.jpg',
        alt: 'Amul Taaza Toned Milk 1L',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Fat', value: '3.0% Min' },
      { key: 'SNF', value: '8.5% Min' },
    ],
    variants: [],
    isFeatured: false,
  },

  // 7. Britannia Good Day
  {
    name: 'Britannia Good Day Rich Cashew Cookies',
    slug: 'britannia-good-day-rich-cashew-cookies',
    brand: 'Britannia',
    categorySlug: 'snacks-biscuits',
    subcategorySlug: 'biscuits-cookies',
    sku: 'MM-BIS-007',
    barcode: '8901063010077',
    mrp: 150,
    sellingPrice: 110,
    stock: 150,
    lowStockThreshold: 15,
    unit: 'pack',
    weight: '600 g (Multi-Pack)',
    tags: ['biscuits', 'cookies', 'cashew', 'britannia', 'snacks', 'tea time'],
    shortDescription: 'Crunchy butter cookies loaded with rich cashews and joyous smiles.',
    description: 'Britannia Good Day Cashew Cookies are delightful melt-in-mouth biscuits loaded with the goodness of real cashews.',
    images: [
      {
        url: '/images/products/britannia-good-day-rich-cashew-cookies.jpg',
        alt: 'Britannia Good Day Cashew Cookies',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Flavour', value: 'Rich Cashew' },
      { key: 'Vegetarian', value: '100% Veg' },
    ],
    variants: [],
    isFeatured: true,
  },

  // 8. Parle-G Gold Biscuits
  {
    name: 'Parle-G Gold Glucose Biscuits Mega Pack',
    slug: 'parle-g-gold-glucose-biscuits',
    brand: 'Parle',
    categorySlug: 'snacks-biscuits',
    subcategorySlug: 'biscuits-cookies',
    sku: 'MM-BIS-008',
    barcode: '8901719100088',
    mrp: 80,
    sellingPrice: 65,
    stock: 220,
    lowStockThreshold: 20,
    unit: 'pack',
    weight: '1 kg',
    tags: ['biscuits', 'parle-g', 'glucose', 'kids', 'tea time', 'staple'],
    shortDescription: 'India’s favorite glucose biscuit with rich wheat and milk goodness.',
    description: 'Filled with the goodness of milk and wheat, Parle-G has been a source of all-round nourishment for generations of Indians.',
    images: [
      {
        url: '/images/products/parle-g-gold-glucose-biscuits.jpg',
        alt: 'Parle-G Gold Biscuits 1kg',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Type', value: 'Glucose Biscuit' },
    ],
    variants: [],
    isFeatured: false,
  },

  // 9. Haldiram's Aloo Bhujia
  {
    name: 'Haldiram’s Nagpur Aloo Bhujia Spicy & Crispy',
    slug: 'haldirams-nagpur-aloo-bhujia',
    brand: 'Haldiram',
    categorySlug: 'snacks-biscuits',
    subcategorySlug: 'namkeen-chips',
    sku: 'MM-SNK-009',
    barcode: '8904004400099',
    mrp: 120,
    sellingPrice: 99,
    stock: 110,
    lowStockThreshold: 15,
    unit: 'pack',
    weight: '400 g',
    tags: ['namkeen', 'aloo bhujia', 'snacks', 'spicy', 'haldiram'],
    shortDescription: 'Crispy potato sev mixed with aromatic spices for an irresistible snack.',
    description: 'Haldiram’s Aloo Bhujia is a legendary savoury snack made from crisp potato flakes and chickpea flour tossed in fragrant seasonings.',
    images: [
      {
        url: '/images/products/haldirams-nagpur-aloo-bhujia.jpg',
        alt: 'Haldiram Aloo Bhujia',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Spice Level', value: 'Medium Spicy' },
    ],
    variants: [],
    isFeatured: true,
  },

  // 10. Coca-Cola Original
  {
    name: 'Coca-Cola Sparkling Soft Drink Can',
    slug: 'coca-cola-sparkling-soft-drink',
    brand: 'Coca-Cola',
    categorySlug: 'beverages',
    sku: 'MM-BEV-010',
    barcode: '8901764000100',
    mrp: 40,
    sellingPrice: 35,
    stock: 300, // Derived aggregate sum of variants (180 + 120)
    lowStockThreshold: 20,
    unit: 'can',
    weight: '300 ml',
    tags: ['coke', 'cold drink', 'soft drink', 'beverage', 'coca-cola'],
    shortDescription: 'Crisp, delicious, and refreshing sparkling cola to uplift any meal.',
    description: 'The real cola taste that brings people together over shared moments of celebration and refreshment.',
    images: [
      {
        url: '/images/products/coca-cola-can.jpg',
        alt: 'Coca-Cola 300ml Can',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Volume', value: '300 ml' },
      { key: 'Serve Chilled', value: 'Yes' },
    ],
    variants: [
      {
        sku: 'MM-BEV-010-300M',
        name: 'Coca-Cola Can 300 ml',
        attributes: { volume: '300 ml' },
        mrp: 40,
        sellingPrice: 35,
        stock: 180,
      },
      {
        sku: 'MM-BEV-010-750M',
        name: 'Coca-Cola Bottle 750 ml',
        attributes: { volume: '750 ml' },
        mrp: 45,
        sellingPrice: 40,
        stock: 120,
      },
    ],
    isFeatured: false,
  },

  // 11. Head & Shoulders Cool Menthol Shampoo
  {
    name: 'Head & Shoulders Cool Menthol Anti-Dandruff Shampoo',
    slug: 'head-and-shoulders-cool-menthol-shampoo',
    brand: 'Head & Shoulders',
    categorySlug: 'personal-care',
    subcategorySlug: 'shampoo-hair-care',
    sku: 'MM-SHM-011',
    barcode: '8901314000111',
    mrp: 375,
    sellingPrice: 299,
    stock: 155, // Derived aggregate sum of variants (50 + 75 + 30)
    lowStockThreshold: 10,
    unit: 'ml',
    weight: '340 ml',
    tags: ['shampoo', 'anti dandruff', 'hair care', 'head and shoulders', 'cooling'],
    shortDescription: 'Clinically proven up to 100% dandruff-free hair with icy cool menthol freshness.',
    description: 'Head & Shoulders Cool Menthol Shampoo cleanses scalp and hair leaving a fresh cooling sensation with zinc pyrithione anti-dandruff protection.',
    images: [
      {
        url: '/images/products/head-shoulders-cool-menthol.jpg',
        alt: 'Head & Shoulders Cool Menthol Shampoo',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Hair Type', value: 'All Hair Types' },
      { key: 'Benefit', value: 'Anti-Dandruff & Cooling' },
    ],
    variants: [
      {
        sku: 'MM-SHM-011-180M',
        name: 'Head & Shoulders Menthol 180 ml',
        attributes: { size: '180 ml' },
        mrp: 210,
        sellingPrice: 175,
        stock: 50,
      },
      {
        sku: 'MM-SHM-011-340M',
        name: 'Head & Shoulders Menthol 340 ml',
        attributes: { size: '340 ml' },
        mrp: 375,
        sellingPrice: 299,
        stock: 75,
      },
      {
        sku: 'MM-SHM-011-650M',
        name: 'Head & Shoulders Menthol 650 ml',
        attributes: { size: '650 ml' },
        mrp: 650,
        sellingPrice: 499,
        stock: 30,
      },
    ],
    isFeatured: true,
  },

  // 12. Clinic Plus Strong & Long Shampoo
  {
    name: 'Clinic Plus Strong & Long Health Shampoo',
    slug: 'clinic-plus-strong-and-long-shampoo',
    brand: 'Clinic Plus',
    categorySlug: 'personal-care',
    subcategorySlug: 'shampoo-hair-care',
    sku: 'MM-SHM-012',
    barcode: '8901030000122',
    mrp: 240,
    sellingPrice: 195,
    stock: 90,
    lowStockThreshold: 12,
    unit: 'ml',
    weight: '340 ml',
    tags: ['shampoo', 'hair care', 'clinic plus', 'milk protein'],
    shortDescription: 'Enriched with milk protein and multivitamins to make hair 35x stronger from root to tip.',
    description: 'Clinic Plus Strong & Long Shampoo contains milk protein formula that penetrates each hair strand providing deep nourishment.',
    images: [
      {
        url: '/images/products/clinic-plus-strong-long.jpg',
        alt: 'Clinic Plus Shampoo',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Ingredients', value: 'Milk Protein & Multivitamins' },
    ],
    variants: [],
    isFeatured: false,
  },

  // 13. Dettol Original Bathing Soap
  {
    name: 'Dettol Original Germ Protection Bathing Soap Bar',
    slug: 'dettol-original-germ-protection-soap',
    brand: 'Dettol',
    categorySlug: 'personal-care',
    subcategorySlug: 'soaps-body-wash',
    sku: 'MM-SOP-013',
    barcode: '8901396000133',
    mrp: 230,
    sellingPrice: 185,
    stock: 130,
    lowStockThreshold: 15,
    unit: 'pack',
    weight: '125 g (Pack of 4)',
    tags: ['soap', 'dettol', 'germ protection', 'hygiene', 'bathing bar'],
    shortDescription: 'Trusted 99.9% germ protection soap bar with refreshing pine fragrance.',
    description: 'Dettol Original Bathing Soap provides 100% better protection against illness-causing germs and bacteria. Recommended by medical professionals.',
    images: [
      {
        url: '/images/products/dettol-original-soap.jpg',
        alt: 'Dettol Soap Pack of 4',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Skin Type', value: 'All Skin Types' },
      { key: 'Pack Size', value: '4 x 125g bars' },
    ],
    variants: [],
    isFeatured: true,
  },

  // 14. Dove Cream Beauty Bathing Bar
  {
    name: 'Dove White Beauty Moisturizing Bathing Bar',
    slug: 'dove-white-beauty-bathing-bar',
    brand: 'Dove',
    categorySlug: 'personal-care',
    subcategorySlug: 'soaps-body-wash',
    sku: 'MM-SOP-014',
    barcode: '8901030000144',
    mrp: 320,
    sellingPrice: 275,
    stock: 85,
    lowStockThreshold: 10,
    unit: 'pack',
    weight: '100 g (Pack of 4)',
    tags: ['dove', 'soap', 'moisturizing', 'gentle', 'beauty bar'],
    shortDescription: 'Gentle cleansing bar formulated with 1/4th moisturizing cream for soft, glowing skin.',
    description: 'Dove is not a ordinary soap, it is a beauty bar. It combines gentle cleansing formula with signature 1/4 moisturizing cream to give softer, smoother skin.',
    images: [
      {
        url: '/images/products/dove-white-beauty-bar.jpg',
        alt: 'Dove White Beauty Bar',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Formulation', value: '1/4 Moisturizing Cream' },
      { key: 'pH Balanced', value: 'Yes' },
    ],
    variants: [],
    isFeatured: false,
  },

  // 15. Colgate Strong Teeth Toothpaste
  {
    name: 'Colgate Strong Teeth Anticavity Dental Toothpaste',
    slug: 'colgate-strong-teeth-toothpaste',
    brand: 'Colgate',
    categorySlug: 'personal-care',
    subcategorySlug: 'toothpaste-oral-care',
    sku: 'MM-TP-015',
    barcode: '8901314000155',
    mrp: 215,
    sellingPrice: 179,
    stock: 160,
    lowStockThreshold: 20,
    unit: 'pack',
    weight: '500 g (Pack of 2 x 250g)',
    tags: ['toothpaste', 'colgate', 'oral care', 'dental', 'teeth'],
    shortDescription: 'Contains Amino Shakti to add natural calcium and strengthen teeth enamel 2x.',
    description: 'Colgate Strong Teeth with Amino Shakti formula fortifies tooth enamel with natural calcium, keeping your smile strong and cavity-free.',
    images: [
      {
        url: '/images/products/colgate-strong-teeth-toothpaste.png',
        alt: 'Colgate Strong Teeth Toothpaste',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Flavour', value: 'Fresh Mint' },
      { key: 'Feature', value: 'Cavity Protection & Enamel Strength' },
    ],
    variants: [],
    isFeatured: true,
  },

  // 16. Surf Excel Matic Detergent Powder
  {
    name: 'Surf Excel Matic Front & Top Load Detergent Powder',
    slug: 'surf-excel-matic-detergent-powder',
    brand: 'Surf Excel',
    categorySlug: 'household-cleaning',
    subcategorySlug: 'detergents-laundry',
    sku: 'MM-DET-016',
    barcode: '8901030000166',
    mrp: 410,
    sellingPrice: 349,
    stock: 155, // Derived aggregate sum of variants (60 + 95)
    lowStockThreshold: 10,
    unit: 'kg',
    weight: '2 kg',
    tags: ['detergent', 'washing powder', 'surf excel', 'laundry', 'household'],
    shortDescription: 'Formulated with hand-rub action power to remove tough stains directly inside washing machines.',
    description: 'Surf Excel Matic is specially designed to give superior stain removal in washing machines without damaging delicate fabric threads or fading colours.',
    images: [
      {
        url: '/images/products/surf-excel-matic-detergent.jpg',
        alt: 'Surf Excel Matic 2kg',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Machine Compatibility', value: 'Top Load & Front Load' },
      { key: 'Stain Technology', value: 'Vanish Action Power' },
    ],
    variants: [
      {
        sku: 'MM-DET-016-1K',
        name: 'Surf Excel Matic 1 kg',
        attributes: { size: '1 kg' },
        mrp: 215,
        sellingPrice: 185,
        stock: 60,
      },
      {
        sku: 'MM-DET-016-2K',
        name: 'Surf Excel Matic 2 kg',
        attributes: { size: '2 kg' },
        mrp: 410,
        sellingPrice: 349,
        stock: 95,
      },
    ],
    isFeatured: true,
  },

  // 17. Tata Salt
  {
    name: 'Tata Salt Vacuum Evaporated Iodised Salt',
    slug: 'tata-salt-iodised-salt',
    brand: 'Tata Salt',
    categorySlug: 'groceries-staples',
    sku: 'MM-SLT-017',
    barcode: '8904043900177',
    mrp: 28,
    sellingPrice: 26,
    stock: 300,
    lowStockThreshold: 40,
    unit: 'kg',
    weight: '1 kg',
    tags: ['salt', 'tata salt', 'iodised', 'staple', 'grocery'],
    shortDescription: 'Desh Ka Namak. Pure vacuum evaporated iodised salt for everyday cooking.',
    description: 'Tata Salt has pioneered iodisation in India, offering purity and the exact required iodine level to support mental development in children.',
    images: [
      {
        url: '/images/products/tata-salt-vacuum-evaporated.png',
        alt: 'Tata Salt 1kg',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Type', value: 'Vacuum Evaporated Iodised Salt' },
      { key: 'Purity', value: '100% Pure' },
    ],
    variants: [],
    isFeatured: false,
  },

  // 18. Maggi 2-Minute Noodles
  {
    name: 'Maggi 2-Minute Masala Instant Noodles (Pack of 12)',
    slug: 'maggi-2-minute-masala-noodles-pack-12',
    brand: 'Maggi',
    categorySlug: 'snacks-biscuits',
    sku: 'MM-NOO-018',
    barcode: '8901058000188',
    mrp: 180,
    sellingPrice: 155,
    stock: 140,
    lowStockThreshold: 20,
    unit: 'pack',
    weight: '840 g (12 x 70g)',
    tags: ['maggi', 'instant noodles', 'snacks', 'fast food', 'masala'],
    shortDescription: 'Iconic Indian instant noodles made with authentic spices and goodness of iron.',
    description: 'Maggi 2-Minute Masala Noodles has been India’s favorite comfort food for decades. Easy to prepare in just two minutes with delicious taste.',
    images: [
      {
        url: '/images/products/maggi-2-minute-masala-noodles.jpg',
        alt: 'Maggi 2-Minute Noodles',
        isDefault: true,
      },
    ],
    specifications: [
      { key: 'Cooking Time', value: '2 Minutes' },
      { key: 'Pack Size', value: '12 Single Packs' },
    ],
    variants: [],
    isFeatured: true,
  },
];
