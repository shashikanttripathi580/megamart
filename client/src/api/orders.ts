import { apiRequest } from './client';
import {
  CreateOrderPayload,
  SingleOrderResponse,
  CartValidationResponse,
  CartValidationResult,
  Order,
} from '@/types/store';

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await apiRequest<SingleOrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function validateCart(
  items: Array<{
    productId: string;
    variantSku?: string;
    quantity: number;
    clientPrice?: number;
  }>
): Promise<CartValidationResult> {
  const response = await apiRequest<CartValidationResponse>('/orders/validate-cart', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
  return response.data;
}

export async function getOrderByIdentifier(identifier: string): Promise<Order> {
  const response = await apiRequest<SingleOrderResponse>(`/orders/${encodeURIComponent(identifier)}`);
  return response.data;
}
