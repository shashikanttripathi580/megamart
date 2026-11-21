export const PAYMENT_PROVIDER = {
  MOCK: 'mock',
  RAZORPAY: 'razorpay',
  CASHFREE: 'cashfree',
} as const;

export type PaymentProvider = (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];
export const PAYMENT_PROVIDER_LIST: PaymentProvider[] = Object.values(PAYMENT_PROVIDER);

export const PAYMENT_METHOD = {
  COD: 'cod',
  MOCK_ONLINE: 'mock_online',
  UPI: 'upi',
  CARD: 'card',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
export const PAYMENT_METHOD_LIST: PaymentMethod[] = Object.values(PAYMENT_METHOD);

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export const PAYMENT_STATUS_LIST: PaymentStatus[] = Object.values(PAYMENT_STATUS);
