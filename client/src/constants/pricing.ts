export const PRICING_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 499,
  STANDARD_DELIVERY_FEE: 40,
  DEFAULT_TAX_RATE: 0,
} as const;

export type PricingConfig = typeof PRICING_CONFIG;
