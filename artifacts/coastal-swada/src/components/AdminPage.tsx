import { useState, useMemo, type FormEvent } from 'react';
import { Link } from 'wouter';
import { 
  ArrowLeft, Check, ChefHat, Eye, EyeOff, Lock, LogOut, 
  Package, PackageCheck, PackageX, Plus, RefreshCw, Search, 
  Trash2, Edit3, X, ExternalLink, ShieldCheck, AlertCircle, Sparkles, CheckCircle2
} from 'lucide-react';
import { Product, money, DEFAULT_OWNER_PIN } from '../lib/restaurant-data';
import { 
  KARNATAKA_FOOD_CATALOGUE, 
  transliterateToKannada, 
  detectDishAttributes, 
  type QuickDish 
} from '../lib/karnataka-dishes';

const SEARCH_CATEGORIES = [
  'All',
  'Coastal Karavali',
  'Old Mysore',
  'North Karnataka',
  'Malnad & Coorg',
  'Fish & Seafood',
  'Chicken',
];

const PRESET_IMAGES = [
  { label: 'Chicken Ghee Roast', url: '/chicken-ghee-roast.jpg' },
  { label: 'Prawn Ghee Roast', url: '/prawn-ghee-roast.jpg' },
  { label: 'Anjal Tawa Fry', url: '/anjal-tawa-fry.jpg' },
  { label: 'Fish Curry Rice', url: '/fish-curry.jpg' },
  { label: 'Kori Rotti', url: '/kori-rotti.jpg' },
  { label: 'Neer Dosa', url: '/neer-dosa.jpg' },
  { label: 'Chicken Sukka', url: '/chicken-sukka.jpg' },
  { label: 'Mushroom Sukka', url: '/mushroom-sukka.jpg' },
  { label: 'Coastal Red Rice', url: '/red-rice.jpg' },
  { label: 'Kokum Cooler', url: '/kokum-cooler.jpg' },
  { label: 'Mangalorean Feast Table', url: '/cinematic-cuisine.jpg' },
];

const STANDARD_CATEGORIES = [
  'Coastal classics',
  'Fish & seafood',
  'Chicken',
  'From the griddle',
  'Vegetarian',
  'Sides & extras',
  'Beverages'
];

interface AdminPageProps {
  products: Product[];
  setProducts: (items: Product[] | ((prev: Product[]) => Product[])) => void;
  onResetMenu: () => void;
}

