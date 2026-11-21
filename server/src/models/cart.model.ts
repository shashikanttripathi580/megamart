import { Schema, model, Document, Model, Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  /**
   * Stores the ProductVariant SKU, not a MongoDB ObjectId.
   * Also aliased as variantId for backward compatibility.
   */
  variantSku?: string;
  variantId?: string;
  quantity: number;
  priceAtAddition: number;
}

export interface ICart {
  userId?: Types.ObjectId | null;
  guestId?: string | null;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartDocument extends ICart, Document {}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    /**
     * Stores the ProductVariant SKU, not a MongoDB ObjectId.
     */
    variantSku: {
      type: String,
      trim: true,
    },
    /**
     * Backward-compatible alias for variantSku.
     * Stores the ProductVariant SKU, not a MongoDB ObjectId.
     */
    variantId: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Cart quantity must be at least 1'],
      default: 1,
    },
    priceAtAddition: {
      type: Number,
      required: true,
      min: [0, 'Price at addition cannot be negative'],
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    guestId: {
      type: String,
      trim: true,
      index: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes
CartSchema.index({ guestId: 1 }, { sparse: true });
CartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // TTL: Auto-expire abandoned carts after 30 days

export const Cart: Model<ICartDocument> = model<ICartDocument>('Cart', CartSchema);
