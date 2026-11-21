import { Product, Category } from '@/types/store';

export const FALLBACK_CATEGORIES: Category[] = [
  {
    "_id": "cat_1",
    "name": "Groceries & Staples",
    "slug": "groceries-staples",
    "description": "Essential kitchen staples including atta, rice, dals, edible oils, and spices",
    "image": "/images/products/aashirvaad-shudh-chakki-atta.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 1,
    "subcategories": [
      {
        "_id": "cat_7",
        "name": "Flour & Atta",
        "slug": "flour-atta",
        "description": "Whole wheat atta, multi-grain flours, maida, and besan",
        "image": "",
        "parentCategory": {
          "_id": "cat_1",
          "name": "Groceries & Staples",
          "slug": "groceries-staples"
        },
        "isActive": true,
        "sortOrder": 1,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_8",
        "name": "Rice & Rice Products",
        "slug": "rice-products",
        "description": "Premium basmati rice, everyday sona masoori, and poha",
        "image": "",
        "parentCategory": {
          "_id": "cat_1",
          "name": "Groceries & Staples",
          "slug": "groceries-staples"
        },
        "isActive": true,
        "sortOrder": 2,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_9",
        "name": "Dals & Pulses",
        "slug": "dals-pulses",
        "description": "Unpolished toor dal, moong dal, chana dal, and urad dal",
        "image": "",
        "parentCategory": {
          "_id": "cat_1",
          "name": "Groceries & Staples",
          "slug": "groceries-staples"
        },
        "isActive": true,
        "sortOrder": 3,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_10",
        "name": "Edible Oils & Ghee",
        "slug": "edible-oils-ghee",
        "description": "Mustard oil, sunflower oil, olive oil, and pure desi ghee",
        "image": "",
        "parentCategory": {
          "_id": "cat_1",
          "name": "Groceries & Staples",
          "slug": "groceries-staples"
        },
        "isActive": true,
        "sortOrder": 4,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      }
    ],
    "createdAt": "2026-11-21T15:57:18.632Z",
    "updatedAt": "2026-11-21T15:57:18.656Z"
  },
  {
    "_id": "cat_2",
    "name": "Dairy, Bread & Eggs",
    "slug": "dairy-bread-eggs",
    "description": "Fresh farm milk, creamy butter, curd, paneer, and daily bakery essentials",
    "image": "/images/products/amul-pasteurised-butter.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 2,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_3",
    "name": "Snacks & Biscuits",
    "slug": "snacks-biscuits",
    "description": "Crispy namkeens, healthy dry fruits, tea-time biscuits, and sweet cookies",
    "image": "/images/products/britannia-good-day-rich-cashew-cookies.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 3,
    "subcategories": [
      {
        "_id": "cat_11",
        "name": "Biscuits & Cookies",
        "slug": "biscuits-cookies",
        "description": "Glucose biscuits, cream biscuits, butter cookies, and rusks",
        "image": "",
        "parentCategory": {
          "_id": "cat_3",
          "name": "Snacks & Biscuits",
          "slug": "snacks-biscuits"
        },
        "isActive": true,
        "sortOrder": 1,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_12",
        "name": "Namkeen & Chips",
        "slug": "namkeen-chips",
        "description": "Aloo bhujia, roasted mixtures, chips, and potato crisps",
        "image": "",
        "parentCategory": {
          "_id": "cat_3",
          "name": "Snacks & Biscuits",
          "slug": "snacks-biscuits"
        },
        "isActive": true,
        "sortOrder": 2,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      }
    ],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_4",
    "name": "Beverages",
    "slug": "beverages",
    "description": "Aromatic teas, premium coffees, refreshing juices, and cold soft drinks",
    "image": "/images/products/coca-cola-can.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 4,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_5",
    "name": "Personal Care",
    "slug": "personal-care",
    "description": "Nourishing soaps, shampoos, oral care, and skin hygiene products",
    "image": "/images/products/dettol-original-soap.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 5,
    "subcategories": [
      {
        "_id": "cat_13",
        "name": "Shampoo & Hair Care",
        "slug": "shampoo-hair-care",
        "description": "Anti-dandruff shampoos, conditioners, and herbal hair oils",
        "image": "",
        "parentCategory": {
          "_id": "cat_5",
          "name": "Personal Care",
          "slug": "personal-care"
        },
        "isActive": true,
        "sortOrder": 1,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_14",
        "name": "Bathing Soaps & Body Wash",
        "slug": "soaps-body-wash",
        "description": "Antibacterial soaps, beauty bars, and moisturizing washes",
        "image": "",
        "parentCategory": {
          "_id": "cat_5",
          "name": "Personal Care",
          "slug": "personal-care"
        },
        "isActive": true,
        "sortOrder": 2,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_15",
        "name": "Toothpaste & Oral Care",
        "slug": "toothpaste-oral-care",
        "description": "Cavity protection toothpastes, toothbrushes, and mouthwashes",
        "image": "",
        "parentCategory": {
          "_id": "cat_5",
          "name": "Personal Care",
          "slug": "personal-care"
        },
        "isActive": true,
        "sortOrder": 3,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      }
    ],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_6",
    "name": "Household & Cleaning",
    "slug": "household-cleaning",
    "description": "Detergents, fabric care, surface cleaners, and dishwashing essentials",
    "image": "/images/products/surf-excel-matic-detergent.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 6,
    "subcategories": [
      {
        "_id": "cat_16",
        "name": "Detergents & Laundry",
        "slug": "detergents-laundry",
        "description": "Washing powders, liquid detergents, and fabric conditioners",
        "image": "",
        "parentCategory": {
          "_id": "cat_6",
          "name": "Household & Cleaning",
          "slug": "household-cleaning"
        },
        "isActive": true,
        "sortOrder": 1,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      }
    ],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  }
];

