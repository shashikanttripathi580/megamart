import { Types } from 'mongoose';
import { Order, IOrderDocument, IOrderItem } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { PRICING_CONFIG } from '../constants/pricing.js';
import { PAYMENT_METHOD, PAYMENT_PROVIDER, PAYMENT_STATUS } from '../constants/payment.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';
import { ApiError } from '../utils/apiError.js';
import { isDbConnected } from '../config/db.js';

export interface CreateOrderItemInput {
  productId: string;
  variantSku?: string;
  quantity: number;
}

export interface CreateOrderInput {
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  deliveryAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    addressType?: 'home' | 'work' | 'other';
  };
  items: CreateOrderItemInput[];
  paymentMethod: 'cod' | 'mock_online';
  notes?: string;
}

export interface ValidateCartItemInput {
  productId: string;
  variantSku?: string;
  quantity: number;
  clientPrice?: number;
}

export interface CartValidationIssue {
  type: 'out_of_stock' | 'insufficient_stock' | 'price_changed' | 'unavailable';
  productId: string;
  variantSku?: string;
  productName: string;
  message: string;
  clientPrice?: number;
  serverPrice?: number;
  availableStock?: number;
  requestedQuantity?: number;
}

export interface ValidatedCartItem {
  productId: string;
  variantSku?: string;
  productName: string;
  sku: string;
  unitPrice: number;
  mrp: number;
  quantity: number;
  totalPrice: number;
  stock: number;
  image?: string;
}

export interface CartValidationResult {
  isValid: boolean;
  hasPriceChanges: boolean;
  issues: CartValidationIssue[];
  items: ValidatedCartItem[];
  pricing: {
    subtotal: number;
    mrpTotal: number;
    discount: number;
    deliveryFee: number;
    tax: number;
    total: number;
  };
}

