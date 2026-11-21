import { z } from 'zod';

const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const orderCustomerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number starting with 6-9'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
});

export const orderDeliveryAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .trim(),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number starting with 6-9'),
  addressLine1: z
    .string()
    .min(5, 'Address line must be at least 5 characters')
    .max(200, 'Address line cannot exceed 200 characters')
    .trim(),
  addressLine2: z
    .string()
    .max(200, 'Address line 2 cannot exceed 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  landmark: z
    .string()
    .max(150, 'Landmark cannot exceed 150 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City cannot exceed 100 characters')
    .trim(),
  state: z
    .string()
    .min(2, 'State is required')
    .max(100, 'State cannot exceed 100 characters')
    .trim(),
  pincode: z
    .string()
    .trim()
    .regex(pincodeRegex, 'Please enter a valid 6-digit Indian PIN code (cannot start with 0)'),
  addressType: z.enum(['home', 'work', 'other']).default('home'),
});

export const orderItemInputSchema = z.object({
  productId: z
    .string()
    .regex(objectIdRegex, 'Invalid product ID format'),
  variantSku: z
    .string()
    .trim()
    .optional(),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99 units'),
});

export const createOrderSchema = z.object({
  customer: orderCustomerSchema,
  deliveryAddress: orderDeliveryAddressSchema,
  items: z
    .array(orderItemInputSchema)
    .min(1, 'Order must contain at least one item'),
  paymentMethod: z.enum(['cod', 'mock_online'], {
    errorMap: () => ({ message: "Payment method must be 'cod' or 'mock_online'" }),
  }),
  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .trim()
    .optional(),
});

export const validateCartItemInputSchema = z.object({
  productId: z
    .string()
    .regex(objectIdRegex, 'Invalid product ID format'),
  variantSku: z
    .string()
    .trim()
    .optional(),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99 units'),
  clientPrice: z
    .number()
    .min(0)
    .optional(),
});

export const validateCartSchema = z.object({
  items: z
    .array(validateCartItemInputSchema)
    .min(1, 'Cart must contain at least one item'),
});

export const orderIdentifierParamSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Order identifier is required')
    .trim(),
});
