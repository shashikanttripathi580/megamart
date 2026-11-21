import http from 'http';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../app.js';
import { seedDatabase } from '../seed/index.js';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, failureDetails?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    results.push({ name: testName, passed: true });
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${failureDetails || 'Assertion failed'}`);
    results.push({ name: testName, passed: false, error: failureDetails || 'Assertion failed' });
  }
}

async function runTests() {
  console.log('🚀 ===============================================');
  console.log('🧪 Starting MegaMart Database & API Verification');
  console.log('🚀 ===============================================\n');

  let mongoServer: MongoMemoryServer | null = null;
  let server: http.Server | null = null;
  let baseUrl = '';

  try {
    // 1. Setup in-memory MongoDB
    console.log('⏳ Starting in-memory MongoDB instance for testing...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log(`✅ Test MongoDB running at: ${uri}`);

    // 2. Connect & Seed Database
    console.log('⏳ Connecting Mongoose & executing seed...');
    await mongoose.connect(uri);
    assert(mongoose.connection.readyState === 1, '1. MongoDB connection established');

    const seedStats = await seedDatabase(uri);
    assert(seedStats.categoriesCount >= 14, '2. Seed categories populated', `Count: ${seedStats.categoriesCount}`);
    assert(seedStats.productsCount >= 15, '3. Seed products populated', `Count: ${seedStats.productsCount}`);

    // 3. Start test HTTP server
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server!.address() as { port: number };
        baseUrl = `http://localhost:${address.port}`;
        console.log(`✅ Test API server running at: ${baseUrl}\n`);
        resolve();
      });
    });

    // --- TEST 1: Health Check ---
    console.log('📋 Running Health Check tests...');
    const healthRes = await fetch(`${baseUrl}/api/v1/health`);
    const healthData: any = await healthRes.json();
    assert(healthRes.status === 200, '4. GET /api/v1/health returns 200 OK');
    assert(healthData.success === true, '5. Health response format success: true');
    assert(healthData.data.database.status === 'connected', '6. Health check reports database connected');

    // --- TEST 2: GET Categories ---
    console.log('\n📋 Running Category API tests...');
    const catRes = await fetch(`${baseUrl}/api/v1/categories`);
    const catData: any = await catRes.json();
    assert(catRes.status === 200, '7. GET /api/v1/categories returns 200 OK');
    assert(Array.isArray(catData.data) && catData.data.length > 0, '8. Categories returned as non-empty array');

    // --- TEST 3: GET Categories Tree ---
    const treeRes = await fetch(`${baseUrl}/api/v1/categories?tree=true`);
    const treeData: any = await treeRes.json();
    assert(treeRes.status === 200, '9. GET /api/v1/categories?tree=true returns 200 OK');
    const groceriesCategory = treeData.data.find((c: any) => c.slug === 'groceries-staples');
    assert(
      groceriesCategory && Array.isArray(groceriesCategory.subcategories) && groceriesCategory.subcategories.length > 0,
      '10. Hierarchical category tree has nested subcategories'
    );

    // --- TEST 4: GET Category by Slug ---
    const singleCatRes = await fetch(`${baseUrl}/api/v1/categories/slug/groceries-staples`);
    const singleCatData: any = await singleCatRes.json();
    assert(singleCatRes.status === 200, '11. GET /api/v1/categories/slug/:slug returns 200 OK');
    assert(singleCatData.data.slug === 'groceries-staples', '12. Retrieved correct category by slug');

    // --- TEST 5: GET Products with Pagination ---
    console.log('\n📋 Running Product API tests...');
    const prodRes = await fetch(`${baseUrl}/api/v1/products?page=1&limit=5`);
    const prodData: any = await prodRes.json();
    assert(prodRes.status === 200, '13. GET /api/v1/products returns 200 OK');
    assert(Array.isArray(prodData.data) && prodData.data.length === 5, '14. Products pagination limit enforced (5 items)');
    assert(prodData.meta.totalDocs >= 15, '15. Pagination meta contains totalDocs count');
    assert(prodData.meta.totalPages >= 3, '16. Pagination meta calculates totalPages correctly');

    // --- TEST 6: Search Parameter ---
    const searchRes = await fetch(`${baseUrl}/api/v1/products?search=Atta`);
    const searchData: any = await searchRes.json();
    assert(searchRes.status === 200, '17. GET /api/v1/products?search=Atta returns 200 OK');
    const hasAtta = searchData.data.some((p: any) => p.name.toLowerCase().includes('atta'));
    assert(hasAtta, '18. Search parameter filters matching products');

    // --- TEST 7: Category Filter ---
    const catFilterRes = await fetch(`${baseUrl}/api/v1/products?category=groceries-staples`);
    const catFilterData: any = await catFilterRes.json();
    assert(catFilterRes.status === 200, '19. GET /api/v1/products?category=groceries-staples returns 200 OK');
    assert(catFilterData.data.length > 0, '20. Category slug filter returns matching products');

    // --- TEST 8: GET Product by Slug ---
    const slugRes = await fetch(`${baseUrl}/api/v1/products/slug/aashirvaad-shudh-chakki-atta`);
    const slugData: any = await slugRes.json();
    assert(slugRes.status === 200, '21. GET /api/v1/products/slug/:slug returns 200 OK');
    assert(slugData.data.slug === 'aashirvaad-shudh-chakki-atta', '22. Correct product retrieved by slug');
    assert(Array.isArray(slugData.data.variants) && slugData.data.variants.length === 3, '23. Product variants array populated');
    assert(Array.isArray(slugData.data.images) && slugData.data.images.length > 0, '24. Product images array populated');

    // --- TEST 9: GET Product by ID ---
    const productId = slugData.data._id;
    const idRes = await fetch(`${baseUrl}/api/v1/products/${productId}`);
    const idData: any = await idRes.json();
    assert(idRes.status === 200, '25. GET /api/v1/products/:id returns 200 OK');
    assert(idData.data._id === productId, '26. Correct product retrieved by ObjectId');

    // --- TEST 10: Invalid Product ID Handling ---
    console.log('\n📋 Running Error Handling tests...');
    const invalidIdRes = await fetch(`${baseUrl}/api/v1/products/invalid-id-format`);
    const invalidIdData: any = await invalidIdRes.json();
    assert(invalidIdRes.status === 400, '27. GET with malformed ObjectId returns 400 Bad Request');
    assert(invalidIdData.success === false, '28. Error response format success: false');

    // --- TEST 11: Non-existent Product Handling ---
    const notFoundRes = await fetch(`${baseUrl}/api/v1/products/000000000000000000000000`);
    const notFoundData: any = await notFoundRes.json();
    assert(notFoundRes.status === 404, '29. GET non-existent ObjectId returns 404 Not Found');
    assert(notFoundData.success === false, '30. 404 response format success: false');

    // --- TEST 12: Route Groups Prepared ---
    console.log('\n📋 Running Route Groups preparation tests...');
    const userRes = await fetch(`${baseUrl}/api/v1/users`);
    assert(userRes.status === 200, '31. GET /api/v1/users route group mounted');

    const orderRes = await fetch(`${baseUrl}/api/v1/orders`);
    assert(orderRes.status === 200, '32. GET /api/v1/orders route group mounted');

    const cartRes = await fetch(`${baseUrl}/api/v1/cart`);
    assert(cartRes.status === 200, '33. GET /api/v1/cart route group mounted');

    // --- TEST 13: Server-side Price Filtering (minPrice) ---
    console.log('\n📋 Running Price Filtering & Clarification tests...');
    const minPriceRes = await fetch(`${baseUrl}/api/v1/products?minPrice=100`);
    const minPriceData: any = await minPriceRes.json();
    assert(minPriceRes.status === 200, '34. GET /api/v1/products?minPrice=100 returns 200 OK');
    const allGte100 = minPriceData.data.every((p: any) => p.sellingPrice >= 100);
    assert(allGte100 && minPriceData.data.length > 0, '35. All products satisfy sellingPrice >= 100');

    // --- TEST 14: Server-side Price Filtering (maxPrice) ---
    const maxPriceRes = await fetch(`${baseUrl}/api/v1/products?maxPrice=100`);
    const maxPriceData: any = await maxPriceRes.json();
    assert(maxPriceRes.status === 200, '36. GET /api/v1/products?maxPrice=100 returns 200 OK');
    const allLte100 = maxPriceData.data.every((p: any) => p.sellingPrice <= 100);
    assert(allLte100 && maxPriceData.data.length > 0, '37. All products satisfy sellingPrice <= 100');

    // --- TEST 15: Server-side Price Filtering (minPrice & maxPrice) ---
    const rangePriceRes = await fetch(`${baseUrl}/api/v1/products?minPrice=100&maxPrice=300`);
    const rangePriceData: any = await rangePriceRes.json();
    assert(rangePriceRes.status === 200, '38. GET /api/v1/products?minPrice=100&maxPrice=300 returns 200 OK');
    const allInRange = rangePriceData.data.every((p: any) => p.sellingPrice >= 100 && p.sellingPrice <= 300);
    assert(allInRange && rangePriceData.data.length > 0, '39. All products satisfy 100 <= sellingPrice <= 300');

    // --- TEST 16: Invalid Price Validations ---
    const negativePriceRes = await fetch(`${baseUrl}/api/v1/products?minPrice=-100`);
    assert(negativePriceRes.status === 400, '40. GET with minPrice=-100 rejected with 400 Bad Request');

    const nonNumericPriceRes = await fetch(`${baseUrl}/api/v1/products?maxPrice=abc`);
    assert(nonNumericPriceRes.status === 400, '41. GET with maxPrice=abc rejected with 400 Bad Request');

    const invertedPriceRes = await fetch(`${baseUrl}/api/v1/products?minPrice=500&maxPrice=100`);
    assert(invertedPriceRes.status === 400, '42. GET with minPrice=500&maxPrice=100 rejected with 400 Bad Request');

    // --- TEST 17: Product Stock vs Variant Stock Derivation ---
    const { Product } = await import('../models/product.model.js');
    const variantProd = await Product.findOne({ slug: 'aashirvaad-shudh-chakki-atta' }).lean();
    assert(Boolean(variantProd && variantProd.variants?.length === 3), '43. Variant product exists with 3 variants');
    const expectedVariantSum = variantProd!.variants.reduce((acc: number, v: any) => acc + v.stock, 0);
    assert(variantProd!.stock === expectedVariantSum, '44. Product with variants has stock equal to sum of variants (210)');

    const nonVariantProd = await Product.findOne({ slug: 'tata-sampann-unpolished-toor-dal' }).lean();
    assert(Boolean(nonVariantProd && nonVariantProd.variants?.length === 0), '45. Non-variant product exists with empty variants');
    assert(nonVariantProd!.stock === 80, '46. Non-variant product retains authoritative product.stock (80)');

    // --- TEST 18: Order Customer Phone Index ---
    const { Order } = await import('../models/order.model.js');
    const orderIndexes = Order.schema.indexes();
    const hasPhoneIndex = orderIndexes.some(
      ([idx]: any) => idx['customer.phone'] === 1 && idx.createdAt === -1
    );
    assert(hasPhoneIndex, '47. Order schema defines compound index on { "customer.phone": 1, createdAt: -1 }');

    // --- TEST 19: Cart Validation API ---
    console.log('\n📋 Running Cart Validation & Guest Checkout tests...');
    const validateRes = await fetch(`${baseUrl}/api/v1/orders/validate-cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { productId: nonVariantProd!._id.toString(), quantity: 2, clientPrice: 175 },
          { productId: variantProd!._id.toString(), variantSku: 'MM-ATT-001-1K', quantity: 1, clientPrice: 58 },
        ],
      }),
    });
    const validateData: any = await validateRes.json();
    assert(validateRes.status === 200, '48. POST /api/v1/orders/validate-cart returns 200 OK');
    assert(validateData.data.isValid === true, '49. Valid cart returns isValid: true');
    assert(validateData.data.pricing.subtotal === 175 * 2 + 58, '50. Server accurately calculates subtotal (408)');
    assert(validateData.data.pricing.deliveryFee === 40, '51. Standard delivery fee applied when subtotal < 499');

    // --- TEST 20: Cart Validation Detects Stale Client Price ---
    const stalePriceRes = await fetch(`${baseUrl}/api/v1/orders/validate-cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { productId: nonVariantProd!._id.toString(), quantity: 1, clientPrice: 99 }, // actual is 175
        ],
      }),
    });
    const stalePriceData: any = await stalePriceRes.json();
    assert(stalePriceData.data.hasPriceChanges === true, '52. Cart validation detects stale client prices');

    // --- TEST 21: Create Guest Order with Mock Online Payment ---
    const orderPayload = {
      customer: {
        name: 'Aarav Patel',
        phone: '9876543210',
        email: 'aarav@example.com',
      },
      deliveryAddress: {
        fullName: 'Aarav Patel',
        phone: '9876543210',
        addressLine1: 'B-204, Palm Grove, Link Road',
        addressLine2: 'Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400053',
        addressType: 'home',
      },
      items: [
        { productId: nonVariantProd!._id.toString(), quantity: 3 }, // 175 * 3 = 525 (>= 499, FREE DELIVERY)
      ],
      paymentMethod: 'mock_online',
    };

    const createOrderRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const orderData: any = await createOrderRes.json();
    assert(createOrderRes.status === 201, '53. POST /api/v1/orders returns 201 Created');
    assert(orderData.data.userId === null, '54. Guest order created with userId === null');
    assert(orderData.data.pricing.subtotal === 525, '55. Subtotal calculated on server (525)');
    assert(orderData.data.pricing.deliveryFee === 0, '56. Free delivery awarded when subtotal >= 499');
    assert(orderData.data.pricing.total === 525, '57. Total payable calculated on server (525)');
    assert(orderData.data.payment.provider === 'mock', '58. Payment provider is mock');
    assert(orderData.data.payment.status === 'paid', '59. Mock online payment status is paid');
    assert(orderData.data.payment.transactionId.startsWith('TXN-MOCK-'), '60. Mock online transactionId generated');
    assert(Array.isArray(orderData.data.items) && orderData.data.items[0].productName === 'Tata Sampann Unpolished Toor Dal (Arhar Dal)', '61. Product historical name snapshot stored');

    // --- TEST 22: Create Guest Order with COD ---
    const codPayload = {
      ...orderPayload,
      items: [
        { productId: nonVariantProd!._id.toString(), quantity: 1 }, // 175 (< 499, +40 fee = 215)
      ],
      paymentMethod: 'cod',
    };
    const codRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(codPayload),
    });
    const codData: any = await codRes.json();
    assert(codRes.status === 201, '62. COD order returns 201 Created');
    assert(codData.data.payment.status === 'pending', '63. COD payment status is pending');
    assert(codData.data.pricing.deliveryFee === 40, '64. COD order includes delivery fee (40)');
    assert(codData.data.pricing.total === 215, '65. COD order total is 215');

    // --- TEST 23: Retrieve Order by OrderNumber ---
    const createdOrderNumber = orderData.data.orderNumber;
    const fetchOrderRes = await fetch(`${baseUrl}/api/v1/orders/${createdOrderNumber}`);
    const fetchOrderData: any = await fetchOrderRes.json();
    assert(fetchOrderRes.status === 200, '66. GET /api/v1/orders/:orderNumber returns 200 OK');
    assert(fetchOrderData.data.orderNumber === createdOrderNumber, '67. Retrieved matching order by orderNumber');

    // --- TEST 24: Reject Excessive Quantity Beyond Stock ---
    const excessiveOrderRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderPayload,
        items: [{ productId: nonVariantProd!._id.toString(), quantity: 999 }],
      }),
    });
    assert(excessiveOrderRes.status === 400, '68. Order with quantity exceeding stock rejected with 400 Bad Request');

    // --- TEST 25: Reject Invalid Indian Phone Number ---
    const invalidPhoneRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderPayload,
        customer: { name: 'Test', phone: '12345' },
      }),
    });
    assert(invalidPhoneRes.status === 400, '69. Order with invalid phone number rejected with 400 Bad Request');

    // --- TEST 26: Reject Invalid Pincode (000000) ---
    const invalidPincodeRes = await fetch(`${baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderPayload,
        deliveryAddress: { ...orderPayload.deliveryAddress, pincode: '000000' },
      }),
    });
    assert(invalidPincodeRes.status === 400, '70. Order with invalid pincode (000000) rejected with 400 Bad Request');

  } catch (error) {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  } finally {
    if (server) {
      (server as http.Server).close();
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await (mongoServer as MongoMemoryServer).stop();
    }
  }

  // Summary
  console.log('\n📊 ===============================================');
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`🏁 Total Tests: ${results.length} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  console.log('📊 ===============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