export class OrderService {
  /**
   * Validate a list of cart items against current database products and stock
   */
  async validateCart(inputItems: ValidateCartItemInput[]): Promise<CartValidationResult> {
    if (!isDbConnected()) {
      throw new ApiError(503, 'Database is disconnected');
    }

    if (!inputItems || inputItems.length === 0) {
      throw ApiError.badRequest('Cart items list cannot be empty');
    }

    const productIds = inputItems.map((item) => new Types.ObjectId(item.productId));
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map<string, any>();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    const issues: CartValidationIssue[] = [];
    const validatedItems: ValidatedCartItem[] = [];
    let hasPriceChanges = false;

    let subtotal = 0;
    let mrpTotal = 0;

    for (const item of inputItems) {
      const product = productMap.get(item.productId);

      if (!product || !product.isActive) {
        issues.push({
          type: 'unavailable',
          productId: item.productId,
          variantSku: item.variantSku,
          productName: product?.name || 'Unknown Product',
          message: `Product is no longer available in our supermarket`,
        });
        continue;
      }

      let unitPrice = product.sellingPrice;
      let unitMrp = product.mrp;
      let availableStock = product.stock;
      let itemSku = product.sku;
      let itemImage = product.images?.find((img: any) => img.isDefault)?.url || product.images?.[0]?.url;
      let displayName = product.name;

      if (item.variantSku) {
        const variant = product.variants?.find((v: any) => v.sku === item.variantSku);
        if (!variant) {
          issues.push({
            type: 'unavailable',
            productId: item.productId,
            variantSku: item.variantSku,
            productName: product.name,
            message: `Selected variant (${item.variantSku}) is no longer available`,
          });
          continue;
        }

        unitPrice = variant.sellingPrice;
        unitMrp = variant.mrp;
        availableStock = variant.stock;
        itemSku = variant.sku;
        itemImage = variant.image || itemImage;
        displayName = `${product.name} (${variant.name})`;
      }

      // Check stock availability
      if (availableStock <= 0) {
        issues.push({
          type: 'out_of_stock',
          productId: item.productId,
          variantSku: item.variantSku,
          productName: displayName,
          message: `'${displayName}' is currently out of stock`,
          availableStock: 0,
          requestedQuantity: item.quantity,
        });
      } else if (item.quantity > availableStock) {
        issues.push({
          type: 'insufficient_stock',
          productId: item.productId,
          variantSku: item.variantSku,
          productName: displayName,
          message: `Only ${availableStock} units available for '${displayName}'`,
          availableStock,
          requestedQuantity: item.quantity,
        });
      }

      // Check price changes compared to client stored price
      if (item.clientPrice !== undefined && item.clientPrice !== unitPrice) {
        hasPriceChanges = true;
        issues.push({
          type: 'price_changed',
          productId: item.productId,
          variantSku: item.variantSku,
          productName: displayName,
          message: `Price for '${displayName}' changed from ₹${item.clientPrice} to ₹${unitPrice}`,
          clientPrice: item.clientPrice,
          serverPrice: unitPrice,
        });
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;
      mrpTotal += unitMrp * item.quantity;

      validatedItems.push({
        productId: item.productId,
        variantSku: item.variantSku,
        productName: displayName,
        sku: itemSku,
        unitPrice,
        mrp: unitMrp,
        quantity: item.quantity,
        totalPrice: itemTotal,
        stock: availableStock,
        image: itemImage,
      });
    }

    const discount = Math.max(0, mrpTotal - subtotal);
    const deliveryFee =
      subtotal >= PRICING_CONFIG.FREE_DELIVERY_THRESHOLD || validatedItems.length === 0
        ? 0
        : PRICING_CONFIG.STANDARD_DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    const blockingIssues = issues.filter(
      (issue) => issue.type === 'unavailable' || issue.type === 'out_of_stock' || issue.type === 'insufficient_stock'
    );

    return {
      isValid: blockingIssues.length === 0 && validatedItems.length > 0,
      hasPriceChanges,
      issues,
      items: validatedItems,
      pricing: {
        subtotal,
        mrpTotal,
        discount,
        deliveryFee,
        tax: 0,
        total,
      },
    };
  }

  /**
   * Place an order with server-calculated prices, stock validation, and snapshotting
   */
  async createOrder(input: CreateOrderInput): Promise<IOrderDocument> {
    if (!isDbConnected()) {
      throw new ApiError(503, 'Database is disconnected');
    }

    if (!input.items || input.items.length === 0) {
      throw ApiError.badRequest('Cannot place an order with an empty cart');
    }

    // 1. Fetch current product documents from database
    const productIds = input.items.map((i) => new Types.ObjectId(i.productId));
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map<string, any>();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    // 2. Validate every item and calculate authoritative item snapshots
    const orderItems: IOrderItem[] = [];
    let subtotal = 0;
    let mrpTotal = 0;

    for (const item of input.items) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw ApiError.badRequest(`Product with ID '${item.productId}' not found in supermarket catalog`);
      }

      if (!product.isActive) {
        throw ApiError.badRequest(`Product '${product.name}' is inactive and cannot be purchased`);
      }

      let unitPrice = product.sellingPrice;
      let unitMrp = product.mrp;
      let availableStock = product.stock;
      let itemSku = product.sku;
      let itemImage = product.images?.find((img: any) => img.isDefault)?.url || product.images?.[0]?.url;
      let displayName = product.name;

      if (item.variantSku) {
        const variant = product.variants?.find((v: any) => v.sku === item.variantSku);
        if (!variant) {
          throw ApiError.badRequest(`Variant SKU '${item.variantSku}' not found for product '${product.name}'`);
        }

        unitPrice = variant.sellingPrice;
        unitMrp = variant.mrp;
        availableStock = variant.stock;
        itemSku = variant.sku;
        itemImage = variant.image || itemImage;
        displayName = `${product.name} (${variant.name})`;
      }

      // Stock validation
      if (availableStock <= 0) {
        throw ApiError.badRequest(`Product '${displayName}' is currently out of stock`);
      }

      if (item.quantity > availableStock) {
        throw ApiError.badRequest(
          `Requested quantity (${item.quantity}) for '${displayName}' exceeds available stock (${availableStock})`
        );
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;
      mrpTotal += unitMrp * item.quantity;

      orderItems.push({
        productId: product._id,
        variantSku: item.variantSku,
        variantId: item.variantSku, // Backward compatibility alias
        productName: displayName,
        sku: itemSku,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
        image: itemImage,
      });
    }

    // 3. Server-side authoritative pricing calculations
    const discount = Math.max(0, mrpTotal - subtotal);
    const deliveryFee =
      subtotal >= PRICING_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : PRICING_CONFIG.STANDARD_DELIVERY_FEE;
    const tax = 0;
    const total = subtotal + deliveryFee + tax;

    // 4. Generate unique, clean order number: MM-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MM-${dateStr}-${randomSuffix}`;

    // 5. Payment details (Mock payment)
    const isMockOnline = input.paymentMethod === 'mock_online';
    const payment = {
      provider: PAYMENT_PROVIDER.MOCK,
      paymentMethod: isMockOnline ? PAYMENT_METHOD.MOCK_ONLINE : PAYMENT_METHOD.COD,
      transactionId: isMockOnline ? `TXN-MOCK-${Date.now()}` : `COD-${Date.now()}`,
      amount: total,
      currency: 'INR',
      status: isMockOnline ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.PENDING,
      paidAt: isMockOnline ? new Date() : undefined,
    };

    // 6. Create Order document
    const order = await Order.create({
      orderNumber,
      userId: null, // Guest order explicitly supported
      customer: {
        name: input.customer.name.trim(),
        phone: input.customer.phone.trim(),
        email: input.customer.email ? input.customer.email.trim() : undefined,
      },
      items: orderItems,
      pricing: {
        subtotal,
        discount,
        deliveryFee,
        tax,
        total,
      },
      deliveryAddress: {
        fullName: input.deliveryAddress.fullName.trim(),
        phone: input.deliveryAddress.phone.trim(),
        addressLine1: input.deliveryAddress.addressLine1.trim(),
        addressLine2: input.deliveryAddress.addressLine2 ? input.deliveryAddress.addressLine2.trim() : undefined,
        landmark: input.deliveryAddress.landmark ? input.deliveryAddress.landmark.trim() : undefined,
        city: input.deliveryAddress.city.trim(),
        state: input.deliveryAddress.state.trim(),
        pincode: input.deliveryAddress.pincode.trim(),
        addressType: input.deliveryAddress.addressType || 'home',
        isDefault: false,
      },
      payment,
      orderStatus: isMockOnline ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING,
      notes: input.notes?.trim(),
    });

    return order;
  }

  /**
   * Retrieve order by unique orderNumber or MongoDB ObjectId
   */
  async getOrderByIdentifier(identifier: string): Promise<IOrderDocument> {
    if (!isDbConnected()) {
      throw new ApiError(503, 'Database is disconnected');
    }

    const query: Record<string, unknown>[] = [{ orderNumber: identifier }];
    if (Types.ObjectId.isValid(identifier)) {
      query.push({ _id: new Types.ObjectId(identifier) });
    }

    const order = await Order.findOne({ $or: query });
    if (!order) {
      throw ApiError.notFound(`Order not found with reference '${identifier}'`);
    }

    return order;
  }
}

export const orderService = new OrderService();
