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
  // Coastal Meals
  { id: 'fishmeal', name: 'ಬಾಳೆ ಎಲೆ ಮೀನು ಊಟ', nameEn: 'Banana Leaf Fish Meals', description: 'ಕರಾವಳಿ ಶೈಲಿಯ ಮೀನು ಊಟ - Traditional coastal fish meals served with coconut gravy & fresh fish.', price: 180, category: 'Coastal Meals', image: '/fish-curry.jpg', vegetarian: false, spice: 2, available: true, popular: 98 },
  { id: 'coastalmeal', name: 'ಕರಾವಳಿ ಸಾಂಪ್ರದಾಯಿಕ ಊಟ', nameEn: 'Traditional Coastal Meals', description: 'ಬಾಳೆ ಎಲೆಯ ಊಟದ ಅನುಭವ - Authentic veg coastal meal with sambar, rasam, palya & red rice.', price: 100, category: 'Coastal Meals', image: '/red-rice.jpg', vegetarian: true, spice: 1, available: true, popular: 90 },
  { id: 'chickenmeal', name: 'ಚಿಕನ್ ಮೀಲ್ಸ್', nameEn: 'Chicken Meals', description: 'ಅನ್ನ ಮತ್ತು ರುಚಿಕರ ಕೋಳಿ ಸಾರು - Coastal style chicken curry with hot rice.', price: 160, category: 'Coastal Meals', image: '/chicken-sukka.jpg', vegetarian: false, spice: 2, available: true, popular: 91 },
  { id: 'fishcurrymeal', name: 'ಮೀನು ಸಾರು ಊಟ', nameEn: 'Fish Curry Rice', description: 'ಕರಾವಳಿಯ ವಿಶೇಷ ಮೀನು ಸಾರು ಮತ್ತು ಕೆಂಪು ಅನ್ನ.', price: 160, category: 'Coastal Meals', image: '/fish-curry.jpg', vegetarian: false, spice: 2, available: true, popular: 93 },

  // Neer Dosa
  { id: 'neerdosa', name: 'ನೀರು ದೋಸೆ', nameEn: 'Neer Dosa', description: 'ಮೃದುವಾದ ಕರಾವಳಿ ನೀರು ದೋಸೆ - Feather-light, delicate rice crepes with fresh coconut chutney.', price: 50, category: 'Neer Dosa', image: '/neer-dosa.jpg', vegetarian: true, spice: 0, available: true, popular: 95 },
  { id: 'neerdosafish', name: 'ನೀರು ದೋಸೆ + ಮೀನು ಸಾರು', nameEn: 'Neer Dosa with Fish Curry', description: 'ಮೃದುವಾದ ನೀರು ದೋಸೆ ತಾಜಾ ಮೀನು ಸಾರಿನೊಂದಿಗೆ.', price: 180, category: 'Neer Dosa', image: '/neer-dosa.jpg', vegetarian: false, spice: 2, available: true, popular: 94 },
  { id: 'neerdosachicken', name: 'ನೀರು ದೋಸೆ + ಚಿಕನ್ ಸಾರು', nameEn: 'Neer Dosa with Chicken Curry', description: 'ನೀರು ದೋಸೆ ಘಮಘಮಿಸುವ ಚಿಕನ್ ಕರಿಯೊಂದಿಗೆ.', price: 160, category: 'Neer Dosa', image: '/neer-dosa.jpg', vegetarian: false, spice: 2, available: true, popular: 92 },

  // Fish Fry
  { id: 'bangudefry', name: 'ಬಂಗುಡೆ ಮೀನು ಫ್ರೈ', nameEn: 'Bangude Fish Fry', description: 'ಕರಾವಳಿ ಮಸಾಲೆಯಲ್ಲಿ ಫ್ರೈ - Mackerel crusted with spicy Mangalorean red chili masala.', price: 130, category: 'Fish Fry', image: '/anjal-tawa-fry.jpg', vegetarian: false, spice: 2, available: true, popular: 96 },
  { id: 'anjalfry', name: 'ಅಂಜಲ್ ಮೀನು ಫ್ರೈ', nameEn: 'Anjal Fish Fry', description: 'ಮೀನು ಲಭ್ಯತೆಗೆ ಅನುಗುಣವಾಗಿ - Kingfish / Seer fish steak pan-fried in coastal spices.', price: 290, category: 'Fish Fry', image: '/anjal-tawa-fry.jpg', vegetarian: false, spice: 2, available: true, popular: 99 },
  { id: 'pomfretfry', name: 'ಪಾಂಫ್ರೆಟ್ ಮೀನು ಫ್ರೈ', nameEn: 'Pomfret Fish Fry', description: 'ತಾಜಾ ಬಿಳಿ ಪಾಂಫ್ರೆಟ್ ತವಾ ಫ್ರೈ.', price: 300, category: 'Fish Fry', image: '/anjal-tawa-fry.jpg', vegetarian: false, spice: 2, available: true, popular: 91 },
  { id: 'fishrawa', name: 'ರವಾ ಫಿಶ್ ಫ್ರೈ', nameEn: 'Rava Fish Fry', description: 'ಗರಿಗರಿ ರವಾ ಕೋಟಿಂಗ್ ಫ್ರೈ - Crispy semolina-coated coastal fish fry.', price: 180, category: 'Fish Fry', image: '/anjal-tawa-fry.jpg', vegetarian: false, spice: 2, available: true, popular: 89 },
  { id: 'fishtawa', name: 'ತವಾ ಫಿಶ್ ಫ್ರೈ', nameEn: 'Tawa Fish Fry', description: 'ಮಸಾಲೆಯೊಂದಿಗೆ ತವಾ ಫ್ರೈ.', price: 180, category: 'Fish Fry', image: '/anjal-tawa-fry.jpg', vegetarian: false, spice: 2, available: true, popular: 88 },

  // Seafood
  { id: 'prawnfry', name: 'ಪ್ರಾನ್ ಫ್ರೈ', nameEn: 'Prawn Fry', description: 'ಸೀಫುಡ್ ಪ್ರಿಯರಿಗೆ - Tender coastal prawns pan-tossed in fiery red masala.', price: 220, category: 'Seafood', image: '/prawn-ghee-roast.jpg', vegetarian: false, spice: 2, available: true, popular: 92 },
  { id: 'prawnghee', name: 'ಪ್ರಾನ್ ಗೀ ರೋಸ್ಟ್', nameEn: 'Prawn Ghee Roast', description: 'ಕರಾವಳಿ ಸ್ಪೆಷಲ್ - Succulent prawns slow-roasted in pure country ghee & Byadgi chili.', price: 260, category: 'Seafood', image: '/prawn-ghee-roast.jpg', vegetarian: false, spice: 3, available: true, popular: 97 },
  { id: 'fishcurry', name: 'ಮೀನು ಕರಿ', nameEn: 'Coastal Fish Curry', description: 'ಮಸಾಲೆಯ ಕರಾವಳಿ ಸಾರು - Classic Karavali coconut & tamarind fish curry.', price: 180, category: 'Seafood', image: '/fish-curry.jpg', vegetarian: false, spice: 2, available: true, popular: 90 },
  { id: 'crabsukka', name: 'ಕ್ರ್ಯಾಬ್ ಸುಕ್ಕ', nameEn: 'Crab Sukka', description: 'ಲಭ್ಯತೆಗೆ ಅನುಗುಣವಾಗಿ - Fresh crab cooked dry with toasted grated coconut & spices.', price: 270, category: 'Seafood', image: '/prawn-ghee-roast.jpg', vegetarian: false, spice: 3, available: true, popular: 89 },

  // Biryani
  { id: 'biryani', name: 'ಚಿಕನ್ ಬಿರಿಯಾನಿ', nameEn: 'Chicken Biryani', description: 'ಬಿಸಿ ಬಿಸಿ ಸುಗಂಧ ಬಿರಿಯಾನಿ - Aromatic short-grain coastal dum biryani with tender chicken.', price: 160, category: 'Biryani', image: '/hero-karavali.jpg', vegetarian: false, spice: 2, available: true, popular: 96 },
  { id: 'swadbiryani', name: 'ಸ್ವಾದ್ ಸ್ಪೆಷಲ್ ಬಿರಿಯಾನಿ', nameEn: 'Swaad Special Biryani', description: 'ನಿಮ್ಮ ನೆಚ್ಚಿನ ಸ್ವಾದ್ ರುಚಿ - Chef special slow-cooked spiced biryani.', price: 200, category: 'Biryani', image: '/hero-karavali.jpg', vegetarian: false, spice: 2, available: true, popular: 98 },
  { id: 'eggbiryani', name: 'ಎಗ್ ಬಿರಿಯಾನಿ', nameEn: 'Egg Biryani', description: 'ಸ್ಪೆಷಲ್ ಮಸಾಲೆ ಬಿರಿಯಾನಿ - Fragrant rice layered with spiced golden eggs.', price: 140, category: 'Biryani', image: '/hero-karavali.jpg', vegetarian: false, spice: 1, available: true, popular: 83 },
  { id: 'vegbiryani', name: 'ವೆಜ್ ಬಿರಿಯಾನಿ', nameEn: 'Veg Biryani', description: 'ಸುವಾಸನೆಯ ವೆಜ್ ಬಿರಿಯಾನಿ - Garden fresh vegetables layered with basmati.', price: 120, category: 'Biryani', image: '/hero-karavali.jpg', vegetarian: true, spice: 1, available: true, popular: 81 },

  // Grill & BBQ
  { id: 'grillhalf', name: 'ಗ್ರಿಲ್ ಚಿಕನ್ ಹಾಫ್', nameEn: 'Grill Chicken Half', description: 'ಚಾರ್ ಗ್ರಿಲ್ ಸ್ಪೆಷಲ್ - Half bird smoky char-grilled to juicy perfection.', price: 250, category: 'Grill & BBQ', image: '/chicken-ghee-roast.jpg', vegetarian: false, spice: 2, available: true, popular: 94 },
  { id: 'grillfull', name: 'ಗ್ರಿಲ್ ಚಿಕನ್ ಫುಲ್', nameEn: 'Grill Chicken Full', description: 'ಫ್ಯಾಮಿಲಿ ಶೇರಿಂಗ್ - Full whole grilled chicken with garlic sauce and kuboos.', price: 480, category: 'Grill & BBQ', image: '/chicken-ghee-roast.jpg', vegetarian: false, spice: 2, available: true, popular: 93 },
  { id: 'bbq', name: 'ಬಾರ್ಬೆಕ್ಯೂ ಚಿಕನ್', nameEn: 'BBQ Chicken', description: 'BBQ ರುಚಿ - Sweet, smoky and spicy glazed chicken.', price: 260, category: 'Grill & BBQ', image: '/chicken-ghee-roast.jpg', vegetarian: false, spice: 2, available: true, popular: 87 },
  { id: 'alfaham', name: 'ಅಲ್ ಫಹಮ್ ಚಿಕನ್', nameEn: 'Al Faham Chicken', description: 'ಅರೇಬಿಕ್ ಶೈಲಿ - Arabian-style charcoal barbecue chicken marinated in whole spices.', price: 260, category: 'Grill & BBQ', image: '/chicken-ghee-roast.jpg', vegetarian: false, spice: 2, available: true, popular: 91 },

  // Tandoori
  { id: 'tandoori', name: 'ತಂದೂರಿ ಚಿಕನ್', nameEn: 'Tandoori Chicken', description: 'ತಂದೂರಿ ಮಸಾಲೆಯಲ್ಲಿ - Clay oven roasted chicken with charred edges and mint chutney.', price: 220, category: 'Tandoori', image: '/chicken-ghee-roast.jpg', vegetarian: false, spice: 2, available: true, popular: 90 },
  { id: 'tikka', name: 'ಚಿಕನ್ ಟಿಕ್ಕಾ', nameEn: 'Chicken Tikka', description: 'ಸ್ಪೈಸಿ ತಂದೂರಿ ಟಿಕ್ಕಾ - Boneless skewered chicken cubes marinated in yogurt & spices.', price: 220, category: 'Tandoori', image: '/chicken-ghee-roast.jpg', vegetarian: false, spice: 2, available: true, popular: 89 },

  // Shawarma
  { id: 'shawarma', name: 'ಚಿಕನ್ ಶವರ್ಮಾ ರೋಲ್', nameEn: 'Chicken Shawarma Roll', description: 'ರೋಲ್ ಸ್ಪೆಷಲ್ - Sliced rotisserie chicken wrapped in soft rumali bread with toum.', price: 80, category: 'Shawarma', image: '/chicken-sukka.jpg', vegetarian: false, spice: 1, available: true, popular: 95 },
  { id: 'shawarmaplate', name: 'ಶವರ್ಮಾ ಪ್ಲೇಟ್', nameEn: 'Shawarma Plate', description: 'ಪ್ಲೇಟ್ ಶವರ್ಮಾ - Shredded meat served on a plate with kuboos, salad, and garlic dips.', price: 150, category: 'Shawarma', image: '/chicken-sukka.jpg', vegetarian: false, spice: 1, available: true, popular: 91 },
  { id: 'shawarmaspl', name: 'ಸ್ಪೆಷಲ್ ಶವರ್ಮಾ', nameEn: 'Special Shawarma', description: 'ಹೆಚ್ಚುವರಿ ರುಚಿ - Loaded with double meat, cheese and special sauce.', price: 120, category: 'Shawarma', image: '/chicken-sukka.jpg', vegetarian: false, spice: 1, available: true, popular: 93 },

  // Existing Karavali classics preserved
  { id: 'kori-rotti', name: 'ಕೋಳಿ ರೊಟ್ಟಿ', nameEn: 'Koli Rotti', description: 'Slow-cooked chicken curry, coconut, crisp rice wafers.', price: 285, category: 'Coastal Meals', image: '/kori-rotti.jpg', vegetarian: false, spice: 2, available: true, popular: 97 },
  { id: 'chicken-ghee-roast', name: 'ಚಿಕನ್ ಗೀ ರೋಸ್ಟ್', nameEn: 'Chicken Ghee Roast', description: 'A slow-roasted Mangalorean favourite with curry leaves and pure ghee.', price: 340, category: 'Coastal Meals', image: '/chicken-ghee-roast.jpg', vegetarian: false, spice: 3, available: true, popular: 99 },
  { id: 'kokum-cooler', name: 'ಕೊಕ್ಕಂ ಕೂಲರ್', nameEn: 'Kokum Cooler', description: 'Tart kokum, a little sweetness, plenty of ice.', price: 90, category: 'Beverages', image: '/kokum-cooler.jpg', vegetarian: true, spice: 0, available: true, popular: 85 },
];

export const defaultProducts: Product[] = products;
export const DEFAULT_OWNER_PIN = '9538';

export const categories = ['All', 'Coastal Meals', 'Fish Fry', 'Seafood', 'Neer Dosa', 'Biryani', 'Grill & BBQ', 'Tandoori', 'Shawarma', 'Beverages'];
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

export const DEFAULT_WHATSAPP_INQUIRY_MESSAGE = `ನಮಸ್ಕಾರ COASTAL SWADA 🙏
ಸಾಲಿಗ್ರಾಮದ ನಿಮ್ಮ ರೆಸ್ಟೋರೆಂಟ್ನ ಮೆನು, ಲಭ್ಯತೆ ಮತ್ತು ಆರ್ಡರ್ ಕುರಿತು ಮಾಹಿತಿ ಬೇಕು.`;

export const DEFAULT_WHATSAPP_LINK = `https://wa.me/919538596072?text=${encodeURIComponent(DEFAULT_WHATSAPP_INQUIRY_MESSAGE)}`;