export function AdminPage({ products, setProducts, onResetMenu }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('coastal_swada_admin_authed') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [toast, setToast] = useState('');

  // Filtering & search for the current active menu
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');

  // ── SEARCH & ADD DISH MODAL (The clean search experience) ──
  const [isDishSearchOpen, setIsDishSearchOpen] = useState(false);
  const [dishSearchQuery, setDishSearchQuery] = useState('');
  const [dishSearchCat, setDishSearchCat] = useState('All');
  const [dishPrices, setDishPrices] = useState<Record<string, number>>({});
  const [addedDishNames, setAddedDishNames] = useState<Record<string, boolean>>({});

  // Form modal states for Editing or Manual Custom Entry
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState(STANDARD_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [formVeg, setFormVeg] = useState(false);
  const [formSpice, setFormSpice] = useState<0 | 1 | 2 | 3>(2);
  const [formImage, setFormImage] = useState(PRESET_IMAGES[0].url);
  const [formDesc, setFormDesc] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formPopular, setFormPopular] = useState(85);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('coastal_owner_pin') || DEFAULT_OWNER_PIN;
    if (pinInput.trim() === storedPin) {
      sessionStorage.setItem('coastal_swada_admin_authed', 'true');
      setIsAuthenticated(true);
      setPinError('');
      showToast('Welcome back, Owner!');
    } else {
      setPinError('Invalid Owner PIN. Default PIN is 9538.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('coastal_swada_admin_authed');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Toggle availability instant 1-click
  const toggleAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = !item.available;
          showToast(`"${item.nameEn || item.name}" is now ${updated ? 'AVAILABLE ✅' : 'SOLD OUT ❌'}`);
          return { ...item, available: updated };
        }
        return item;
      })
    );
  };

  // ── OPEN SEARCH BAR (When owner wants to add dish) ──
  const openDishSearch = () => {
    setDishSearchQuery('');
    setDishSearchCat('All');
    setIsDishSearchOpen(true);
  };

  // ── ADD DISH DIRECTLY FROM SEARCH RESULTS ──
  const handleAddDishFromSearch = (dish: QuickDish) => {
    const customPrice = dishPrices[dish.nameEn] ?? dish.defaultPrice;
    const slug = dish.nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newId = `${slug}-${Date.now().toString(36)}`;

    const newProduct: Product = {
      id: newId,
      name: dish.name,        // Authentic Kannada name
      nameEn: dish.nameEn,    // English subtitle
      price: Math.max(10, customPrice),
      category: dish.category,
      vegetarian: dish.veg,
      spice: dish.spice,
      image: dish.image,
      description: dish.description,
      available: true,
      popular: 88,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setAddedDishNames((prev) => ({ ...prev, [dish.nameEn]: true }));
    showToast(`✓ "${dish.name}" (${dish.nameEn}) menuಗೆ ಸೇರಿಸಲಾಗಿದೆ!`);
  };

  // Open manual modal (for custom dish or editing)
  const openManualAddModal = () => {
    setIsDishSearchOpen(false);
    setEditingProduct(null);
    setFormName('');
    setFormNameEn('');
    setFormPrice('');
    setFormCategory(STANDARD_CATEGORIES[0]);
    setCustomCategory('');
    setFormVeg(false);
    setFormSpice(2);
    setFormImage(PRESET_IMAGES[0].url);
    setFormDesc('');
    setFormAvailable(true);
    setFormPopular(85);
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing dish
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormNameEn(p.nameEn || '');
    setFormPrice(p.price.toString());
    if (STANDARD_CATEGORIES.includes(p.category)) {
      setFormCategory(p.category);
      setCustomCategory('');
    } else {
      setFormCategory('Custom');
      setCustomCategory(p.category);
    }
    setFormVeg(p.vegetarian);
    setFormSpice(p.spice);
    setFormImage(p.image || PRESET_IMAGES[0].url);
    setFormDesc(p.description || '');
    setFormAvailable(p.available);
    setFormPopular(p.popular || 85);
    setIsModalOpen(true);
  };

  // Save manual Add/Edit
  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();
    const finalCategory = formCategory === 'Custom' ? customCategory.trim() || 'Coastal classics' : formCategory;
    const parsedPrice = Math.max(1, parseInt(formPrice, 10) || 100);

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? {
                ...item,
                name: formName.trim() || item.name,
                nameEn: formNameEn.trim() || item.nameEn,
                price: parsedPrice,
                category: finalCategory,
                vegetarian: formVeg,
                spice: formSpice,
                image: formImage.trim() || '/cinematic-cuisine.jpg',
                description: formDesc.trim(),
                available: formAvailable,
                popular: formPopular,
              }
            : item
        )
      );
      showToast(`Updated "${formNameEn || formName}"!`);
    } else {
      const slug = (formNameEn || formName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const newId = `${slug || 'dish'}-${Date.now().toString(36)}`;
      const newProduct: Product = {
        id: newId,
        name: formName.trim() || 'ಹೊಸ ಖಾದ್ಯ',
        nameEn: formNameEn.trim() || 'New Special Dish',
        price: parsedPrice,
        category: finalCategory,
        vegetarian: formVeg,
        spice: formSpice,
        image: formImage.trim() || '/cinematic-cuisine.jpg',
        description: formDesc.trim() || 'Made fresh in our Karavali heritage kitchen.',
        available: formAvailable,
        popular: formPopular,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Added "${newProduct.nameEn}" to menu!`);
    }

    setIsModalOpen(false);
  };

  // Delete Dish
  const handleDelete = (p: Product) => {
    if (window.confirm(`Are you sure you want to delete "${p.nameEn} (${p.name})" from the menu?`)) {
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
      showToast(`Deleted "${p.nameEn}" from menu.`);
    }
  };

  // Categories list for active menu
  const allCategories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  }, [products]);

  // Filtered dishes for active menu
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        `${p.name} ${p.nameEn || ''} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesAvail =
        availabilityFilter === 'all'
          ? true
          : availabilityFilter === 'available'
          ? p.available
          : !p.available;
      return matchesSearch && matchesCat && matchesAvail;
    });
  }, [products, searchQuery, selectedCategory, availabilityFilter]);

  // ── FILTER 120+ KARNATAKA CATALOGUE FOR THE SEARCH MODAL ──
  const searchResults = useMemo(() => {
    const rawQ = dishSearchQuery.trim().toLowerCase();
    const words = rawQ ? rawQ.split(/\s+/).filter(Boolean) : [];

    return KARNATAKA_FOOD_CATALOGUE.filter((dish) => {
      // Category / Region filter
      if (dishSearchCat !== 'All') {
        if (dishSearchCat === 'Coastal Karavali' && dish.region !== 'Coastal Karavali' && dish.category !== 'Fish & seafood') return false;
        if (dishSearchCat === 'Old Mysore' && dish.region !== 'Old Mysore') return false;
        if (dishSearchCat === 'North Karnataka' && dish.region !== 'North Karnataka') return false;
        if (dishSearchCat === 'Malnad & Coorg' && dish.region !== 'Malnad & Coorg') return false;
        if (dishSearchCat === 'Fish & Seafood' && dish.category !== 'Fish & seafood') return false;
        if (dishSearchCat === 'Chicken' && dish.category !== 'Chicken') return false;
      }

      if (words.length === 0) return true;

      // Smart multi-word matching across English, Kannada, keywords, region, description
      const combinedSearchText = [
        dish.nameEn,
        dish.name,
        dish.description,
        dish.category,
        dish.region || '',
        ...(dish.keywords || []),
      ].join(' ').toLowerCase();

      return words.every((w) => combinedSearchText.includes(w));
    });
  }, [dishSearchQuery, dishSearchCat]);

  // ── SMART ON-THE-FLY TRANSLITERATION MATCH FOR ANY SEARCHED FOOD ──
  const instantMatch = useMemo(() => {
    const q = dishSearchQuery.trim();
    if (!q || q.length < 2) return null;

    // Check if query exactly matches an item already in the top results
    const exactMatch = searchResults.some(
      (d) => d.nameEn.toLowerCase() === q.toLowerCase() || d.name === q
    );
    if (exactMatch) return null;

    const kannadaName = transliterateToKannada(q);
    const attrs = detectDishAttributes(q);

    const titleEn = q
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    return {
      name: kannadaName || titleEn,
      nameEn: titleEn,
      category: attrs.category,
      spice: attrs.spice,
      veg: attrs.veg,
      description: `Authentic Karnataka ${titleEn}, prepared fresh to order.`,
      image: attrs.image,
      defaultPrice: attrs.defaultPrice,
      region: 'Custom Karnataka Dish',
      keywords: [q.toLowerCase()],
    } as QuickDish;
  }, [dishSearchQuery, searchResults]);

  const availableCount = products.filter((p) => p.available).length;
  const unavailableCount = products.filter((p) => !p.available).length;

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#1b1513] border border-[#43302a] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f24b26] via-[#ff8b48] to-[#f9c778]" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#f24b26] text-white border border-[#f24b26]/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#f24b26]/20">
              <Lock size={28} />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[.2em] text-[#f24b26] mb-1">
              RESTAURANT PORTAL · ಮಾಲೀಕರ ನಿಯಂತ್ರಣ
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff5e8]">
              Owner Dashboard
            </h1>
            <p className="text-xs text-[#bba99d] mt-1.5">
              Enter your Owner PIN to manage dish availability and menu items.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#fff5e8] mb-1.5">
                Owner PIN / ಪಾಸ್‌ವರ್ಡ್
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full rounded-xl border border-[#43302a] bg-[#241a17] px-4 py-3.5 text-base text-[#fff5e8] outline-none transition focus:border-[#f24b26] focus:ring-2 focus:ring-[#f24b26]/20"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#bba99d] hover:text-[#f24b26]"
                  aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {pinError && (
                <p className="text-xs text-[#f24b26] mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle size={14} /> {pinError}
                </p>
              )}
              <p className="text-[11px] text-[#bba99d] mt-2 bg-[#241a17] p-2.5 rounded-lg border border-[#43302a]">
                💡 <strong>Owner default PIN:</strong> <code className="bg-[#1b1513] border border-[#43302a] px-1.5 py-0.5 rounded font-bold text-[#ff8b48]">9538</code> (matches restaurant WhatsApp <span className="font-semibold text-[#fff5e8]">+91 95385 96072</span>)
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#f24b26] py-3.5 text-sm font-semibold text-white transition hover:bg-[#d93f1d] shadow-lg shadow-[#f24b26]/25"
            >
              <ShieldCheck size={18} /> Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#43302a] text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f24b26] hover:underline">
              <ArrowLeft size={14} /> Return to customer website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Owner View
  return (
    <div className="pb-24 pt-6">
      <div className="shell">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#1b1513] text-[#fff5e8] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium border border-[#f24b26]/50 animate-rise-in">
            <Check size={18} className="text-[#f24b26]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#43302a]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#f24b26] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                <ChefHat size={16} />
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff5e8] m-0">
                Menu &amp; Availability Manager
              </h1>
            </div>
            <p className="text-xs text-[#bba99d] mt-1" style={{ fontFamily: "'Noto Serif Kannada', serif" }}>
              ಕರ್ನಾಟಕದ ಸಮಗ್ರ ಖಾದ್ಯಗಳ ನಿರ್ವಹಣೆ · ಲಭ್ಯತೆ ಬದಲಾಯಿಸಿ ಮತ್ತು ಹೊಸ ಖಾದ್ಯಗಳನ್ನು ಹುಡುಕಿ ಸೇರಿಸಿ
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#43302a] bg-[#241a17] text-xs font-semibold text-[#fff5e8] hover:border-[#f24b26] transition shadow-sm"
            >
              <ExternalLink size={14} /> View Live Menu
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#43302a] bg-[#241a17] text-xs font-semibold text-[#f24b26] hover:bg-[#1b1513] transition"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-[#1b1513] border border-[#43302a] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-[#bba99d] mb-2 text-xs font-semibold">
              <span>TOTAL DISHES</span>
              <Package size={16} className="text-[#ff8b48]" />
            </div>
            <div className="text-3xl font-display font-bold text-[#fff5e8]">
              {products.length}
            </div>
            <div className="text-[10px] text-[#bba99d] mt-1">Full restaurant menu</div>
          </div>

          <div className="bg-[#1b1513] border border-[#43302a] rounded-2xl p-4 shadow-sm border-l-4 border-l-[#25D366]">
            <div className="flex items-center justify-between text-[#25D366] mb-2 text-xs font-semibold">
              <span>AVAILABLE NOW</span>
              <PackageCheck size={16} />
            </div>
            <div className="text-3xl font-display font-bold text-[#25D366]">
              {availableCount}
            </div>
            <div className="text-[10px] text-[#bba99d] mt-1">Customers can order</div>
          </div>

          <div className="bg-[#1b1513] border border-[#43302a] rounded-2xl p-4 shadow-sm border-l-4 border-l-[#f24b26]">
            <div className="flex items-center justify-between text-[#f24b26] mb-2 text-xs font-semibold">
              <span>SOLD OUT</span>
              <PackageX size={16} />
            </div>
            <div className="text-3xl font-display font-bold text-[#f24b26]">
              {unavailableCount}
            </div>
            <div className="text-[10px] text-[#bba99d] mt-1">Temporarily disabled</div>
          </div>

          <div className="bg-[#1b1513] border border-[#43302a] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="text-xs font-semibold text-[#bba99d] mb-1">
              WHATSAPP ORDERS
            </div>
            <div className="text-sm font-bold text-[#ff8b48] truncate">
              +91 95385 96072
            </div>
            <button
              onClick={openDishSearch}
              className="mt-2 w-full py-2 px-3 rounded-full bg-[#f24b26] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#d93f1d] shadow-sm transition"
            >
              <Plus size={15} /> Add Dish
            </button>
          </div>
        </div>

        {/* Controls Bar: Search, Category, Status, Add Button */}
        <div className="bg-[#1b1513] border border-[#43302a] rounded-2xl p-4 sm:p-5 mb-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input for Menu Table */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bba99d]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Ghee Roast, Kori Rotti, ಮೀನು, Bisi Bele Bath...)"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#43302a] bg-[#241a17] text-xs text-[#fff5e8] placeholder-[#7a6059] outline-none transition focus:border-[#f24b26]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bba99d] hover:text-[#f24b26]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#241a17] rounded-xl self-start sm:self-auto border border-[#43302a]">
              {(
                [
                  { id: 'all', label: `All (${products.length})` },
                  { id: 'available', label: `Available (${availableCount})` },
                  { id: 'unavailable', label: `Sold Out (${unavailableCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAvailabilityFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    availabilityFilter === tab.id
                      ? 'bg-[#f24b26] text-white shadow-sm'
                      : 'text-[#bba99d] hover:text-[#fff5e8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Add Dish Action Button — OPENS PURE SEARCH BAR! */}
            <button
              onClick={openDishSearch}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f24b26] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d93f1d] shadow-sm shrink-0"
            >
              <Plus size={16} /> Add New Dish
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-[#bba99d] whitespace-nowrap">Category:</span>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border transition ${
                  selectedCategory === cat
                    ? 'bg-[#f24b26] text-white border-[#f24b26]'
                    : 'bg-[#241a17] border-[#43302a] text-[#bba99d] hover:border-[#f24b26]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes List / Cards */}
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-[#1b1513] border border-dashed border-[#43302a] rounded-2xl p-12 text-center text-[#bba99d]">
              <PackageX size={36} className="mx-auto mb-2 text-[#f24b26]" />
              <p className="text-sm font-semibold text-[#fff5e8]">No dishes found</p>
              <p className="text-xs text-[#bba99d] mt-1">Try adjusting your search query or filters.</p>
              <button
                onClick={openDishSearch}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f24b26] text-white text-xs font-bold hover:bg-[#d93f1d]"
              >
                <Plus size={14} /> Search &amp; Add Dishes
              </button>
            </div>
          ) : (
            filteredProducts.map((dish) => (
              <div
                key={dish.id}
                className={`bg-[#1b1513] border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-sm hover:shadow-md ${
                  dish.available ? 'border-[#43302a] hover:border-[#f24b26]/50' : 'border-[#f24b26]/40 bg-[#1b1513]'
                }`}
              >
                {/* Dish Info */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#43302a] bg-[#241a17] relative">
                    <img
                      src={dish.image}
                      alt={dish.nameEn || dish.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/cinematic-cuisine.jpg';
                      }}
                    />
                    {!dish.available && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white bg-[#f24b26] px-1.5 py-0.5 rounded uppercase tracking-wider">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#241a17] text-[#fff5e8] border border-[#43302a]">
                        {dish.category}
                      </span>
                      {dish.vegetarian ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          🌱 Veg
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40">
                          🍗 Non-Veg
                        </span>
                      )}
                      {dish.spice > 0 && (
                        <span className="text-[10px] text-[#f24b26] font-semibold">
                          {'🌶️'.repeat(dish.spice)}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-[#fff5e8] m-0 truncate" style={{ fontFamily: "'Noto Serif Kannada', serif" }}>
                      {dish.name}
                      <span className="text-xs font-sans font-medium text-[#bba99d] ml-2">
                        ({dish.nameEn})
                      </span>
                    </h3>

                    <p className="text-xs text-[#bba99d] line-clamp-1 mt-0.5 mb-1.5">
                      {dish.description}
                    </p>

                    <div className="text-sm font-bold text-[#ff8b48]">
                      {money(dish.price)}
                    </div>
                  </div>
                </div>

                {/* Controls: Availability Switch + Edit / Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#43302a]">
                  {/* Availability Toggle Button */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(dish.id)}
                      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        dish.available ? 'bg-[#25D366]' : 'bg-[#f24b26]'
                      }`}
                      role="switch"
                      aria-checked={dish.available}
                      title={dish.available ? 'Click to mark as Sold Out' : 'Click to mark as Available'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          dish.available ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        dish.available
                          ? 'bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30'
                          : 'bg-[#f24b26]/15 text-[#f24b26] border border-[#f24b26]/30'
                      }`}
                    >
                      {dish.available ? '🟢 Available' : '🔴 Sold Out'}
                    </span>
                  </div>

                  {/* Edit / Delete Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(dish)}
                      className="p-2 rounded-xl bg-[#241a17] border border-[#43302a] text-[#fff5e8] hover:border-[#f24b26] transition"
                      title="Edit dish details"
                      aria-label="Edit dish"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(dish)}
                      className="p-2 rounded-xl bg-[#241a17] border border-[#43302a] text-[#f24b26] hover:bg-[#2a1a18] transition"
                      title="Delete dish"
                      aria-label="Delete dish"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Reset & Helper */}
        <div className="mt-10 p-5 bg-[#1b1513] border border-[#43302a] rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fff5e8] m-0">
              Need to restore original defaults?
            </h4>
            <p className="text-xs text-[#bba99d] mt-0.5">
              Reset menu to original authentic coastal dishes.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all items back to the factory restaurant default menu?')) {
                onResetMenu();
                showToast('Reset menu to factory default items.');
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#43302a] bg-[#241a17] text-xs font-bold text-[#bba99d] hover:text-[#f24b26] hover:border-[#f24b26] transition"
          >
            <RefreshCw size={14} /> Reset Menu to Default
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PURE SEARCH OVERLAY: When clicking "+ Add Dish"
          Searches 120+ Karnataka dishes or auto-generates any food in Kannada!
      ───────────────────────────────────────────────────────────── */}
      {isDishSearchOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDishSearchOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#1b1513] border border-[#43302a] rounded-3xl w-full max-w-2xl shadow-2xl relative my-6 animate-rise-in max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header: Clean & minimal */}
            <div className="p-5 sm:p-6 pb-4 border-b border-[#43302a] bg-[#241a17]">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#f24b26] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    <Search size={14} />
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-bold text-[#fff5e8] m-0 leading-tight">
                      ಕರ್ನಾಟಕದ ಖಾದ್ಯ ಹುಡುಕಿ ಸೇರಿಸಿ · Karnataka Dish Search
                    </h2>
                    <p className="text-[11px] text-[#bba99d] m-0 mt-0.5">
                      Type <strong>ANY</strong> Karnataka dish in English (e.g. <span className="font-semibold text-[#ff8b48]">Bisi Bele Bath</span>, <span className="font-semibold text-[#ff8b48]">Davangere Benne Dosa</span>, <span className="font-semibold text-[#ff8b48]">Nati Koli Saaru</span>, <span className="font-semibold text-[#ff8b48]">Bangdi Fry</span>) — added in Kannada with photo!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDishSearchOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#1b1513] border border-[#43302a] flex items-center justify-center text-[#bba99d] hover:text-[#f24b26] hover:bg-[#241a17] transition shrink-0"
                  aria-label="Close search"
                >
                  <X size={16} />
                </button>
              </div>

              {/* SEARCH INPUT BAR — Prominent, auto-focused */}
              <div className="relative mt-2">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ff8b48]" />
                <input
                  type="text"
                  autoFocus
                  value={dishSearchQuery}
                  onChange={(e) => setDishSearchQuery(e.target.value)}
                  placeholder="🔍 Type ANY food: Bisi Bele Bath, Mysore Pak, Ragi Mudde, Benne Dosa, Bangdi Fry, Nati Koli..."
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-[#43302a] bg-[#1b1513] text-sm font-medium text-[#fff5e8] placeholder-[#7a6059] outline-none transition focus:border-[#f24b26] focus:ring-4 focus:ring-[#f24b26]/10 shadow-inner"
                />
                {dishSearchQuery && (
                  <button
                    onClick={() => setDishSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bba99d] hover:text-[#f24b26] p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Quick Category / Region Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-0.5 scrollbar-none">
                {SEARCH_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDishSearchCat(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      dishSearchCat === cat
                        ? 'bg-[#f24b26] text-white shadow-sm'
                        : 'bg-[#1b1513] border border-[#43302a] text-[#bba99d] hover:border-[#f24b26]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count Bar */}
            <div className="px-6 py-2 bg-[#241a17] border-b border-[#43302a] flex items-center justify-between text-xs text-[#bba99d]">
              <span>
                {searchResults.length} {searchResults.length === 1 ? 'dish' : 'dishes'} found
                {dishSearchQuery && <span> for &ldquo;<strong>{dishSearchQuery}</strong>&rdquo;</span>}
              </span>
              <span className="text-[11px] text-[#ff8b48] font-medium hidden sm:inline">
                Click <strong>+ Add to Menu</strong> on any dish below
              </span>
            </div>

            {/* SEARCH RESULTS: Scrollable list of visual food cards with pictures */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">

              {/* ── AUTO-DETECTED ON-THE-FLY MATCH FOR ANY OTHER SEARCHED FOOD ── */}
              {instantMatch && (
                <div className="rounded-2xl p-3.5 sm:p-4 border-2 border-[#f24b26] bg-[#241a17] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#f24b26]/50 bg-[#1b1513] shadow-sm relative">
                      <img
                        src={instantMatch.image}
                        alt={instantMatch.nameEn}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/cinematic-cuisine.jpg';
                        }}
                      />
                      <div className="absolute top-1 left-1 bg-[#f24b26] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                        <Sparkles size={10} /> Instant
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f24b26] text-white">
                          ✨ Auto-Detected
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1b1513] text-[#fff5e8] border border-[#43302a]">
                          {instantMatch.category}
                        </span>
                        {instantMatch.veg ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">🌱 Veg</span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40">🍗 Non-Veg</span>
                        )}
                      </div>

                      {/* Transliterated Kannada Name */}
                      <h3
                        className="text-base sm:text-lg font-bold text-[#fff5e8] m-0 truncate"
                        style={{ fontFamily: "'Noto Serif Kannada', serif" }}
                      >
                        {instantMatch.name}
                      </h3>

                      <div className="text-xs font-semibold text-[#ff8b48] truncate">
                        {instantMatch.nameEn} (Ready to add in Kannada)
                      </div>

                      <p className="text-[11px] text-[#bba99d] line-clamp-1 mt-0.5 m-0">
                        {instantMatch.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#43302a]">
                    <div className="flex items-center gap-1 bg-[#1b1513] px-2.5 py-1.5 rounded-xl border border-[#43302a]">
                      <span className="text-xs font-bold text-[#bba99d]">₹</span>
                      <input
                        type="number"
                        min="10"
                        step="10"
                        value={dishPrices[instantMatch.nameEn] ?? instantMatch.defaultPrice}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setDishPrices((prev) => ({
                            ...prev,
                            [instantMatch.nameEn]: isNaN(val) ? 0 : val,
                          }));
                        }}
                        className="w-16 bg-transparent text-sm font-bold text-[#fff5e8] outline-none text-right"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddDishFromSearch(instantMatch)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${
                        addedDishNames[instantMatch.nameEn]
                          ? 'bg-[#25D366] text-white hover:bg-[#20b858]'
                          : 'bg-[#f24b26] text-white hover:bg-[#d93f1d]'
                      }`}
                    >
                      {addedDishNames[instantMatch.nameEn] ? (
                        <>
                          <CheckCircle2 size={14} className="text-white" />
                          <span>Added! (ಮತ್ತೆ ಸೇರಿಸಿ)</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>+ Add to Menu</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Regular Catalogue Matches */}
              {searchResults.length === 0 && !instantMatch ? (
                <div className="text-center py-10 px-4">
                  <div className="w-14 h-14 rounded-full bg-[#241a17] text-[#f24b26] flex items-center justify-center mx-auto mb-3 border border-[#43302a]">
                    <Search size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-[#fff5e8]">
                    No matching dish found for &ldquo;{dishSearchQuery}&rdquo;
                  </h3>
                  <p className="text-xs text-[#bba99d] mt-1 max-w-sm mx-auto">
                    Search for any food in Karnataka: e.g. &ldquo;Bisi Bele Bath&rdquo;, &ldquo;Mysore Pak&rdquo;, &ldquo;Ragi Mudde&rdquo;, &ldquo;Benne Dosa&rdquo;, or &ldquo;Nati Koli&rdquo;.
                  </p>
                  <button
                    onClick={openManualAddModal}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f24b26] text-white text-xs font-bold hover:bg-[#d93f1d] shadow-sm"
                  >
                    <Plus size={14} /> + Add Custom Dish Manually
                  </button>
                </div>
              ) : (
                searchResults.map((dish) => {
                  const currentPrice = dishPrices[dish.nameEn] ?? dish.defaultPrice;
                  const isAdded = !!addedDishNames[dish.nameEn];

                  return (
                    <div
                      key={dish.nameEn}
                      className={`rounded-2xl p-3.5 sm:p-4 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isAdded
                          ? 'bg-[#1b1513] border-[#25D366]'
                          : 'bg-[#241a17] border-[#43302a] hover:border-[#f24b26]/60 shadow-sm'
                      }`}
                    >
                      {/* Left side: Photo + Kannada Name + English Subtitle */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#43302a] bg-[#1b1513] shadow-sm relative">
                          <img
                            src={dish.image}
                            alt={dish.nameEn}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/cinematic-cuisine.jpg';
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            {dish.region && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1b1513] text-[#ff8b48] border border-[#43302a]">
                                {dish.region}
                              </span>
                            )}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1b1513] text-[#fff5e8] border border-[#43302a]">
                              {dish.category}
                            </span>
                            {dish.veg ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                                🌱 Veg
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40">
                                🍗 Non-Veg
                              </span>
                            )}
                            {dish.spice > 0 && (
                              <span className="text-[10px] text-[#f24b26] font-semibold">
                                {'🌶️'.repeat(dish.spice)}
                              </span>
                            )}
                          </div>

                          {/* Authentic Kannada Name — Bold and Prominent */}
                          <h3
                            className="text-base sm:text-lg font-bold text-[#fff5e8] m-0 truncate"
                            style={{ fontFamily: "'Noto Serif Kannada', serif" }}
                          >
                            {dish.name}
                          </h3>

                          {/* English subtitle */}
                          <div className="text-xs font-semibold text-[#bba99d] truncate">
                            {dish.nameEn}
                          </div>

                          <p className="text-[11px] text-[#bba99d] line-clamp-1 mt-0.5 m-0">
                            {dish.description}
                          </p>
                        </div>
                      </div>

                      {/* Right side: Price Input + Add Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#43302a]">
                        <div className="flex items-center gap-1 bg-[#1b1513] px-2.5 py-1.5 rounded-xl border border-[#43302a]">
                          <span className="text-xs font-bold text-[#bba99d]">₹</span>
                          <input
                            type="number"
                            min="10"
                            step="10"
                            value={currentPrice}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setDishPrices((prev) => ({
                                ...prev,
                                [dish.nameEn]: isNaN(val) ? 0 : val,
                              }));
                            }}
                            className="w-16 bg-transparent text-sm font-bold text-[#fff5e8] outline-none text-right"
                            title="Set custom price"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddDishFromSearch(dish)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${
                            isAdded
                              ? 'bg-[#25D366] text-white hover:bg-[#20b858]'
                              : 'bg-[#f24b26] text-white hover:bg-[#d93f1d]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 size={14} className="text-white" />
                              <span>Added! (ಮತ್ತೆ ಸೇರಿಸಿ)</span>
                            </>
                          ) : (
                            <>
                              <Plus size={14} />
                              <span>+ Add to Menu</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Bottom Footer: Custom Dish Escape Hatch */}
            <div className="p-3.5 sm:p-4 bg-[#241a17] border-t border-[#43302a] flex items-center justify-between gap-3 text-xs">
              <span className="text-[#bba99d]">
                Looking to customize every field manually?
              </span>
              <button
                type="button"
                onClick={openManualAddModal}
                className="text-[#f24b26] font-bold hover:underline flex items-center gap-1"
              >
                <span>+ Custom dish form</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MANUAL EDIT / CUSTOM DISH MODAL
          Only opens when editing an existing dish or adding a custom dish!
      ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#1b1513] border border-[#43302a] rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative my-8 animate-rise-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#43302a] mb-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#f24b26]">
                  {editingProduct ? 'EDIT DISH' : 'CUSTOM DISH'}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#fff5e8] m-0">
                  {editingProduct ? `Edit ${editingProduct.nameEn}` : 'Add Custom Food Item'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#241a17] border border-[#43302a] flex items-center justify-center text-[#bba99d] hover:text-[#f24b26]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#fff5e8] mb-1">
                    Dish Name in Kannada (ಹೆಸರು) *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. ಮಟನ್ ಸುಕ್ಕಾ"
                    className="w-full rounded-xl border border-[#43302a] bg-[#241a17] px-3.5 py-2.5 text-xs text-[#fff5e8] outline-none focus:border-[#f24b26]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#fff5e8] mb-1">
                    Dish Name in English *
                  </label>
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="e.g. Mutton Sukka"
                    className="w-full rounded-xl border border-[#43302a] bg-[#241a17] px-3.5 py-2.5 text-xs text-[#fff5e8] outline-none focus:border-[#f24b26]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#fff5e8] mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="340"
                    min="1"
                    className="w-full rounded-xl border border-[#43302a] bg-[#241a17] px-3.5 py-2.5 text-xs text-[#fff5e8] outline-none focus:border-[#f24b26]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#fff5e8] mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#43302a] bg-[#241a17] px-3.5 py-2.5 text-xs text-[#fff5e8] outline-none focus:border-[#f24b26]"
                  >
                    {STANDARD_CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#1b1513] text-[#fff5e8]">
                        {c}
                      </option>
                    ))}
                    <option value="Custom" className="bg-[#1b1513] text-[#fff5e8]">+ Custom Category</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#fff5e8] mb-1">
                    Spice Level
                  </label>
                  <select
                    value={formSpice}
                    onChange={(e) => setFormSpice(Number(e.target.value) as 0 | 1 | 2 | 3)}
                    className="w-full rounded-xl border border-[#43302a] bg-[#241a17] px-3.5 py-2.5 text-xs text-[#fff5e8] outline-none focus:border-[#f24b26]"
                  >
                    <option value="0" className="bg-[#1b1513] text-[#fff5e8]">0 - Mild / No Chilli</option>
                    <option value="1" className="bg-[#1b1513] text-[#fff5e8]">1 - Gentle Spice</option>
                    <option value="2" className="bg-[#1b1513] text-[#fff5e8]">2 - Medium Spicy</option>
                    <option value="3" className="bg-[#1b1513] text-[#fff5e8]">3 - Karavali Hot 🔥</option>
                  </select>
                </div>
              </div>

              {formCategory === 'Custom' && (
                <div>
                  <label className="block text-xs font-bold text-[#fff5e8] mb-1">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Desserts, Specials"
                    className="w-full rounded-xl border border-[#43302a] bg-[#241a17] px-3.5 py-2.5 text-xs text-[#fff5e8] outline-none focus:border-[#f24b26]"
                  />
                </div>
              )}

              {/* Veg / Non-Veg & Availability Toggles */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-[#241a17] rounded-xl border border-[#43302a]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#fff5e8]">
                  <input
                    type="checkbox"
                    checked={formVeg}
                    onChange={(e) => setFormVeg(e.target.checked)}
                    className="w-4 h-4 accent-[#25D366] rounded"
                  />
                  <span>🌱 Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#fff5e8]">
                  <input
                    type="checkbox"
                    checked={formAvailable}
                    onChange={(e) => setFormAvailable(e.target.checked)}
                    className="w-4 h-4 accent-[#25D366] rounded"
                  />
                  <span>🟢 Available for orders</span>
                </label>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-xs font-bold text-[#fff5e8] mb-1">
                  Food Photo Preset or Image URL
                </label>
                <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-none">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setFormImage(preset.url)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border transition shrink-0 ${
                        formImage === preset.url
                          ? 'bg-[#f24b26] text-white border-[#f24b26]'
                          : 'bg-[#241a17] border-[#43302a] text-[#bba99d] hover:border-[#f24b26]'
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-4 h-4 rounded object-cover" />
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="Paste image path or URL (e.g. /chicken-ghee-roast.jpg)"
                  className="w-full rounded-xl border border-[#43302a] bg-[#241a17] px-3.5 py-2.5 text-xs text-[#fff5e8] outline-none focus:border-[#f24b26]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#fff5e8] mb-1">
                  Dish Description (ವಿವರಣೆ)
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={2}
                  placeholder="Slow-roasted with native spices, curry leaves and traditional ghee..."
                  className="w-full rounded-xl border border-[#43302a] bg-[#241a17] px-3.5 py-2.5 text-xs text-[#fff5e8] outline-none focus:border-[#f24b26]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#43302a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#43302a] bg-[#241a17] text-xs font-semibold text-[#bba99d] hover:bg-[#1b1513]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#f24b26] text-xs font-bold text-white hover:bg-[#d93f1d] shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
