import { apiRequest } from './client';
import {
  CreateOrderPayload,
  SingleOrderResponse,
  CartValidationResponse,
  CartValidationResult,
  Order,
} from '@/types/store';
import { FALLBACK_PRODUCTS } from '@/data/fallbackData';

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  try {
    const response = await apiRequest<SingleOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (response && response.data) {
      return response.data;
    }
  } catch (err) {
    console.warn('API unavailable for order creation, creating local guest order:', err);
  }

  // Standalone offline order creation fallback
  const orderNumber = `MM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
  const orderId = `ord_local_${Date.now()}`;

  const resolvedItems = payload.items.map((i) => {
    const prod = FALLBACK_PRODUCTS.find((p) => p._id === i.productId || p.sku === i.productId);
    const variant = i.variantSku && prod?.variants ? prod.variants.find((v) => v.sku === i.variantSku) : undefined;
    const unitPrice = variant ? variant.sellingPrice : (prod ? prod.sellingPrice : 100);
    const productName = prod ? prod.name : 'Supermarket Grocery Item';
    const sku = variant ? variant.sku : (prod ? prod.sku : 'SKU-001');
    const image = variant?.image || prod?.images?.[0]?.url || '';
    const totalPrice = unitPrice * i.quantity;

    return {
      productId: i.productId,
      variantSku: i.variantSku,
      productName,
      sku,
      quantity: i.quantity,
      unitPrice,
      totalPrice,
      image,
    };
  });

  const subtotal = resolvedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const mockOrder: Order = {
    _id: orderId,
    orderNumber,
    userId: null,
    customer: {
      name: payload.customer.name,
      phone: payload.customer.phone,
      email: payload.customer.email,
    },
    deliveryAddress: {
      fullName: payload.deliveryAddress.fullName,
      phone: payload.deliveryAddress.phone,
      addressLine1: payload.deliveryAddress.addressLine1,
      addressLine2: payload.deliveryAddress.addressLine2,
      landmark: payload.deliveryAddress.landmark,
      city: payload.deliveryAddress.city,
      state: payload.deliveryAddress.state,
      pincode: payload.deliveryAddress.pincode,
      addressType: payload.deliveryAddress.addressType || 'home',
    },
    items: resolvedItems,
    pricing: {
      subtotal,
      discount: 0,
      deliveryFee,
      tax: 0,
      total,
    },
    payment: {
      provider: 'megamart_pay',
      paymentMethod: payload.paymentMethod,
      amount: total,
      currency: 'INR',
      status: payload.paymentMethod === 'mock_online' ? 'paid' : 'pending',
    },
    orderStatus: 'confirmed',
    notes: payload.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`megamart_order_${orderId}`, JSON.stringify(mockOrder));
    localStorage.setItem(`megamart_order_${orderNumber}`, JSON.stringify(mockOrder));
  } catch (e) {
    // ignore
  }

  return mockOrder;
}

export async function validateCart(
  items: Array<{
    productId: string;
    variantSku?: string;
    quantity: number;
    clientPrice?: number;
  }>
): Promise<CartValidationResult> {
  try {
    const response = await apiRequest<CartValidationResponse>('/orders/validate-cart', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    if (response && response.data) {
      return response.data;
    }
  } catch (err) {
    console.warn('Cart validation API unavailable, accepting client cart as valid:', err);
  }

  const validatedItems = items.map((i) => {
    const prod = FALLBACK_PRODUCTS.find((p) => p._id === i.productId || p.sku === i.productId);
    const variant = i.variantSku && prod?.variants ? prod.variants.find((v) => v.sku === i.variantSku) : undefined;
    const unitPrice = variant ? variant.sellingPrice : (prod ? prod.sellingPrice : (i.clientPrice || 0));
    const mrp = variant ? variant.mrp : (prod ? prod.mrp : unitPrice);
    const productName = prod ? prod.name : 'Grocery Item';
    const sku = variant ? variant.sku : (prod ? prod.sku : 'SKU-001');
    const image = variant?.image || prod?.images?.[0]?.url || '';

    return {
      productId: i.productId,
      variantSku: i.variantSku,
      productName,
      sku,
      unitPrice,
      mrp,
      quantity: i.quantity,
      totalPrice: unitPrice * i.quantity,
      stock: variant ? variant.stock : (prod ? prod.stock : 99),
      image,
    };
  });

  const subtotal = validatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const mrpTotal = validatedItems.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
  const discount = Math.max(0, mrpTotal - subtotal);
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  return {
    isValid: true,
    hasPriceChanges: false,
    issues: [],
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

export async function getOrderByIdentifier(identifier: string): Promise<Order> {
  try {
    const response = await apiRequest<SingleOrderResponse>(`/orders/${encodeURIComponent(identifier)}`);
    if (response && response.data) {
      return response.data;
    }
  } catch (err) {
    console.warn('API unavailable for order fetch, searching local storage:', err);
  }

  try {
    const saved = localStorage.getItem(`megamart_order_${identifier}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }

  throw new Error(`Order ${identifier} not found`);
}
