import { Schema, model, Document, Model, Types } from 'mongoose';
import { AddressSchema, IAddress } from './address.schema.js';
import { ORDER_STATUS, OrderStatus, ORDER_STATUS_LIST } from '../constants/orderStatus.js';
import {
  PAYMENT_PROVIDER,
  PaymentProvider,
  PAYMENT_PROVIDER_LIST,
  PAYMENT_METHOD,
  PaymentMethod,
  PAYMENT_METHOD_LIST,
  PAYMENT_STATUS,
  PaymentStatus,
  PAYMENT_STATUS_LIST,
} from '../constants/payment.js';

export interface IOrderItem {
  productId: Types.ObjectId;
  /**
   * Stores the ProductVariant SKU, not a MongoDB ObjectId.
   * Also aliased as variantId for backward compatibility.
   */
  variantSku?: string;
  variantId?: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface IOrderCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface IOrderPricing {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface IOrderPayment {
  provider: PaymentProvider;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt?: Date;
}

export interface IOrder {
  orderNumber: string;
  userId: Types.ObjectId | null;
  customer: IOrderCustomer;
  items: IOrderItem[];
  pricing: IOrderPricing;
  deliveryAddress: IAddress;
  payment: IOrderPayment;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
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
    productName: {
      type: String,
      required: [true, 'Historical product name snapshot is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU snapshot is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const OrderCustomerSchema = new Schema<IOrderCustomer>(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Customer contact phone is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);

const OrderPricingSchema = new Schema<IOrderPricing>(
  {
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const OrderPaymentSchema = new Schema<IOrderPayment>(
  {
    provider: {
      type: String,
      enum: PAYMENT_PROVIDER_LIST,
      default: PAYMENT_PROVIDER.MOCK,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHOD_LIST,
      default: PAYMENT_METHOD.COD,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    status: {
      type: String,
      enum: PAYMENT_STATUS_LIST,
      default: PAYMENT_STATUS.PENDING,
    },
    paidAt: {
      type: Date,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Allowed to be null for guest checkout
      index: true,
    },
    customer: {
      type: OrderCustomerSchema,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (items: IOrderItem[]) {
          return items && items.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },
    pricing: {
      type: OrderPricingSchema,
      required: true,
    },
    deliveryAddress: {
      type: AddressSchema,
      required: true,
    },
    payment: {
      type: OrderPaymentSchema,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ORDER_STATUS_LIST,
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// High throughput indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ 'customer.phone': 1, createdAt: -1 }); // Fast lookup for guest customer orders
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });

export const Order: Model<IOrderDocument> = model<IOrderDocument>('Order', OrderSchema);
