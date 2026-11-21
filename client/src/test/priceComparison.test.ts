import assert from 'node:assert';

// 1. Logic Verification for Price Comparison
function calculatePriceComparison(megaMartTotal: number, otherShopInput: string) {
  const parsedOtherPrice = parseFloat(otherShopInput);
  const isValidOtherPrice = !isNaN(parsedOtherPrice) && parsedOtherPrice > 0;

  if (!isValidOtherPrice) {
    return {
      isValid: false,
      difference: 0,
      message: 'Enter what you\'d pay at another store to see your instant MegaMart savings.',
    };
  }

  const difference = Math.abs(megaMartTotal - parsedOtherPrice);
  const isMegaMartCheaper = megaMartTotal < parsedOtherPrice;
  const isOtherCheaper = megaMartTotal > parsedOtherPrice;
  const isSamePrice = megaMartTotal === parsedOtherPrice;

  let message = '';
  if (isMegaMartCheaper) {
    message = `You save ₹${difference.toLocaleString('en-IN')} at MegaMart`;
  } else if (isOtherCheaper) {
    message = `MegaMart is ₹${difference.toLocaleString('en-IN')} more`;
  } else if (isSamePrice) {
    message = 'Same price';
  }

  return {
    isValid: true,
    megaMartTotal,
    otherPrice: parsedOtherPrice,
    difference,
    isMegaMartCheaper,
    isOtherCheaper,
    isSamePrice,
    message,
  };
}

// 2. Test Cases for Price Comparison
console.log('🧪 Testing Price Comparison Calculation Logic:');

// Test Case 1: Prompt Example (MegaMart: 1250, Other: 1400)
const res1 = calculatePriceComparison(1250, '1400');
assert.strictEqual(res1.isValid, true);
assert.strictEqual(res1.difference, 150);
assert.strictEqual(res1.isMegaMartCheaper, true);
assert.strictEqual(res1.message, 'You save ₹150 at MegaMart');
console.log('  ✅ PASS: Example from prompt (You save ₹150 at MegaMart)');

// Test Case 2: Other shop is cheaper (MegaMart: 1400, Other: 1250)
const res2 = calculatePriceComparison(1400, '1250');
assert.strictEqual(res2.isValid, true);
assert.strictEqual(res2.difference, 150);
assert.strictEqual(res2.isOtherCheaper, true);
assert.strictEqual(res2.message, 'MegaMart is ₹150 more');
console.log('  ✅ PASS: Other shop cheaper (MegaMart is ₹150 more)');

// Test Case 3: Same price (MegaMart: 1250, Other: 1250)
const res3 = calculatePriceComparison(1250, '1250');
assert.strictEqual(res3.isValid, true);
assert.strictEqual(res3.difference, 0);
assert.strictEqual(res3.isSamePrice, true);
assert.strictEqual(res3.message, 'Same price');
console.log('  ✅ PASS: Equal prices (Same price)');

// Test Case 4: Invalid/Empty inputs
const res4 = calculatePriceComparison(1250, '');
assert.strictEqual(res4.isValid, false);
const res5 = calculatePriceComparison(1250, 'abc');
assert.strictEqual(res5.isValid, false);
const res6 = calculatePriceComparison(1250, '-100');
assert.strictEqual(res6.isValid, false);
console.log('  ✅ PASS: Invalid and empty inputs handled gracefully');

// 3. Test Cart State with Variants and LocalStorage Simulation
console.log('\n🧪 Testing Cart State & LocalStorage Persistence:');

interface MockCartItem {
  id: string;
  productId: string;
  variantSku?: string;
  price: number;
  quantity: number;
}

const mockStorage: Record<string, string> = {};
const CART_STORAGE_KEY = 'megamart_guest_cart_v1';

function saveCart(items: MockCartItem[]) {
  mockStorage[CART_STORAGE_KEY] = JSON.stringify(items);
}

function loadCart(): MockCartItem[] {
  const data = mockStorage[CART_STORAGE_KEY];
  return data ? JSON.parse(data) : [];
}

// Add items (one regular, two different variants of same product)
const initialCart: MockCartItem[] = [
  { id: 'item-1', productId: 'prod-dal', price: 175, quantity: 2 },
  { id: 'item-2', productId: 'prod-atta', variantSku: 'MM-ATT-1K', price: 58, quantity: 1 },
  { id: 'item-3', productId: 'prod-atta', variantSku: 'MM-ATT-5K', price: 275, quantity: 1 },
];

saveCart(initialCart);
const loaded = loadCart();

assert.strictEqual(loaded.length, 3);
const itemCount = loaded.reduce((sum, item) => sum + item.quantity, 0);
assert.strictEqual(itemCount, 4);
const subtotal = loaded.reduce((sum, item) => sum + item.price * item.quantity, 0);
assert.strictEqual(subtotal, 175 * 2 + 58 * 1 + 275 * 1); // 350 + 58 + 275 = 683
console.log('  ✅ PASS: Multiple items and distinct variants stored in cart');
console.log(`  ✅ PASS: Total units calculated correctly (${itemCount})`);
console.log(`  ✅ PASS: Subtotal calculated correctly (₹${subtotal})`);

// Increase quantity of item-2
loaded[1].quantity += 1;
saveCart(loaded);
const reloaded = loadCart();
assert.strictEqual(reloaded[1].quantity, 2);
console.log('  ✅ PASS: Quantity update saved to localStorage');

// Remove item-1
const updated = reloaded.filter(i => i.id !== 'item-1');
saveCart(updated);
const finalCart = loadCart();
assert.strictEqual(finalCart.length, 2);
console.log('  ✅ PASS: Item removal saved to localStorage');

console.log('\n🎉 ALL CART & PRICE COMPARISON CHECKS PASSED!\n');