export const ALL_FALLBACK_CATEGORIES: Category[] = [
  {
    "_id": "cat_1",
    "name": "Groceries & Staples",
    "slug": "groceries-staples",
    "description": "Essential kitchen staples including atta, rice, dals, edible oils, and spices",
    "image": "/images/products/aashirvaad-shudh-chakki-atta.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 1,
    "subcategories": [
      {
        "_id": "cat_7",
        "name": "Flour & Atta",
        "slug": "flour-atta",
        "description": "Whole wheat atta, multi-grain flours, maida, and besan",
        "image": "",
        "parentCategory": {
          "_id": "cat_1",
          "name": "Groceries & Staples",
          "slug": "groceries-staples"
        },
        "isActive": true,
        "sortOrder": 1,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_8",
        "name": "Rice & Rice Products",
        "slug": "rice-products",
        "description": "Premium basmati rice, everyday sona masoori, and poha",
        "image": "",
        "parentCategory": {
          "_id": "cat_1",
          "name": "Groceries & Staples",
          "slug": "groceries-staples"
        },
        "isActive": true,
        "sortOrder": 2,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_9",
        "name": "Dals & Pulses",
        "slug": "dals-pulses",
        "description": "Unpolished toor dal, moong dal, chana dal, and urad dal",
        "image": "",
        "parentCategory": {
          "_id": "cat_1",
          "name": "Groceries & Staples",
          "slug": "groceries-staples"
        },
        "isActive": true,
        "sortOrder": 3,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_10",
        "name": "Edible Oils & Ghee",
        "slug": "edible-oils-ghee",
        "description": "Mustard oil, sunflower oil, olive oil, and pure desi ghee",
        "image": "",
        "parentCategory": {
          "_id": "cat_1",
          "name": "Groceries & Staples",
          "slug": "groceries-staples"
        },
        "isActive": true,
        "sortOrder": 4,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      }
    ],
    "createdAt": "2026-11-21T15:57:18.632Z",
    "updatedAt": "2026-11-21T15:57:18.656Z"
  },
  {
    "_id": "cat_2",
    "name": "Dairy, Bread & Eggs",
    "slug": "dairy-bread-eggs",
    "description": "Fresh farm milk, creamy butter, curd, paneer, and daily bakery essentials",
    "image": "/images/products/amul-pasteurised-butter.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 2,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_3",
    "name": "Snacks & Biscuits",
    "slug": "snacks-biscuits",
    "description": "Crispy namkeens, healthy dry fruits, tea-time biscuits, and sweet cookies",
    "image": "/images/products/britannia-good-day-rich-cashew-cookies.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 3,
    "subcategories": [
      {
        "_id": "cat_11",
        "name": "Biscuits & Cookies",
        "slug": "biscuits-cookies",
        "description": "Glucose biscuits, cream biscuits, butter cookies, and rusks",
        "image": "",
        "parentCategory": {
          "_id": "cat_3",
          "name": "Snacks & Biscuits",
          "slug": "snacks-biscuits"
        },
        "isActive": true,
        "sortOrder": 1,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_12",
        "name": "Namkeen & Chips",
        "slug": "namkeen-chips",
        "description": "Aloo bhujia, roasted mixtures, chips, and potato crisps",
        "image": "",
        "parentCategory": {
          "_id": "cat_3",
          "name": "Snacks & Biscuits",
          "slug": "snacks-biscuits"
        },
        "isActive": true,
        "sortOrder": 2,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      }
    ],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_4",
    "name": "Beverages",
    "slug": "beverages",
    "description": "Aromatic teas, premium coffees, refreshing juices, and cold soft drinks",
    "image": "/images/products/coca-cola-can.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 4,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_5",
    "name": "Personal Care",
    "slug": "personal-care",
    "description": "Nourishing soaps, shampoos, oral care, and skin hygiene products",
    "image": "/images/products/dettol-original-soap.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 5,
    "subcategories": [
      {
        "_id": "cat_13",
        "name": "Shampoo & Hair Care",
        "slug": "shampoo-hair-care",
        "description": "Anti-dandruff shampoos, conditioners, and herbal hair oils",
        "image": "",
        "parentCategory": {
          "_id": "cat_5",
          "name": "Personal Care",
          "slug": "personal-care"
        },
        "isActive": true,
        "sortOrder": 1,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_14",
        "name": "Bathing Soaps & Body Wash",
        "slug": "soaps-body-wash",
        "description": "Antibacterial soaps, beauty bars, and moisturizing washes",
        "image": "",
        "parentCategory": {
          "_id": "cat_5",
          "name": "Personal Care",
          "slug": "personal-care"
        },
        "isActive": true,
        "sortOrder": 2,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      },
      {
        "_id": "cat_15",
        "name": "Toothpaste & Oral Care",
        "slug": "toothpaste-oral-care",
        "description": "Cavity protection toothpastes, toothbrushes, and mouthwashes",
        "image": "",
        "parentCategory": {
          "_id": "cat_5",
          "name": "Personal Care",
          "slug": "personal-care"
        },
        "isActive": true,
        "sortOrder": 3,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      }
    ],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_6",
    "name": "Household & Cleaning",
    "slug": "household-cleaning",
    "description": "Detergents, fabric care, surface cleaners, and dishwashing essentials",
    "image": "/images/products/surf-excel-matic-detergent.jpg",
    "parentCategory": null,
    "isActive": true,
    "sortOrder": 6,
    "subcategories": [
      {
        "_id": "cat_16",
        "name": "Detergents & Laundry",
        "slug": "detergents-laundry",
        "description": "Washing powders, liquid detergents, and fabric conditioners",
        "image": "",
        "parentCategory": {
          "_id": "cat_6",
          "name": "Household & Cleaning",
          "slug": "household-cleaning"
        },
        "isActive": true,
        "sortOrder": 1,
        "subcategories": [],
        "createdAt": "2026-11-21T15:57:18.657Z",
        "updatedAt": "2026-11-21T15:57:18.657Z"
      }
    ],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_7",
    "name": "Flour & Atta",
    "slug": "flour-atta",
    "description": "Whole wheat atta, multi-grain flours, maida, and besan",
    "image": "",
    "parentCategory": {
      "_id": "cat_1",
      "name": "Groceries & Staples",
      "slug": "groceries-staples"
    },
    "isActive": true,
    "sortOrder": 1,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_8",
    "name": "Rice & Rice Products",
    "slug": "rice-products",
    "description": "Premium basmati rice, everyday sona masoori, and poha",
    "image": "",
    "parentCategory": {
      "_id": "cat_1",
      "name": "Groceries & Staples",
      "slug": "groceries-staples"
    },
    "isActive": true,
    "sortOrder": 2,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_9",
    "name": "Dals & Pulses",
    "slug": "dals-pulses",
    "description": "Unpolished toor dal, moong dal, chana dal, and urad dal",
    "image": "",
    "parentCategory": {
      "_id": "cat_1",
      "name": "Groceries & Staples",
      "slug": "groceries-staples"
    },
    "isActive": true,
    "sortOrder": 3,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_10",
    "name": "Edible Oils & Ghee",
    "slug": "edible-oils-ghee",
    "description": "Mustard oil, sunflower oil, olive oil, and pure desi ghee",
    "image": "",
    "parentCategory": {
      "_id": "cat_1",
      "name": "Groceries & Staples",
      "slug": "groceries-staples"
    },
    "isActive": true,
    "sortOrder": 4,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_11",
    "name": "Biscuits & Cookies",
    "slug": "biscuits-cookies",
    "description": "Glucose biscuits, cream biscuits, butter cookies, and rusks",
    "image": "",
    "parentCategory": {
      "_id": "cat_3",
      "name": "Snacks & Biscuits",
      "slug": "snacks-biscuits"
    },
    "isActive": true,
    "sortOrder": 1,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_12",
    "name": "Namkeen & Chips",
    "slug": "namkeen-chips",
    "description": "Aloo bhujia, roasted mixtures, chips, and potato crisps",
    "image": "",
    "parentCategory": {
      "_id": "cat_3",
      "name": "Snacks & Biscuits",
      "slug": "snacks-biscuits"
    },
    "isActive": true,
    "sortOrder": 2,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_13",
    "name": "Shampoo & Hair Care",
    "slug": "shampoo-hair-care",
    "description": "Anti-dandruff shampoos, conditioners, and herbal hair oils",
    "image": "",
    "parentCategory": {
      "_id": "cat_5",
      "name": "Personal Care",
      "slug": "personal-care"
    },
    "isActive": true,
    "sortOrder": 1,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_14",
    "name": "Bathing Soaps & Body Wash",
    "slug": "soaps-body-wash",
    "description": "Antibacterial soaps, beauty bars, and moisturizing washes",
    "image": "",
    "parentCategory": {
      "_id": "cat_5",
      "name": "Personal Care",
      "slug": "personal-care"
    },
    "isActive": true,
    "sortOrder": 2,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_15",
    "name": "Toothpaste & Oral Care",
    "slug": "toothpaste-oral-care",
    "description": "Cavity protection toothpastes, toothbrushes, and mouthwashes",
    "image": "",
    "parentCategory": {
      "_id": "cat_5",
      "name": "Personal Care",
      "slug": "personal-care"
    },
    "isActive": true,
    "sortOrder": 3,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  },
  {
    "_id": "cat_16",
    "name": "Detergents & Laundry",
    "slug": "detergents-laundry",
    "description": "Washing powders, liquid detergents, and fabric conditioners",
    "image": "",
    "parentCategory": {
      "_id": "cat_6",
      "name": "Household & Cleaning",
      "slug": "household-cleaning"
    },
    "isActive": true,
    "sortOrder": 1,
    "subcategories": [],
    "createdAt": "2026-11-21T15:57:18.657Z",
    "updatedAt": "2026-11-21T15:57:18.657Z"
  }
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    "_id": "prod_1",
    "name": "Aashirvaad Shudh Chakki Atta (100% Whole Wheat)",
    "slug": "aashirvaad-shudh-chakki-atta",
    "description": "Aashirvaad Shudh Chakki Atta is made from the grains which are heavy on the palm, golden amber in colour and hard in bite. It is carefully ground using modern chakki grinding process which retains the natural taste and nutrition.",
    "shortDescription": "100% pure whole wheat chakki atta with natural dietary fibres for soft, fluffy rotis.",
    "brand": "Aashirvaad",
    "category": {
      "_id": "cat_1",
      "name": "Groceries & Staples",
      "slug": "groceries-staples"
    },
    "subcategory": {
      "_id": "cat_7",
      "name": "Flour & Atta",
      "slug": "flour-atta"
    },
    "sku": "MM-ATT-001",
    "barcode": "8901030010011",
    "mrp": 295,
    "sellingPrice": 245,
    "discountPercentage": 17,
    "stock": 210,
    "lowStockThreshold": 10,
    "unit": "kg",
    "weight": "5 kg",
    "tags": [
      "atta",
      "flour",
      "wheat",
      "rotis",
      "staple",
      "bestseller"
    ],
    "images": [
      {
        "url": "/images/products/aashirvaad-shudh-chakki-atta.jpg",
        "alt": "Aashirvaad Shudh Chakki Atta 5kg",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Dietary Preference",
        "value": "Vegetarian"
      },
      {
        "key": "Grain Type",
        "value": "100% Whole Wheat"
      },
      {
        "key": "Country of Origin",
        "value": "India"
      }
    ],
    "variants": [
      {
        "sku": "MM-ATT-001-1K",
        "name": "Aashirvaad Atta 1 kg",
        "attributes": {
          "size": "1 kg"
        },
        "mrp": 65,
        "sellingPrice": 58,
        "stock": 50
      },
      {
        "sku": "MM-ATT-001-5K",
        "name": "Aashirvaad Atta 5 kg",
        "attributes": {
          "size": "5 kg"
        },
        "mrp": 295,
        "sellingPrice": 245,
        "stock": 120
      },
      {
        "sku": "MM-ATT-001-10K",
        "name": "Aashirvaad Atta 10 kg",
        "attributes": {
          "size": "10 kg"
        },
        "mrp": 580,
        "sellingPrice": 475,
        "stock": 40
      }
    ],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_2",
    "name": "Fortune Sunlite Refined Sunflower Oil Pouch",
    "slug": "fortune-sunlite-refined-sunflower-oil",
    "description": "Fortune Sunlite Refined Sunflower Oil is a light, healthy and nutritious cooking oil. Easy to digest and helps keep your heart healthy while preparing your favorite delicacies.",
    "shortDescription": "Light and healthy edible cooking oil enriched with Vitamins A and D.",
    "brand": "Fortune",
    "category": {
      "_id": "cat_1",
      "name": "Groceries & Staples",
      "slug": "groceries-staples"
    },
    "subcategory": {
      "_id": "cat_10",
      "name": "Edible Oils & Ghee",
      "slug": "edible-oils-ghee"
    },
    "sku": "MM-OIL-002",
    "barcode": "8906007280022",
    "mrp": 165,
    "sellingPrice": 129,
    "discountPercentage": 22,
    "stock": 125,
    "lowStockThreshold": 15,
    "unit": "L",
    "weight": "1 L",
    "tags": [
      "oil",
      "cooking oil",
      "sunflower oil",
      "fortune",
      "healthy"
    ],
    "images": [
      {
        "url": "/images/products/fortune-sunlite-refined-sunflower-oil-pouch.jpg",
        "alt": "Fortune Sunflower Oil 1L Pouch",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Oil Type",
        "value": "Refined Sunflower Oil"
      },
      {
        "key": "Vitamins",
        "value": "Enriched with Vitamins A & D"
      }
    ],
    "variants": [
      {
        "sku": "MM-OIL-002-1L",
        "name": "Fortune Sunflower Oil 1 L Pouch",
        "attributes": {
          "volume": "1 L"
        },
        "mrp": 165,
        "sellingPrice": 129,
        "stock": 90
      },
      {
        "sku": "MM-OIL-002-5L",
        "name": "Fortune Sunflower Oil 5 L Can",
        "attributes": {
          "volume": "5 L"
        },
        "mrp": 810,
        "sellingPrice": 660,
        "stock": 35
      }
    ],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_3",
    "name": "Tata Sampann Unpolished Toor Dal (Arhar Dal)",
    "slug": "tata-sampann-unpolished-toor-dal",
    "description": "Tata Sampann Toor Dal is unpolished and does not undergo any artificial polishing with water, oil or leather, thereby retaining its wholesome goodness and authentic nutrient profile.",
    "shortDescription": "High protein unpolished toor dal for delicious and wholesome daily meals.",
    "brand": "Tata Sampann",
    "category": {
      "_id": "cat_1",
      "name": "Groceries & Staples",
      "slug": "groceries-staples"
    },
    "subcategory": {
      "_id": "cat_9",
      "name": "Dals & Pulses",
      "slug": "dals-pulses"
    },
    "sku": "MM-DAL-003",
    "barcode": "8904043900033",
    "mrp": 210,
    "sellingPrice": 175,
    "discountPercentage": 17,
    "stock": 80,
    "lowStockThreshold": 10,
    "unit": "kg",
    "weight": "1 kg",
    "tags": [
      "dal",
      "toor dal",
      "arhar",
      "pulses",
      "tata sampann",
      "protein"
    ],
    "images": [
      {
        "url": "/images/products/tata-sampann-unpolished-toor-dal.jpg",
        "alt": "Tata Sampann Toor Dal 1kg",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "value": "Unpolished Arhar / Toor Dal"
      },
      {
        "key": "Protein Rich",
        "value": "Yes"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_4",
    "name": "India Gate Feast Rozzana Basmati Rice",
    "slug": "india-gate-feast-rozzana-basmati-rice",
    "description": "India Gate Feast Rozzana Basmati rice is defined by its distinct aroma and fluffy slender grains, making everyday family meals hearty and memorable.",
    "shortDescription": "Aromatic, aged long grain basmati rice ideal for everyday cooking and special feasts.",
    "brand": "India Gate",
    "category": {
      "_id": "cat_1",
      "name": "Groceries & Staples",
      "slug": "groceries-staples"
    },
    "subcategory": {
      "_id": "cat_8",
      "name": "Rice & Rice Products",
      "slug": "rice-products"
    },
    "sku": "MM-RIC-004",
    "barcode": "8901414000044",
    "mrp": 499,
    "sellingPrice": 389,
    "discountPercentage": 22,
    "stock": 135,
    "lowStockThreshold": 8,
    "unit": "kg",
    "weight": "5 kg",
    "tags": [
      "rice",
      "basmati",
      "india gate",
      "grains",
      "pulao",
      "biryani"
    ],
    "images": [
      {
        "url": "/images/products/india-gate-feast-rozzana-basmati-rice.jpg",
        "alt": "India Gate Basmati Rice 5kg",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Grain Length",
        "value": "Medium-Long Basmati"
      },
      {
        "key": "Aged",
        "value": "Aged for superior aroma"
      }
    ],
    "variants": [
      {
        "sku": "MM-RIC-004-1K",
        "name": "India Gate Rozzana Rice 1 kg",
        "attributes": {
          "size": "1 kg"
        },
        "mrp": 110,
        "sellingPrice": 89,
        "stock": 70
      },
      {
        "sku": "MM-RIC-004-5K",
        "name": "India Gate Rozzana Rice 5 kg",
        "attributes": {
          "size": "5 kg"
        },
        "mrp": 499,
        "sellingPrice": 389,
        "stock": 65
      }
    ],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_5",
    "name": "Amul Pasteurised Butter (Delicious & Creamy)",
    "slug": "amul-pasteurised-butter",
    "description": "Amul Butter is an iconic Indian household staple. Spread it on bread, parathas, toast or use it in baking and cooking for wholesome richness.",
    "shortDescription": "Classic Utterly Butterly Delicious salted butter made from pure milk fat.",
    "brand": "Amul",
    "category": {
      "_id": "cat_2",
      "name": "Dairy, Bread & Eggs",
      "slug": "dairy-bread-eggs"
    },
    "sku": "MM-BUT-005",
    "barcode": "8901262010055",
    "mrp": 285,
    "sellingPrice": 275,
    "discountPercentage": 4,
    "stock": 240,
    "lowStockThreshold": 20,
    "unit": "g",
    "weight": "500 g",
    "tags": [
      "butter",
      "amul",
      "dairy",
      "breakfast",
      "fresh"
    ],
    "images": [
      {
        "url": "/images/products/amul-pasteurised-butter.jpg",
        "alt": "Amul Butter 500g",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Storage Condition",
        "value": "Keep Refrigerated at 4°C"
      },
      {
        "key": "Fat Content",
        "value": "80% Milk Fat Minimum"
      }
    ],
    "variants": [
      {
        "sku": "MM-BUT-005-100G",
        "name": "Amul Butter 100 g",
        "attributes": {
          "size": "100 g"
        },
        "mrp": 58,
        "sellingPrice": 56,
        "stock": 100
      },
      {
        "sku": "MM-BUT-005-500G",
        "name": "Amul Butter 500 g",
        "attributes": {
          "size": "500 g"
        },
        "mrp": 285,
        "sellingPrice": 275,
        "stock": 140
      }
    ],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_6",
    "name": "Amul Taaza Homogenised Toned Milk",
    "slug": "amul-taaza-homogenised-toned-milk",
    "description": "Amul Taaza Toned Milk is hygienically packed in aseptic cartons ensuring pure freshness and zero chemical preservatives.",
    "shortDescription": "Long shelf life UHT treated toned milk, fresh and free from preservatives.",
    "brand": "Amul",
    "category": {
      "_id": "cat_2",
      "name": "Dairy, Bread & Eggs",
      "slug": "dairy-bread-eggs"
    },
    "sku": "MM-MLK-006",
    "barcode": "8901262020066",
    "mrp": 74,
    "sellingPrice": 72,
    "discountPercentage": 3,
    "stock": 200,
    "lowStockThreshold": 25,
    "unit": "L",
    "weight": "1 L Tetra Pak",
    "tags": [
      "milk",
      "amul",
      "dairy",
      "toned milk",
      "beverages"
    ],
    "images": [
      {
        "url": "/images/products/amul-taaza-homogenised-toned-milk.jpg",
        "alt": "Amul Taaza Toned Milk 1L",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Fat",
        "value": "3.0% Min"
      },
      {
        "key": "SNF",
        "value": "8.5% Min"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_7",
    "name": "Britannia Good Day Rich Cashew Cookies",
    "slug": "britannia-good-day-rich-cashew-cookies",
    "description": "Britannia Good Day Cashew Cookies are delightful melt-in-mouth biscuits loaded with the goodness of real cashews.",
    "shortDescription": "Crunchy butter cookies loaded with rich cashews and joyous smiles.",
    "brand": "Britannia",
    "category": {
      "_id": "cat_3",
      "name": "Snacks & Biscuits",
      "slug": "snacks-biscuits"
    },
    "subcategory": {
      "_id": "cat_11",
      "name": "Biscuits & Cookies",
      "slug": "biscuits-cookies"
    },
    "sku": "MM-BIS-007",
    "barcode": "8901063010077",
    "mrp": 150,
    "sellingPrice": 110,
    "discountPercentage": 27,
    "stock": 150,
    "lowStockThreshold": 15,
    "unit": "pack",
    "weight": "600 g (Multi-Pack)",
    "tags": [
      "biscuits",
      "cookies",
      "cashew",
      "britannia",
      "snacks",
      "tea time"
    ],
    "images": [
      {
        "url": "/images/products/britannia-good-day-rich-cashew-cookies.jpg",
        "alt": "Britannia Good Day Cashew Cookies",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Flavour",
        "value": "Rich Cashew"
      },
      {
        "key": "Vegetarian",
        "value": "100% Veg"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_8",
    "name": "Parle-G Gold Glucose Biscuits Mega Pack",
    "slug": "parle-g-gold-glucose-biscuits",
    "description": "Filled with the goodness of milk and wheat, Parle-G has been a source of all-round nourishment for generations of Indians.",
    "shortDescription": "India’s favorite glucose biscuit with rich wheat and milk goodness.",
    "brand": "Parle",
    "category": {
      "_id": "cat_3",
      "name": "Snacks & Biscuits",
      "slug": "snacks-biscuits"
    },
    "subcategory": {
      "_id": "cat_11",
      "name": "Biscuits & Cookies",
      "slug": "biscuits-cookies"
    },
    "sku": "MM-BIS-008",
    "barcode": "8901719100088",
    "mrp": 80,
    "sellingPrice": 65,
    "discountPercentage": 19,
    "stock": 220,
    "lowStockThreshold": 20,
    "unit": "pack",
    "weight": "1 kg",
    "tags": [
      "biscuits",
      "parle-g",
      "glucose",
      "kids",
      "tea time",
      "staple"
    ],
    "images": [
      {
        "url": "/images/products/parle-g-gold-glucose-biscuits.jpg",
        "alt": "Parle-G Gold Biscuits 1kg",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "value": "Glucose Biscuit"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_9",
    "name": "Haldiram’s Nagpur Aloo Bhujia Spicy & Crispy",
    "slug": "haldirams-nagpur-aloo-bhujia",
    "description": "Haldiram’s Aloo Bhujia is a legendary savoury snack made from crisp potato flakes and chickpea flour tossed in fragrant seasonings.",
    "shortDescription": "Crispy potato sev mixed with aromatic spices for an irresistible snack.",
    "brand": "Haldiram",
    "category": {
      "_id": "cat_3",
      "name": "Snacks & Biscuits",
      "slug": "snacks-biscuits"
    },
    "subcategory": {
      "_id": "cat_12",
      "name": "Namkeen & Chips",
      "slug": "namkeen-chips"
    },
    "sku": "MM-SNK-009",
    "barcode": "8904004400099",
    "mrp": 120,
    "sellingPrice": 99,
    "discountPercentage": 18,
    "stock": 110,
    "lowStockThreshold": 15,
    "unit": "pack",
    "weight": "400 g",
    "tags": [
      "namkeen",
      "aloo bhujia",
      "snacks",
      "spicy",
      "haldiram"
    ],
    "images": [
      {
        "url": "/images/products/haldirams-nagpur-aloo-bhujia.jpg",
        "alt": "Haldiram Aloo Bhujia",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Spice Level",
        "value": "Medium Spicy"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_10",
    "name": "Coca-Cola Sparkling Soft Drink Can",
    "slug": "coca-cola-sparkling-soft-drink",
    "description": "The real cola taste that brings people together over shared moments of celebration and refreshment.",
    "shortDescription": "Crisp, delicious, and refreshing sparkling cola to uplift any meal.",
    "brand": "Coca-Cola",
    "category": {
      "_id": "cat_4",
      "name": "Beverages",
      "slug": "beverages"
    },
    "sku": "MM-BEV-010",
    "barcode": "8901764000100",
    "mrp": 40,
    "sellingPrice": 35,
    "discountPercentage": 13,
    "stock": 300,
    "lowStockThreshold": 20,
    "unit": "can",
    "weight": "300 ml",
    "tags": [
      "coke",
      "cold drink",
      "soft drink",
      "beverage",
      "coca-cola"
    ],
    "images": [
      {
        "url": "/images/products/coca-cola-can.jpg",
        "alt": "Coca-Cola 300ml Can",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Volume",
        "value": "300 ml"
      },
      {
        "key": "Serve Chilled",
        "value": "Yes"
      }
    ],
    "variants": [
      {
        "sku": "MM-BEV-010-300M",
        "name": "Coca-Cola Can 300 ml",
        "attributes": {
          "volume": "300 ml"
        },
        "mrp": 40,
        "sellingPrice": 35,
        "stock": 180
      },
      {
        "sku": "MM-BEV-010-750M",
        "name": "Coca-Cola Bottle 750 ml",
        "attributes": {
          "volume": "750 ml"
        },
        "mrp": 45,
        "sellingPrice": 40,
        "stock": 120
      }
    ],
    "isActive": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_11",
    "name": "Head & Shoulders Cool Menthol Anti-Dandruff Shampoo",
    "slug": "head-and-shoulders-cool-menthol-shampoo",
    "description": "Head & Shoulders Cool Menthol Shampoo cleanses scalp and hair leaving a fresh cooling sensation with zinc pyrithione anti-dandruff protection.",
    "shortDescription": "Clinically proven up to 100% dandruff-free hair with icy cool menthol freshness.",
    "brand": "Head & Shoulders",
    "category": {
      "_id": "cat_5",
      "name": "Personal Care",
      "slug": "personal-care"
    },
    "subcategory": {
      "_id": "cat_13",
      "name": "Shampoo & Hair Care",
      "slug": "shampoo-hair-care"
    },
    "sku": "MM-SHM-011",
    "barcode": "8901314000111",
    "mrp": 375,
    "sellingPrice": 299,
    "discountPercentage": 20,
    "stock": 155,
    "lowStockThreshold": 10,
    "unit": "ml",
    "weight": "340 ml",
    "tags": [
      "shampoo",
      "anti dandruff",
      "hair care",
      "head and shoulders",
      "cooling"
    ],
    "images": [
      {
        "url": "/images/products/head-shoulders-cool-menthol.jpg",
        "alt": "Head & Shoulders Cool Menthol Shampoo",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Hair Type",
        "value": "All Hair Types"
      },
      {
        "key": "Benefit",
        "value": "Anti-Dandruff & Cooling"
      }
    ],
    "variants": [
      {
        "sku": "MM-SHM-011-180M",
        "name": "Head & Shoulders Menthol 180 ml",
        "attributes": {
          "size": "180 ml"
        },
        "mrp": 210,
        "sellingPrice": 175,
        "stock": 50
      },
      {
        "sku": "MM-SHM-011-340M",
        "name": "Head & Shoulders Menthol 340 ml",
        "attributes": {
          "size": "340 ml"
        },
        "mrp": 375,
        "sellingPrice": 299,
        "stock": 75
      },
      {
        "sku": "MM-SHM-011-650M",
        "name": "Head & Shoulders Menthol 650 ml",
        "attributes": {
          "size": "650 ml"
        },
        "mrp": 650,
        "sellingPrice": 499,
        "stock": 30
      }
    ],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_12",
    "name": "Clinic Plus Strong & Long Health Shampoo",
    "slug": "clinic-plus-strong-and-long-shampoo",
    "description": "Clinic Plus Strong & Long Shampoo contains milk protein formula that penetrates each hair strand providing deep nourishment.",
    "shortDescription": "Enriched with milk protein and multivitamins to make hair 35x stronger from root to tip.",
    "brand": "Clinic Plus",
    "category": {
      "_id": "cat_5",
      "name": "Personal Care",
      "slug": "personal-care"
    },
    "subcategory": {
      "_id": "cat_13",
      "name": "Shampoo & Hair Care",
      "slug": "shampoo-hair-care"
    },
    "sku": "MM-SHM-012",
    "barcode": "8901030000122",
    "mrp": 240,
    "sellingPrice": 195,
    "discountPercentage": 19,
    "stock": 90,
    "lowStockThreshold": 12,
    "unit": "ml",
    "weight": "340 ml",
    "tags": [
      "shampoo",
      "hair care",
      "clinic plus",
      "milk protein"
    ],
    "images": [
      {
        "url": "/images/products/clinic-plus-strong-long.jpg",
        "alt": "Clinic Plus Shampoo",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Ingredients",
        "value": "Milk Protein & Multivitamins"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_13",
    "name": "Dettol Original Germ Protection Bathing Soap Bar",
    "slug": "dettol-original-germ-protection-soap",
    "description": "Dettol Original Bathing Soap provides 100% better protection against illness-causing germs and bacteria. Recommended by medical professionals.",
    "shortDescription": "Trusted 99.9% germ protection soap bar with refreshing pine fragrance.",
    "brand": "Dettol",
    "category": {
      "_id": "cat_5",
      "name": "Personal Care",
      "slug": "personal-care"
    },
    "subcategory": {
      "_id": "cat_14",
      "name": "Bathing Soaps & Body Wash",
      "slug": "soaps-body-wash"
    },
    "sku": "MM-SOP-013",
    "barcode": "8901396000133",
    "mrp": 230,
    "sellingPrice": 185,
    "discountPercentage": 20,
    "stock": 130,
    "lowStockThreshold": 15,
    "unit": "pack",
    "weight": "125 g (Pack of 4)",
    "tags": [
      "soap",
      "dettol",
      "germ protection",
      "hygiene",
      "bathing bar"
    ],
    "images": [
      {
        "url": "/images/products/dettol-original-soap.jpg",
        "alt": "Dettol Soap Pack of 4",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Skin Type",
        "value": "All Skin Types"
      },
      {
        "key": "Pack Size",
        "value": "4 x 125g bars"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_14",
    "name": "Dove White Beauty Moisturizing Bathing Bar",
    "slug": "dove-white-beauty-bathing-bar",
    "description": "Dove is not a ordinary soap, it is a beauty bar. It combines gentle cleansing formula with signature 1/4 moisturizing cream to give softer, smoother skin.",
    "shortDescription": "Gentle cleansing bar formulated with 1/4th moisturizing cream for soft, glowing skin.",
    "brand": "Dove",
    "category": {
      "_id": "cat_5",
      "name": "Personal Care",
      "slug": "personal-care"
    },
    "subcategory": {
      "_id": "cat_14",
      "name": "Bathing Soaps & Body Wash",
      "slug": "soaps-body-wash"
    },
    "sku": "MM-SOP-014",
    "barcode": "8901030000144",
    "mrp": 320,
    "sellingPrice": 275,
    "discountPercentage": 14,
    "stock": 85,
    "lowStockThreshold": 10,
    "unit": "pack",
    "weight": "100 g (Pack of 4)",
    "tags": [
      "dove",
      "soap",
      "moisturizing",
      "gentle",
      "beauty bar"
    ],
    "images": [
      {
        "url": "/images/products/dove-white-beauty-bar.jpg",
        "alt": "Dove White Beauty Bar",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Formulation",
        "value": "1/4 Moisturizing Cream"
      },
      {
        "key": "pH Balanced",
        "value": "Yes"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_15",
    "name": "Colgate Strong Teeth Anticavity Dental Toothpaste",
    "slug": "colgate-strong-teeth-toothpaste",
    "description": "Colgate Strong Teeth with Amino Shakti formula fortifies tooth enamel with natural calcium, keeping your smile strong and cavity-free.",
    "shortDescription": "Contains Amino Shakti to add natural calcium and strengthen teeth enamel 2x.",
    "brand": "Colgate",
    "category": {
      "_id": "cat_5",
      "name": "Personal Care",
      "slug": "personal-care"
    },
    "subcategory": {
      "_id": "cat_15",
      "name": "Toothpaste & Oral Care",
      "slug": "toothpaste-oral-care"
    },
    "sku": "MM-TP-015",
    "barcode": "8901314000155",
    "mrp": 215,
    "sellingPrice": 179,
    "discountPercentage": 17,
    "stock": 160,
    "lowStockThreshold": 20,
    "unit": "pack",
    "weight": "500 g (Pack of 2 x 250g)",
    "tags": [
      "toothpaste",
      "colgate",
      "oral care",
      "dental",
      "teeth"
    ],
    "images": [
      {
        "url": "/images/products/colgate-strong-teeth-toothpaste.png",
        "alt": "Colgate Strong Teeth Toothpaste",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Flavour",
        "value": "Fresh Mint"
      },
      {
        "key": "Feature",
        "value": "Cavity Protection & Enamel Strength"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_16",
    "name": "Surf Excel Matic Front & Top Load Detergent Powder",
    "slug": "surf-excel-matic-detergent-powder",
    "description": "Surf Excel Matic is specially designed to give superior stain removal in washing machines without damaging delicate fabric threads or fading colours.",
    "shortDescription": "Formulated with hand-rub action power to remove tough stains directly inside washing machines.",
    "brand": "Surf Excel",
    "category": {
      "_id": "cat_6",
      "name": "Household & Cleaning",
      "slug": "household-cleaning"
    },
    "subcategory": {
      "_id": "cat_16",
      "name": "Detergents & Laundry",
      "slug": "detergents-laundry"
    },
    "sku": "MM-DET-016",
    "barcode": "8901030000166",
    "mrp": 410,
    "sellingPrice": 349,
    "discountPercentage": 15,
    "stock": 155,
    "lowStockThreshold": 10,
    "unit": "kg",
    "weight": "2 kg",
    "tags": [
      "detergent",
      "washing powder",
      "surf excel",
      "laundry",
      "household"
    ],
    "images": [
      {
        "url": "/images/products/surf-excel-matic-detergent.jpg",
        "alt": "Surf Excel Matic 2kg",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Machine Compatibility",
        "value": "Top Load & Front Load"
      },
      {
        "key": "Stain Technology",
        "value": "Vanish Action Power"
      }
    ],
    "variants": [
      {
        "sku": "MM-DET-016-1K",
        "name": "Surf Excel Matic 1 kg",
        "attributes": {
          "size": "1 kg"
        },
        "mrp": 215,
        "sellingPrice": 185,
        "stock": 60
      },
      {
        "sku": "MM-DET-016-2K",
        "name": "Surf Excel Matic 2 kg",
        "attributes": {
          "size": "2 kg"
        },
        "mrp": 410,
        "sellingPrice": 349,
        "stock": 95
      }
    ],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_17",
    "name": "Tata Salt Vacuum Evaporated Iodised Salt",
    "slug": "tata-salt-iodised-salt",
    "description": "Tata Salt has pioneered iodisation in India, offering purity and the exact required iodine level to support mental development in children.",
    "shortDescription": "Desh Ka Namak. Pure vacuum evaporated iodised salt for everyday cooking.",
    "brand": "Tata Salt",
    "category": {
      "_id": "cat_1",
      "name": "Groceries & Staples",
      "slug": "groceries-staples"
    },
    "sku": "MM-SLT-017",
    "barcode": "8904043900177",
    "mrp": 28,
    "sellingPrice": 26,
    "discountPercentage": 7,
    "stock": 300,
    "lowStockThreshold": 40,
    "unit": "kg",
    "weight": "1 kg",
    "tags": [
      "salt",
      "tata salt",
      "iodised",
      "staple",
      "grocery"
    ],
    "images": [
      {
        "url": "/images/products/tata-salt-vacuum-evaporated.png",
        "alt": "Tata Salt 1kg",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Type",
        "value": "Vacuum Evaporated Iodised Salt"
      },
      {
        "key": "Purity",
        "value": "100% Pure"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": false,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  },
  {
    "_id": "prod_18",
    "name": "Maggi 2-Minute Masala Instant Noodles (Pack of 12)",
    "slug": "maggi-2-minute-masala-noodles-pack-12",
    "description": "Maggi 2-Minute Masala Noodles has been India’s favorite comfort food for decades. Easy to prepare in just two minutes with delicious taste.",
    "shortDescription": "Iconic Indian instant noodles made with authentic spices and goodness of iron.",
    "brand": "Maggi",
    "category": {
      "_id": "cat_3",
      "name": "Snacks & Biscuits",
      "slug": "snacks-biscuits"
    },
    "sku": "MM-NOO-018",
    "barcode": "8901058000188",
    "mrp": 180,
    "sellingPrice": 155,
    "discountPercentage": 14,
    "stock": 140,
    "lowStockThreshold": 20,
    "unit": "pack",
    "weight": "840 g (12 x 70g)",
    "tags": [
      "maggi",
      "instant noodles",
      "snacks",
      "fast food",
      "masala"
    ],
    "images": [
      {
        "url": "/images/products/maggi-2-minute-masala-noodles.jpg",
        "alt": "Maggi 2-Minute Noodles",
        "isDefault": true
      }
    ],
    "specifications": [
      {
        "key": "Cooking Time",
        "value": "2 Minutes"
      },
      {
        "key": "Pack Size",
        "value": "12 Single Packs"
      }
    ],
    "variants": [],
    "isActive": true,
    "isFeatured": true,
    "createdAt": "2026-11-21T15:57:18.658Z",
    "updatedAt": "2026-11-21T15:57:18.658Z"
  }
];
