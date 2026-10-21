export type Product = {
  id: string; name: string; nameEn: string; description: string; price: number; category: string;
  image: string; vegetarian: boolean; spice: 0 | 1 | 2 | 3; available: boolean; popular: number;
};
export type CartItem = { productId: string; quantity: number };
export type Customer = { name: string; phone: string };
export type Address = { recipient: string; line1: string; line2: string; landmark: string; city: string; postalCode: string; instructions: string };
export type OrderSummary = { items: CartItem[]; subtotal: number; deliveryFee: number; packagingFee: number; discount: number; grandTotal: number };

// Restaurant configuration
export const restaurantConfig = {
  brandName: 'Coastal Swada',
  whatsappPhone: '919538596072',
  phoneDisplay: '+91 95385 96072',
  menuIsDemo: false,
  locationIsDemo: false,
  deliveryFee: 0,
  packagingFee: 0,
};

export const products: Product[] = [
  { id: 'kori-rotti', name: 'ಕೋಳಿ ರೊಟ್ಟಿ', nameEn: 'Kori Rotti', description: 'Slow-cooked chicken curry, coconut, crisp rice wafers.', price: 285, category: 'Coastal classics', image: '/kori-rotti.jpg', vegetarian: false, spice: 2, available: true, popular: 96 },
  { id: 'fish-curry', name: 'ಮೀನಿನ ಸಾರು ಅನ್ನ', nameEn: 'Fish Curry Rice', description: 'Seer fish in a tangy coastal coconut gravy, red rice.', price: 320, category: 'Fish & seafood', image: '/fish-curry.jpg', vegetarian: false, spice: 2, available: true, popular: 92 },
  { id: 'neer-dosa', name: 'ನೀರ್ ದೋಸೆ', nameEn: 'Neer Dosa', description: 'Feather-light rice crepes with coconut chutney.', price: 145, category: 'From the griddle', image: '/neer-dosa.jpg', vegetarian: true, spice: 0, available: true, popular: 84 },
  { id: 'chicken-ghee-roast', name: 'ಚಿಕನ್ ಗೀ ರೋಸ್ಟ್', nameEn: 'Chicken Ghee Roast', description: 'A slow-roasted Mangalorean favourite with curry leaves.', price: 340, category: 'Chicken', image: '/chicken-ghee-roast.jpg', vegetarian: false, spice: 3, available: true, popular: 99 },
  { id: 'mushroom-sukka', name: 'ಅಣಬೆ ಸುಕ್ಕಾ', nameEn: 'Mushroom Sukka', description: 'Peppery mushrooms tossed with toasted coconut.', price: 230, category: 'Vegetarian', image: '/mushroom-sukka.jpg', vegetarian: true, spice: 1, available: true, popular: 72 },
  { id: 'rice-bowl', name: 'ಕರಾವಳಿ ಕೆಂಪು ಅನ್ನ', nameEn: 'Coastal Red Rice', description: 'Nutty, slow-steamed local-style red rice.', price: 95, category: 'Sides & extras', image: '/red-rice.jpg', vegetarian: true, spice: 0, available: true, popular: 69 },
  { id: 'prawn-ghee-roast', name: 'ಸೀಗಡಿ ಗೀ ರೋಸ್ಟ್', nameEn: 'Prawn Ghee Roast', description: 'Juicy prawns with a bright, peppery roast masala.', price: 385, category: 'Fish & seafood', image: '/prawn-ghee-roast.jpg', vegetarian: false, spice: 3, available: true, popular: 88 },
  { id: 'kokum-cooler', name: 'ಕೊಕ್ಕಂ ಕೂಲರ್', nameEn: 'Kokum Cooler', description: 'Tart kokum, a little sweetness, plenty of ice.', price: 90, category: 'Beverages', image: '/kokum-cooler.jpg', vegetarian: true, spice: 0, available: true, popular: 75 },
  { id: 'anjal-tawa-fry', name: 'ಅಂಜಲ್ ತವಾ ಫ್ರೈ', nameEn: 'Anjal Tawa Fry', description: 'A crisp, spice-crusted coastal fish fry with lemon.', price: 365, category: 'Fish & seafood', image: '/anjal-tawa-fry.jpg', vegetarian: false, spice: 2, available: true, popular: 90 },
  { id: 'chicken-sukka', name: 'ಚಿಕನ್ ಸುಕ್ಕಾ', nameEn: 'Chicken Sukka', description: 'Dry-roasted chicken with toasted coconut and curry leaves.', price: 315, category: 'Chicken', image: '/chicken-sukka.jpg', vegetarian: false, spice: 2, available: true, popular: 86 },
];

export const defaultProducts: Product[] = products;
export const DEFAULT_OWNER_PIN = '9538';

export const categories = ['All', ...Array.from(new Set(products.map((product) => product.category)))];
export const money = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;
export function calculateOrder(items: CartItem[], productList: Product[] = products): OrderSummary {
  const subtotal = items.reduce((sum, item) => {
    const product = productList.find((entry) => entry.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const deliveryFee = 0;
  const packagingFee = 0;
  const discount = 0;
  return { items, subtotal, deliveryFee, packagingFee, discount, grandTotal: subtotal };
}
export function createOrderReference(): string {
  const timePart = Date.now().toString(36).toUpperCase().slice(-5);
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CS-${timePart}${randomPart}`;
}
export function buildWhatsAppMessage(summary: OrderSummary, customer: Customer, address: Address, reference?: string, productList: Product[] = products): string {
  const lines = summary.items.map(({ productId, quantity }, index) => {
    const product = productList.find((entry) => entry.id === productId);
    const unitPrice = product?.price ?? 0;
    const nameKn = product?.name ?? 'ಖಾದ್ಯ';
    const nameEn = product?.nameEn ?? 'Dish';
    return `${index + 1}. ${nameKn} (${nameEn}) × ${quantity} = ${money(unitPrice * quantity)}`;
  });

  const hasAddress = Boolean(address?.line1 || address?.city);
  const addressText = hasAddress
    ? `${address.line1}${address.line2 ? `, ${address.line2}` : ''}${address.landmark ? ` (Near ${address.landmark})` : ''}, ${address.city}${address.postalCode ? ` - ${address.postalCode}` : ''}`
    : '';

  const customerName = customer?.name?.trim() || 'Guest';
  const customerPhone = customer?.phone?.trim() || '';

  return [
    '🍽️ *COASTAL SWADA – FOOD ORDER / ENQUIRY*',
    '📍 Saligrama, Udupi',
    ...(reference ? [`🆔 Order Ref: #${reference}`] : []),
    '',
    `👤 Name: ${customerName}`,
    ...(customerPhone ? [`📞 Mobile: ${customerPhone}`] : []),
    `📦 Type: ${hasAddress ? 'Delivery / ಡೆಲಿವರಿ' : 'Pickup / ಪಾರ್ಸೆಲ್'}`,
    ...(hasAddress ? [`📍 Address: ${addressText}`] : []),
    ...(address?.instructions ? [`📝 Note: ${address.instructions}`] : []),
    '',
    '*Order Items:*',
    ...lines,
    '',
    `🧾 *Total Food Amount: ${money(summary.grandTotal)}*`,
    '✨ *Zero Platform Fee · Zero Packaging Fee (Only Food Amount)*',
    '',
    'ಧನ್ಯವಾದಗಳು! 🙏',
  ].join('\n');
}
