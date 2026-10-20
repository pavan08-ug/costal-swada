export type Product = {
  id: string; name: string; description: string; price: number; category: string;
  image: string; vegetarian: boolean; spice: 0 | 1 | 2 | 3; available: boolean; popular: number;
};
export type CartItem = { productId: string; quantity: number };
export type Customer = { name: string; phone: string };
export type Address = { recipient: string; line1: string; line2: string; landmark: string; city: string; postalCode: string; instructions: string };
export type OrderSummary = { items: CartItem[]; subtotal: number; deliveryFee: number; packagingFee: number; discount: number; grandTotal: number };

// All menu/location details below are editable demo content, not verified restaurant facts.
export const restaurantConfig = {
  brandName: 'Coastal Swada',
  whatsappPhone: '',
  menuIsDemo: true,
  locationIsDemo: true,
  deliveryFee: 35,
  packagingFee: 8,
};

export const products: Product[] = [
  { id: 'kori-rotti', name: 'Kori Rotti', description: 'Slow-cooked chicken curry, coconut, crisp rice wafers.', price: 285, category: 'Coastal classics', image: '/kori-rotti.jpg', vegetarian: false, spice: 2, available: true, popular: 96 },
  { id: 'fish-curry', name: 'Fish Curry Rice', description: 'Seer fish in a tangy coastal coconut gravy, red rice.', price: 320, category: 'Fish & seafood', image: '/fish-curry.jpg', vegetarian: false, spice: 2, available: true, popular: 92 },
  { id: 'neer-dosa', name: 'Neer Dosa', description: 'Feather-light rice crepes with coconut chutney.', price: 145, category: 'From the griddle', image: '/neer-dosa.jpg', vegetarian: true, spice: 0, available: true, popular: 84 },
  { id: 'chicken-ghee-roast', name: 'Chicken Ghee Roast', description: 'A slow-roasted Mangalorean favourite with curry leaves.', price: 340, category: 'Chicken', image: '/chicken-ghee-roast.jpg', vegetarian: false, spice: 3, available: true, popular: 99 },
  { id: 'mushroom-sukka', name: 'Mushroom Sukka', description: 'Peppery mushrooms tossed with toasted coconut.', price: 230, category: 'Vegetarian', image: '/mushroom-sukka.jpg', vegetarian: true, spice: 1, available: true, popular: 72 },
  { id: 'rice-bowl', name: 'Coastal Red Rice', description: 'Nutty, slow-steamed local-style red rice.', price: 95, category: 'Sides & extras', image: '/red-rice.jpg', vegetarian: true, spice: 0, available: true, popular: 69 },
  { id: 'prawn-ghee-roast', name: 'Prawn Ghee Roast', description: 'Juicy prawns with a bright, peppery roast masala.', price: 385, category: 'Fish & seafood', image: '/prawn-ghee-roast.jpg', vegetarian: false, spice: 3, available: false, popular: 88 },
  { id: 'kokum-cooler', name: 'Kokum Cooler', description: 'Tart kokum, a little sweetness, plenty of ice.', price: 90, category: 'Beverages', image: '/kokum-cooler.jpg', vegetarian: true, spice: 0, available: true, popular: 75 },
  { id: 'anjal-tawa-fry', name: 'Anjal Tawa Fry', description: 'A crisp, spice-crusted coastal fish fry with lemon.', price: 365, category: 'Fish & seafood', image: '/anjal-tawa-fry.jpg', vegetarian: false, spice: 2, available: true, popular: 90 },
  { id: 'chicken-sukka', name: 'Chicken Sukka', description: 'Dry-roasted chicken with toasted coconut and curry leaves.', price: 315, category: 'Chicken', image: '/chicken-sukka.jpg', vegetarian: false, spice: 2, available: true, popular: 86 },
];

export const categories = ['All', ...Array.from(new Set(products.map((product) => product.category)))];
export const money = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;
export function calculateOrder(items: CartItem[]): OrderSummary {
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const deliveryFee = items.length ? restaurantConfig.deliveryFee : 0;
  const packagingFee = items.length ? restaurantConfig.packagingFee * items.reduce((n, item) => n + item.quantity, 0) : 0;
  const discount = 0;
  return { items, subtotal, deliveryFee, packagingFee, discount, grandTotal: subtotal + deliveryFee + packagingFee - discount };
}
export function createOrderReference(): string {
  const timePart = Date.now().toString(36).toUpperCase().slice(-5);
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CS-${timePart}${randomPart}`;
}
export function buildWhatsAppMessage(summary: OrderSummary, customer: Customer, address: Address, reference: string): string {
  const lines = summary.items.map(({ productId, quantity }, index) => {
    const product = products.find((entry) => entry.id === productId);
    const unitPrice = product?.price ?? 0;
    return `${index + 1}. ${product?.name ?? 'Item'}\n   Quantity: ${quantity}\n   Unit Price: ${money(unitPrice)}\n   Item Total: ${money(unitPrice * quantity)}`;
  });
  return [
    `NEW FOOD ORDER REQUEST - ${restaurantConfig.brandName}`,
    `Order Reference: ${reference}`,
    '',
    'CUSTOMER DETAILS',
    `Name: ${customer.name}`,
    `Mobile: ${customer.phone}`,
    '',
    'DELIVERY ADDRESS',
    `${address.recipient ? `${address.recipient}, ` : ''}${address.line1}${address.line2 ? `, ${address.line2}` : ''}`,
    ...(address.landmark ? [`Landmark: ${address.landmark}`] : []),
    `City: ${address.city}`,
    `PIN Code: ${address.postalCode}`,
    '',
    'ORDER ITEMS',
    ...lines,
    '',
    'BILL SUMMARY',
    `Item Total: ${money(summary.subtotal)}`,
    `Delivery Fee: ${money(summary.deliveryFee)}`,
    `Packaging Charges: ${money(summary.packagingFee)}`,
    `Discount: ${money(summary.discount)}`,
    '',
    `GRAND TOTAL: ${money(summary.grandTotal)}`,
    '',
    `SPECIAL INSTRUCTIONS: ${address.instructions || 'None'}`,
    'ORDER TYPE: Home Delivery',
    '',
    'Please confirm availability and delivery details for this order request.',
  ].join('\n');
}
