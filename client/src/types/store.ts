export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory: string | { _id: string; name: string; slug: string } | null;
  isActive: boolean;
  sortOrder: number;
  subcategories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
  isDefault?: boolean;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductVariant {
  sku: string;
  barcode?: string;
  name: string;
  attributes: Record<string, string>;
  mrp: number;
  sellingPrice: number;
  stock: number;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  brand: string;
  category: { _id: string; name: string; slug: string } | string;
  subcategory?: { _id: string; name: string; slug: string } | string;
  sku: string;
  barcode?: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  weight?: string;
  tags: string[];
  images: ProductImage[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: PaginationMeta;
}

export interface SingleProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CartItem {
  id: string; // Composite key: `${productId}-${variantSku || 'default'}`
  productId: string;
  product: Product;
  variant?: ProductVariant;
  /**
   * Stores the ProductVariant SKU, not a MongoDB ObjectId.
   */
  variantSku?: string;
  quantity: number;
  price: number; // Current displayed unit price
  mrp: number; // Current unit MRP
}

export interface OrderItem {
  productId: string;
  variantSku?: string;
  variantId?: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface OrderDeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'work' | 'other';
}

export interface OrderPayment {
  provider: string;
  paymentMethod: 'cod' | 'mock_online' | string;
  transactionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
  paidAt?: string;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string | null;
  customer: OrderCustomer;
  items: OrderItem[];
  pricing: OrderPricing;
  deliveryAddress: OrderDeliveryAddress;
  payment: OrderPayment;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
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
  items: {
    productId: string;
    variantSku?: string;
    quantity: number;
  }[];
  paymentMethod: 'cod' | 'mock_online';
  notes?: string;
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

export interface CartValidationResponse {
  success: boolean;
  message: string;
  data: CartValidationResult;
}

export interface SingleOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

