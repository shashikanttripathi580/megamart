import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId?: string;
  alt?: string;
  isDefault?: boolean;
}

export interface IProductSpecification {
  key: string;
  value: string;
}

export interface IProductVariant {
  sku: string;
  barcode?: string;
  name: string;
  attributes: Record<string, string>;
  mrp: number;
  sellingPrice: number;
  stock: number;
  image?: string;
}

export interface IProduct {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  brand: string;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  sku: string;
  barcode?: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  /**
   * For products without variants: authoritative inventory stock count.
   * For products with variants: derived aggregate sum(variant.stock) for catalog listing & display, NOT a separate inventory pool.
   */
  stock: number;
  lowStockThreshold: number;
  unit: string;
  weight?: string;
  tags: string[];
  images: IProductImage[];
  specifications: IProductSpecification[];
  variants: IProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends IProduct, Document {}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const ProductSpecificationSchema = new Schema<IProductSpecification>(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    mrp: {
      type: Number,
      required: true,
      min: [0, 'MRP cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: [0, 'Selling price cannot be negative'],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [4000, 'Description cannot exceed 4000 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
      index: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    barcode: {
      type: String,
      trim: true,
      sparse: true,
    },
    mrp: {
      type: Number,
      required: [true, 'MRP is required'],
      min: [0, 'MRP cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
      validate: {
        validator: function (this: IProductDocument, val: number) {
          return val <= this.mrp;
        },
        message: 'Selling price cannot exceed MRP',
      },
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Low stock threshold cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit of measurement is required (e.g., kg, g, L, pack)'],
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
    specifications: {
      type: [ProductSpecificationSchema],
      default: [],
    },
    variants: {
      type: [ProductVariantSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate discount percentage and synchronize aggregate stock
ProductSchema.pre('save', function (next) {
  if (this.mrp > 0 && this.sellingPrice >= 0) {
    this.discountPercentage = Math.max(0, Math.round(((this.mrp - this.sellingPrice) / this.mrp) * 100));
  }

  // If product has variants, authoritative stock is in variants[].stock.
  // Top-level Product.stock acts as a derived aggregate sum(variant.stock) for listing/filtering, NOT a separate inventory pool.
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
  }

  next();
});

// Indexes for high performance querying
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ subcategory: 1, isActive: 1 });
ProductSchema.index({ brand: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ sellingPrice: 1 });
ProductSchema.index({ name: 'text', brand: 'text', tags: 'text' });

export const Product: Model<IProductDocument> = model<IProductDocument>('Product', ProductSchema);
