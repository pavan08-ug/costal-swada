import { useEffect, useMemo, useState, type FormEvent, type SyntheticEvent } from 'react';
import { Link, Route, Router, Switch, useLocation } from 'wouter';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChefHat, ChevronDown, CircleUserRound, Clock3, Eye, EyeOff, Home as HomeIcon, Lock, LogOut, MapPin, MessageCircle, Minus, Phone, Plus, Search, ShieldCheck, ShoppingBag, Trash2, Utensils, X } from 'lucide-react';
import { Address, calculateOrder, CartItem, Customer, money, products as initialProducts, defaultProducts, restaurantConfig, categories, buildWhatsAppMessage, createOrderReference, Product } from './lib/restaurant-data';
import { CoastalSwadaIntro } from './components/CoastalSwadaIntro';
import { AdminPage } from './components/AdminPage';

const emptyAddress: Address = { recipient: '', line1: '', line2: '', landmark: '', city: '', postalCode: '', instructions: '' };
const emptyCustomer: Customer = { name: '', phone: '' };
function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(phone));
}
function normalizeIndianMobile(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
}
function handleFoodImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.fallback !== 'true') {
    image.dataset.fallback = 'true';
    image.src = '/cinematic-cuisine.jpg';
  } else {
    image.style.visibility = 'hidden';
  }
}
function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    if (key === 'coastal-products-v2' && Array.isArray(data)) {
      return data.map((item: any) => {
        if (item.name && typeof item.name === 'string' && item.name.includes('ಕೋರಿ')) {
          return { ...item, name: item.name.replace(/ಕೋರಿ/g, 'ಕೋಳಿ') };
        }
        return item;
      }) as unknown as T;
    }
    return data as T;
  } catch {
    return fallback;
  }
}
function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStore(key, fallback));
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}
const fieldClass = 'w-full rounded-xl border border-[#43302a] bg-[#1b1513] px-4 py-3 text-[14px] text-[#fff5e8] outline-none transition placeholder:text-[#5a4540] focus:border-[#f24b26] focus:ring-2 focus:ring-[#f24b26]/15';
const primaryClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#f24b26] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#ff6a3d] hover:shadow-[0_6px_20px_rgba(242,75,38,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 shadow-[0_4px_14px_rgba(242,75,38,0.25)]';
const secondaryClass = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#43302a] bg-[#1b1513] px-6 py-3.5 text-sm font-semibold text-[#bba99d] transition-all duration-200 hover:border-[#f24b26] hover:text-[#f24b26] hover:bg-[#241a17] hover:shadow-[0_4px_14px_rgba(242,75,38,0.15)] hover:-translate-y-0.5 active:translate-y-0 shadow-sm';

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('coastal_swada_intro_seen');
  });
  const [isIntroExiting, setIsIntroExiting] = useState(false);
  const [productsList, setProductsList] = usePersisted<Product[]>('coastal-products-v2', defaultProducts);
  const [cart, setCart] = usePersisted<CartItem[]>('coastal-cart', []);
  const [customer, setCustomer] = usePersisted<Customer>('coastal-customer', emptyCustomer);
  const [address, setAddress] = usePersisted<Address>('coastal-address', emptyAddress);
  const [saved, setSaved] = usePersisted<boolean>('coastal-address-saved', false);
  const [cartNotice, setCartNotice] = useState('');
  const [path] = useLocation();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const summary = useMemo(() => calculateOrder(cart, productsList), [cart, productsList]);

  const handleIntroComplete = () => {
    setIsIntroExiting(true);
    sessionStorage.setItem('coastal_swada_intro_seen', 'true');
    window.setTimeout(() => {
      setShowIntro(false);
      setIsIntroExiting(false);
    }, 700);
  };

  const handleReplayIntro = () => {
    setIsIntroExiting(false);
    setShowIntro(true);
  };

  const changeQuantity = (id: string, delta: number) => {
    const product = productsList.find((entry) => entry.id === id);
    if (!product || (delta > 0 && !product.available)) return;
    if (delta > 0) {
      setCartNotice(`${product.name} added to your bag.`);
      window.setTimeout(() => setCartNotice(''), 2400);
    }
    setCart((current) => {
      const existing = current.find((item) => item.productId === id);
      if (!existing) return delta > 0 ? [...current, { productId: id, quantity: 1 }] : current;
      return current.map((item) => item.productId === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0);
    });
  };

  return (
    <Router>
      {/* CINEMATIC OPENING ANIMATION OVERLAY */}
      {showIntro && (
        <CoastalSwadaIntro
          onComplete={handleIntroComplete}
          isExiting={isIntroExiting}
        />
      )}

      <div className="min-h-[100dvh] bg-[#100d0c] text-[#fff5e8] selection:bg-[#43302a] selection:text-[#ff8b48]">
        <header className="sticky top-0 z-40 border-b border-[#43302a] bg-[#100d0c]/95 backdrop-blur-md transition-colors">
          <div className="shell flex h-[76px] items-center justify-between">
            <Link href="/" className="flex items-center gap-3 no-underline group" data-testid="link-brand">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f24b26] text-white shadow-[0_4px_14px_rgba(242,75,38,0.4)] transition-transform group-hover:scale-105"><Utensils size={18}/></span>
              <span className="leading-none">
                <strong className="font-display text-[22px] font-bold tracking-[-.02em] text-[#fff5e8] uppercase" style={{fontFamily:'Barlow Condensed,sans-serif',letterSpacing:'-.01em'}}>COASTAL SWADA</strong>
                <small className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[.2em] text-[#f24b26]">ಕರಾವಳಿ ಕುಟುಂಬ ರೆಸ್ಟಾರೆಂಟ್</small>
              </span>
            </Link>
            <Link href="/location" className="header-location" data-testid="link-header-location">
              <MapPin size={16}/>
              <span><small>DELIVER TO</small><strong>{saved && address.city ? address.city : 'Add your location'}</strong></span>
              <ChevronDown size={13}/>
            </Link>
            <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
              <Link href="/" className={`nav-link ${path === '/' ? 'is-active' : ''}`} data-testid="link-menu">Menu</Link>
              <Link href="/location" className={`nav-link ${path === '/location' ? 'is-active' : ''}`} data-testid="link-location">Delivery area</Link>
              <Link href="/account" className={`nav-link ${path === '/account' ? 'is-active' : ''}`} data-testid="link-account">My profile</Link>

            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login" className="grid h-10 w-10 place-items-center rounded-full text-[#bba99d] transition hover:bg-[#241a17] hover:text-[#fff5e8]" aria-label="Guest profile" data-testid="link-login"><CircleUserRound size={20}/></Link>
              <Link href="/cart" className="relative inline-flex h-11 items-center gap-2 rounded-full bg-[#f24b26] px-4 text-sm font-semibold text-white transition hover:bg-[#ff6a3d] shadow-[0_4px_14px_rgba(242,75,38,0.3)] hover:shadow-[0_6px_20px_rgba(242,75,38,0.4)]" data-testid="link-cart"><ShoppingBag size={17}/><span className="hidden sm:inline">Your bag</span>{count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[#100d0c] bg-[#f9c778] px-1 text-[10px] font-bold text-[#100d0c]" data-testid="text-cart-count">{count}</span>}</Link>
              {/* Secret Owner Access Button: Discrete, low-contrast lock */}
              <Link href="/admin" className="opacity-20 hover:opacity-100 transition-opacity p-1.5 text-[#bba99d] hover:text-[#f24b26] rounded-full hover:bg-[#241a17] ml-0.5" title="Management" aria-label="Staff Access" data-testid="secret-header-owner-btn">
                <Lock size={13}/>
              </Link>
            </div>
          </div>
        </header>
        <div className="demo-banner" data-testid="status-demo"><span className="demo-dot"/> Coastal Swada · Authentic Karavali Cuisine &amp; WhatsApp Ordering</div>
        <main className="page-enter">
          <Switch>
            <Route path="/" component={() => <Home cart={cart} changeQuantity={changeQuantity} products={productsList} onReplayIntro={handleReplayIntro}/>}/>
            <Route path="/admin" component={() => <AdminPage products={productsList} setProducts={setProductsList} onResetMenu={() => setProductsList(defaultProducts)}/>}/>
            <Route path="/login" component={() => <Login customer={customer} setCustomer={setCustomer}/>}/>
            <Route path="/location" component={() => <Location address={address} setAddress={setAddress} saved={saved} setSaved={setSaved}/>}/>
            <Route path="/cart" component={() => <Cart cart={cart} setCart={setCart} summary={summary} customer={customer} address={address} products={productsList}/>}/>
            <Route path="/account" component={() => <Account customer={customer} setCustomer={setCustomer} address={address} setAddress={setAddress} saved={saved} setSaved={setSaved}/>}/>
            <Route component={NotFound}/>
          </Switch>
        </main>
        {path === '/' && count > 0 && <Link href="/cart" className="mobile-sticky-cart" data-testid="link-sticky-cart"><span><strong>{count} {count === 1 ? 'item' : 'items'}</strong><small>View your bag</small></span><strong>{money(summary.subtotal)} <ArrowRight size={17}/></strong></Link>}
        {cartNotice && <div className="cart-toast" role="status" data-testid="status-cart-added"><Check size={17}/><span>{cartNotice}</span><Link href="/cart" data-testid="link-toast-cart">View cart</Link><button onClick={() => setCartNotice('')} aria-label="Dismiss cart notice" data-testid="button-dismiss-cart-toast"><X size={15}/></button></div>}
        <nav className="mobile-bottom-nav" aria-label="Primary navigation">
          <Link href="/" className={path === '/' ? 'active' : ''} aria-current={path === '/' ? 'page' : undefined} data-testid="mobile-home"><HomeIcon size={19}/><span>Home</span></Link>
          <Link href="/account" className={path === '/account' ? 'active' : ''} aria-current={path === '/account' ? 'page' : undefined} data-testid="mobile-account"><CircleUserRound size={19}/><span>Account</span></Link>
          <Link href="/cart" className={path === '/cart' ? 'active' : ''} aria-current={path === '/cart' ? 'page' : undefined} data-testid="mobile-cart"><span className="mobile-cart-icon"><ShoppingBag size={19}/>{count > 0 && <i data-testid="mobile-cart-count">{count}</i>}</span><span>Cart</span></Link>
        </nav>
        <footer className="mt-12 sm:mt-16 border-t border-[#43302a] text-[#fff5e8] overflow-hidden relative" style={{ background: 'linear-gradient(180deg, #1b1513 0%, #100d0c 100%)' }}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#f24b26]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />
          <div className="shell py-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 border-b border-[#E5C7B5]/20">
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#16463D] border border-[#E5C7B5]/40 flex items-center justify-center font-display text-lg text-[#E8A27A]">
                    CS
                  </div>
                  <div>
                    <span className="font-display text-xl text-[#FEEFE8] font-semibold tracking-wide block">Coastal Swada</span>
                    <span className="text-xs text-[#E8A27A] font-medium tracking-wider" style={{ fontFamily: "'Noto Serif Kannada', serif" }}>ಕರಾವಳಿ ಕುಟುಂಬ ರೆಸ್ಟಾರೆಂಟ್</span>
                  </div>
                </div>
                <p className="text-sm text-[#EEDBD0]/80 leading-relaxed pr-4">
                  Authentic Karavali &amp; Mangalorean coastal dining. Slow-roasted ghee roasts, fresh fish curry, feather-light neer dosa, and the heartwarming hospitality of the western shore.
                </p>
                <p className="text-sm text-[#E8A27A] italic font-medium pt-1" style={{ fontFamily: "'Noto Serif Kannada', serif" }}>
                  "ಸಂಸ್ಕೃತಿಯಲ್ಲಿ ಶ್ರೀಮಂತ, ರುಚಿಯಲ್ಲಿ ಅನನ್ಯ — ನಮ್ಮ ಹೆಮ್ಮೆಯ ಕರಾವಳಿ!"
                </p>
              </div>

              <div className="md:col-span-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E8A27A] block mb-2">Direct Contact &amp; Orders</span>
                <div className="space-y-2.5 text-sm text-[#EEDBD0]">
                  <div className="flex items-center gap-2.5">
                    <Phone size={15} className="text-[#E8A27A] shrink-0" />
                    <span>Call Us: </span>
                    <a href="tel:+919538596072" className="text-[#FEEFE8] font-semibold hover:text-[#E8A27A] transition-colors">
                      +91 95385 96072
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MessageCircle size={15} className="text-[#25D366] shrink-0" />
                    <span>WhatsApp: </span>
                    <a
                      href="https://wa.me/919538596072"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      +91 95385 96072 <ArrowUpRight size={13} />
                    </a>
                  </div>
                  <div className="flex items-start gap-2.5 pt-1">
                    <Clock3 size={15} className="text-[#E8A27A] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#EEDBD0]/80">Kitchen Hours: 11:30 AM – 11:00 PM (Every Day)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-[#E8A27A] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#EEDBD0]/80">Karavali Heritage Kitchen · Coastal Karnataka Dining</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E8A27A] block mb-2">Honest Pricing</span>
                <div className="p-4 rounded-xl bg-[#123D36]/80 border border-[#E5C7B5]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#FEEFE8]">
                    <Check size={14} className="text-[#25D366]" /> Zero Platform Fee
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#FEEFE8]">
                    <Check size={14} className="text-[#25D366]" /> Zero Packaging Fee
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#FEEFE8]">
                    <Check size={14} className="text-[#25D366]" /> Only Food Amount
                  </div>
                </div>
                <a
                  href="https://wa.me/919538596072"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#25D366] text-[#0A2621] font-bold text-xs hover:bg-[#20ba59] transition-all no-underline shadow-md"
                >
                  <MessageCircle size={15} /> Order on WhatsApp
                </a>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EEDBD0]/60">
              <span>&copy; {new Date().getFullYear()} Coastal Swada · ಕರಾವಳಿ ಕುಟುಂಬ ರೆಸ್ಟಾರೆಂಟ್. All rights reserved.</span>
              <div className="flex items-center gap-6">
                <a href="#menu" className="hover:text-[#E8A27A] transition-colors no-underline">Menu</a>
                <span className="opacity-40">·</span>
                <Link href="/location" className="hover:text-[#E8A27A] transition-colors no-underline">Delivery Area</Link>
                <span className="opacity-40">·</span>
                <a href="https://wa.me/919538596072" target="_blank" rel="noopener noreferrer" className="hover:text-[#E8A27A] transition-colors no-underline">Contact (+91 95385 96072)</a>
                <span className="opacity-40">·</span>
                {/* Secret discrete lock button in footer */}
                <Link href="/admin" className="opacity-20 hover:opacity-100 transition-opacity p-1 text-[#EEDBD0] hover:text-[#C6A56A]" title="Staff Portal" aria-label="Staff Portal" data-testid="secret-footer-owner-btn">
                  <Lock size={12}/>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

const categoryDisplayMap: Record<string, { kn: string; en: string }> = {
  'All': { kn: 'ಎಲ್ಲವೂ', en: 'All' },
  'Coastal classics': { kn: 'ಕರಾವಳಿ ಕ್ಲಾಸಿಕ್', en: 'Coastal Classics' },
  'Fish & seafood': { kn: 'ಮೀನು ಖಾದ್ಯಗಳು', en: 'Fish & Seafood' },
  'Chicken': { kn: 'ಚಿಕನ್ ಖಾದ್ಯಗಳು', en: 'Chicken' },
  'From the griddle': { kn: 'ದೋಸೆ ಮತ್ತು ರೊಟ್ಟಿ', en: 'From the Griddle' },
  'Vegetarian': { kn: 'ಸಸ್ಯಾಹಾರಿ', en: 'Vegetarian' },
  'Sides & extras': { kn: 'ಅಡ್ಡ ಖಾದ್ಯಗಳು', en: 'Sides & Extras' },
  'Beverages': { kn: 'ಪಾನೀಯಗಳು', en: 'Beverages' },
};

function Home({ cart, changeQuantity, products: homeProducts, onReplayIntro }: { cart: CartItem[]; changeQuantity: (id: string, delta: number) => void; products: Product[]; onReplayIntro?: () => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [sortPopular, setSortPopular] = useState(false);
  const currentCategories = useMemo(() => ['All', ...Array.from(new Set(homeProducts.map((p) => p.category)))], [homeProducts]);
  const chosen = useMemo(() => homeProducts.filter((p) => (category === 'All' || p.category === category) && (!onlyVeg || p.vegetarian) && `${p.name} ${p.nameEn || ''} ${p.description} ${p.category}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sortPopular ? b.popular-a.popular : 0), [category, onlyVeg, query, sortPopular, homeProducts]);
  return <div>
    <div className="hero-atmosphere">
      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" style={{ background: '#f24b26' }}/> THE TASTE OF KARAVALI · ಕರಾವಳಿ ರುಚಿ</div>
          <p className="text-base sm:text-lg text-[#f24b26] italic font-semibold my-2 tracking-wide" style={{ fontFamily: "'Noto Serif Kannada', serif" }}>
            "ಕರಾವಳಿಯ ರುಚಿ, ಮನದ ನೆನಪು."
          </p>
          <h1 className="font-display">A little taste<br/>of the <em>coast.</em></h1>
          <p>Slow-roasted masalas, authentic Mangalorean ghee roasts, soft neer dosa and the serene hospitality of the Karavali shore.</p>
          <div className="flex flex-wrap items-center gap-3 mt-7">
            <a href="#menu" className={`${primaryClass} no-underline`} data-testid="button-explore-menu">Explore the menu <ArrowDown size={16}/></a>
            <a
              href="https://wa.me/919538596072"
              target="_blank"
              rel="noopener noreferrer"
              className={`${secondaryClass} gap-2 no-underline`}
              data-testid="button-whatsapp-hero"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366] shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.535 5.845L0 24l6.335-1.507A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.37l-.359-.214-3.722.886.939-3.628-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
          <div className="hero-meta"><span><Clock3 size={15}/> Karavali heritage kitchen · Made fresh daily</span><span className="meta-separator"/></div>
        </div>
        <div className="hero-image-wrap">
          <img
            src="/cinematic-cuisine.jpg"
            className="hero-image"
            alt="Mangalorean Chicken Ghee Roast, Anjal Fish Fry and Neer Dosa feast"
            data-testid="img-hero-food"
            onError={handleFoodImageError}
          />
          <div className="image-caption"><span>THE KARAVALI TABLE · MANGALOREAN FEAST</span><span>01 — 08</span></div>
          <div className="hero-stamp">Made<br/>for<br/><i>sharing</i></div>
        </div>
      </section>
    </div>
    <section className="shell intro-strip">
      <p className="font-display">From the griddle to the ghee roast — discover a table inspired by the flavours of the western shore.</p>
      <span>Authentic coastal recipes <ArrowRight size={15}/></span>
    </section>
    <section className="shell food-heritage-section my-7 sm:my-9 p-7 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl" style={{ background: 'linear-gradient(135deg, #1b1513 0%, #241a17 100%)', border: '1.5px solid #43302a' }} data-testid="section-food-heritage">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#f24b26]/12 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />
      <div className="max-w-3xl relative z-10">
        <div className="eyebrow mb-3.5"><span className="eyebrow-line" style={{ background: '#f24b26' }}/><span style={{ color: '#ff8b48', letterSpacing: '0.18em' }}>CULINARY TRADITIONS · ಪರಂಪರೆ</span></div>
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight" style={{ fontFamily: "'Noto Serif Kannada', serif", color: '#fff5e8' }}>
          ಕರಾವಳಿಯ ಅಡುಗೆಯ ಪರಂಪರೆ
        </h2>
        <p className="text-lg sm:text-xl leading-relaxed mb-3 font-medium" style={{ fontFamily: "'Noto Sans Kannada', sans-serif", color: '#fff5e8' }}>
          ತಾಜಾ ಪದಾರ್ಥಗಳು, ಸಾಂಪ್ರದಾಯಿಕ ಮಸಾಲೆಗಳು ಮತ್ತು ಕರಾವಳಿಯ ಅಡುಗೆ ಪರಂಪರೆಯಿಂದ ಪ್ರೇರಿತವಾದ ರುಚಿಗಳು.
        </p>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#bba99d', opacity: 0.9 }}>
          Discover flavours inspired by coastal Karnataka, traditional spices, fresh ingredients, and generations of culinary heritage.
        </p>
      </div>
    </section>
    <section className="shell featured-section" aria-labelledby="featured-title">
      <div className="mb-4">
        <p className="text-sm tracking-wide text-[#ff8b48] font-medium" style={{ fontFamily: "'Noto Serif Kannada', serif" }}>
          "ಸಮುದ್ರದ ಸೊಗಡು, ಮಸಾಲೆಯ ಘಮಲು."
        </p>
      </div>
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" style={{ background: '#f24b26' }}/> CHEF'S SPECIALS</div><h2 className="font-display" id="featured-title">Karavali <em>favourites.</em></h2></div><span className="menu-count">Signature picks</span></div>
      <div className="featured-row">{homeProducts.filter((product) => product.popular >= 90).slice(0, 4).map((product) => <article className="featured-card" key={product.id} data-testid={`card-featured-${product.id}`}><img src={product.image} alt={product.name} loading="lazy" onError={handleFoodImageError}/><div><span>DEMO PICK</span><h3 className="font-display">{product.name}</h3><strong>{money(product.price)}</strong><button onClick={() => changeQuantity(product.id, 1)} disabled={!product.available} data-testid={`button-featured-add-${product.id}`}>{product.available ? <>Add <Plus size={14}/></> : 'Unavailable'}</button></div></article>)}</div>
    </section>
    <section id="menu" className="shell menu-section">
      <div className="mb-4">
        <p className="text-sm tracking-wide text-[#f9c778] font-medium" style={{ fontFamily: "'Noto Serif Kannada', serif" }}>
          "ಕರಾವಳಿಯ ಪರಂಪರೆ, ಪ್ರತಿಯೊಂದು ಖಾದ್ಯದಲ್ಲೂ."
        </p>
      </div>
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" style={{ background: '#f24b26' }}/> MADE FOR A LONG LUNCH</div><h2 className="font-display">Find your <em>favourite.</em></h2></div><span className="menu-count">{chosen.length} dishes</span></div>
      <div className="toolbar">
        <label className="searchbox border-[#43302a]"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the menu (e.g. Ghee Roast, Neer Dosa, Anjal...)" aria-label="Search menu" data-testid="input-menu-search"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search" data-testid="button-clear-search"><X size={15}/></button>}</label>
        <div className="filters">
          <div className="category-scroll">
            {currentCategories.map((name) => {
              const info = categoryDisplayMap[name] || { kn: name, en: name };
              return (
                <button
                  key={name}
                  onClick={() => setCategory(name)}
                  className={`filter-chip flex items-center gap-1.5 ${category === name ? 'selected' : ''}`}
                  data-testid={`filter-category-${name.toLowerCase().replaceAll(' ', '-')}`}
                >
                  <span style={{ fontFamily: "'Noto Sans Kannada', sans-serif", fontWeight: 600 }}>{info.kn}</span>
                  <span className="text-[10px] opacity-75 font-normal tracking-wide uppercase">{info.en}</span>
                </button>
              );
            })}
          </div>
          <label className="switch-label"><input type="checkbox" checked={onlyVeg} onChange={(e) => setOnlyVeg(e.target.checked)} data-testid="toggle-vegetarian"/><span className="veg-box"/>Veg only</label>
          <button className={`sort-button ${sortPopular ? 'sorted' : ''}`} onClick={() => setSortPopular((v) => !v)} data-testid="button-sort-popular">Featured <ChevronDown size={14}/></button>
        </div>
      </div>
      {chosen.length ? <div className="product-grid">{chosen.map((product) => {
        const quantity = cart.find((item) => item.productId === product.id)?.quantity ?? 0;
        return <article className={`product-card ${!product.available ? 'unavailable' : ''}`} key={product.id} data-testid={`card-product-${product.id}`}>
          <div className="product-image-wrap"><img src={product.image} alt={product.name} className="product-image" loading="lazy" data-testid={`img-product-${product.id}`} onError={handleFoodImageError}/>{product.popular >= 90 && <span className="popular-tag">Signature</span>}{!product.available && <div className="sold-out"><span>Not available today</span></div>}</div>
          <div className="product-info"><div className="product-title-row"><h3 className="font-display">{product.name}</h3><strong>{money(product.price)}</strong></div><p>{product.description}</p><div className="product-bottom"><span className="food-mark"><i className={product.vegetarian ? 'veg-mark' : 'nonveg-mark'}/>{product.vegetarian ? 'Vegetarian' : 'Coastal'}<span className="spice">{'•'.repeat(product.spice)}</span></span>{product.available ? quantity ? <div className="quantity-control"><button onClick={() => changeQuantity(product.id,-1)} aria-label={`Remove one ${product.name}`} data-testid={`button-decrease-${product.id}`}><Minus size={14}/></button><span data-testid={`text-quantity-${product.id}`}>{quantity}</span><button onClick={() => changeQuantity(product.id,1)} aria-label={`Add one ${product.name}`} data-testid={`button-increase-${product.id}`}><Plus size={14}/></button></div> : <button className="add-button" onClick={() => changeQuantity(product.id,1)} data-testid={`button-add-${product.id}`}>Add <Plus size={15}/></button> : <span className="unavailable-label">Unavailable</span>}</div></div>
        </article>;
      })}</div> : <div className="empty-search border-[#E6DFD2]"><Search size={24}/><h3 className="font-display">Nothing on this plate.</h3><p>Try a different search or browse all dishes.</p><button className={secondaryClass} onClick={() => { setQuery(''); setCategory('All'); setOnlyVeg(false); }} data-testid="button-reset-menu">Reset menu</button></div>}
    </section>
    <section className="shell py-6 my-2 text-center">
      <p className="text-lg sm:text-xl text-[#123D36] font-medium tracking-wide" style={{ fontFamily: "'Noto Serif Kannada', serif" }}>
        "ಪ್ರತಿ ತುತ್ತಿನಲ್ಲೂ ಕರಾವಳಿಯ ಸವಿ."
      </p>
      <div className="w-16 h-0.5 mx-auto mt-3 bg-[#C6A56A]/60 rounded-full" />
    </section>
    <section className="recommend-strip bg-[#123D36]">
      <div className="shell recommend-inner">
        <div>
          <div className="eyebrow light"><span className="eyebrow-line" style={{ background: '#C6A56A' }}/> A LITTLE SOMETHING EXTRA</div>
          <h2 className="font-display">Good things<br/>go <em>together.</em></h2>
          <p>A cool kokum pour beside a spicy roast. That’s the authentic Karavali pairing.</p>
        </div>
        <div className="recommend-item" style={{ borderColor: '#C6A56A60', background: 'rgba(18, 61, 54, 0.75)' }}>
          <img src="/chicken-ghee-roast.jpg" alt="Chicken ghee roast" loading="lazy" onError={handleFoodImageError}/>
          <span style={{ color: '#C6A56A' }}>RECOMMENDED PAIRING</span>
          <strong className="font-display text-[#FAF6ED]" style={{ fontFamily: "'Noto Serif Kannada', serif" }}>ಚಿಕನ್ ಗೀ ರೋಸ್ಟ್</strong>
          <button className="recommend-link" onClick={() => changeQuantity('chicken-ghee-roast',1)} data-testid="button-add-recommended">Add to your bag <Plus size={15}/></button>
        </div>
      </div>
    </section>
  </div>;
}

function PageTitle({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return <div className="page-title"><div className="eyebrow"><span className="eyebrow-line"/>{kicker}</div><h1 className="font-display">{title}</h1><p>{description}</p></div>;
}
function Login({ customer, setCustomer }: { customer: Customer; setCustomer: (value: Customer) => void }) {
  const [form, setForm] = useState(customer);
  const [done, setDone] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidIndianMobile(form.phone)) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    if (password.length < 8) { setError('Use at least 8 characters for this demo password.'); return; }
    if (isSigningIn && (!customer.name || normalizeIndianMobile(customer.phone) !== normalizeIndianMobile(form.phone))) {
      setError('No matching demo profile is saved on this device. Switch to Create account first.');
      return;
    }
    if (!isSigningIn && form.name.trim().length < 2) { setError('Enter your full name to create a demo profile.'); return; }
    setBusy(true);
    window.setTimeout(() => {
      if (!isSigningIn) setCustomer({ name: form.name.trim(), phone: form.phone.trim() });
      setPassword('');
      setDone(true);
      setBusy(false);
      setLocation('/location');
    }, 350);
  };
  return <div className="shell page-narrow page-enter"><PageTitle kicker="A PLACE AT THE TABLE" title="Good food begins here." description="Discover the authentic flavours of the Karavali coast."/>
    <div className="notice demo-disclosure" data-testid="status-demo-auth"><strong>Demo sign-in · not secure production authentication</strong><p>Your password is checked only in this temporary form and is never saved. The demo profile is stored only in this browser on this device.</p></div>
    <div className="auth-mode" role="tablist" aria-label="Profile mode"><button type="button" role="tab" aria-selected={!isSigningIn} className={!isSigningIn ? 'selected' : ''} onClick={() => { setIsSigningIn(false); setError(''); }} data-testid="tab-create-account">Create account</button><button type="button" role="tab" aria-selected={isSigningIn} className={isSigningIn ? 'selected' : ''} onClick={() => { setIsSigningIn(true); setForm(customer); setError(''); }} data-testid="tab-sign-in">Sign in</button></div>
    <form className="form-card" onSubmit={submit}>
      {!isSigningIn && <label>Full name<input className={fieldClass} value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} required minLength={2} autoComplete="name" placeholder="Your full name" data-testid="input-customer-name"/></label>}
      <label>Indian mobile number<input className={fieldClass} value={form.phone} onChange={(e) => setForm({...form, phone:e.target.value})} required type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" data-testid="input-customer-phone"/></label>
      <label>Password <span className="optional">Demo only · not stored</span><span className="password-field"><input className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} type={showPassword ? 'text' : 'password'} autoComplete={isSigningIn ? 'current-password' : 'new-password'} placeholder="At least 8 characters" data-testid="input-demo-password"/><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} data-testid="button-toggle-password">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span></label>
      {error && <p className="form-message" role="alert" data-testid="status-auth-error">{error}</p>}
      <button className={primaryClass} type="submit" disabled={busy} data-testid="button-save-profile">{busy ? 'Preparing your demo profile…' : done ? <><Check size={16}/> Continue to delivery details</> : <>{isSigningIn ? 'Sign in' : 'Create account'} <ArrowRight size={16}/></>}</button>
      <Link href="/account" className="form-secondary" data-testid="link-view-profile">View profile details</Link>
    </form>
  </div>;
}
function Location({ address, setAddress, saved, setSaved }: { address: Address; setAddress: (value: Address) => void; saved: boolean; setSaved: (value: boolean) => void }) {
  const [form, setForm] = useState({ ...emptyAddress, ...address });
  const [locationMessage, setLocationMessage] = useState('');
  const [locating, setLocating] = useState(false);
  const update = (key: keyof Address, value: string) => { setForm({...form,[key]:value}); setSaved(false); };
  const submit = (e: FormEvent) => { e.preventDefault(); setAddress(form); setSaved(true); };
  const useCurrentLocation = () => {
    if (!navigator.geolocation) { setLocationMessage('Location access is not available in this browser. You can enter the address below.'); return; }
    setLocating(true);
    setLocationMessage('Waiting for your browser location permission…');
    navigator.geolocation.getCurrentPosition(
      () => { setLocating(false); setLocationMessage('Location permission was granted. This demo does not turn GPS coordinates into a street address, so please enter your delivery address below.'); },
      (error) => {
        setLocating(false);
        setLocationMessage(error.code === error.PERMISSION_DENIED ? 'Location permission was declined. You can still enter your address manually below.' : 'We could not read your current location. You can still enter your address manually below.');
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 30000 },
    );
  };
  return <div className="shell page-narrow page-enter"><PageTitle kicker="DELIVERY DETAILS" title="Where to, today?" description="Add a delivery address so your order request has somewhere to go."/>
    <div className="notice demo-disclosure" data-testid="status-demo-location"><strong>Delivery location is demo content</strong><p>Service area, availability and delivery times have not been verified. Confirm them with the restaurant before ordering.</p></div>
    <button type="button" className={secondaryClass} onClick={useCurrentLocation} disabled={locating} data-testid="button-current-location"><MapPin size={16}/>{locating ? 'Checking location…' : 'Use my current location'}</button>
    {locationMessage && <p className="form-message" role="status" data-testid="status-geolocation">{locationMessage}</p>}
    <form className="form-card" onSubmit={submit}><label>Recipient name<input className={fieldClass} value={form.recipient} onChange={(e)=>update('recipient',e.target.value)} placeholder="Name at this address" required data-testid="input-address-recipient"/></label><label>House, building &amp; street<input className={fieldClass} value={form.line1} onChange={(e)=>update('line1',e.target.value)} placeholder="House / building and street" required data-testid="input-address-line1"/></label><label>Locality / area <span className="optional">Optional</span><input className={fieldClass} value={form.line2} onChange={(e)=>update('line2',e.target.value)} placeholder="Apartment, area or locality" data-testid="input-address-line2"/></label><label>Landmark <span className="optional">Optional</span><input className={fieldClass} value={form.landmark} onChange={(e)=>update('landmark',e.target.value)} placeholder="Nearby landmark" data-testid="input-address-landmark"/></label><div className="form-row"><label>City<input className={fieldClass} value={form.city} onChange={(e)=>update('city',e.target.value)} required placeholder="City" data-testid="input-address-city"/></label><label>PIN code<input className={fieldClass} value={form.postalCode} onChange={(e)=>update('postalCode',e.target.value)} required pattern="[0-9]{6}" inputMode="numeric" placeholder="6-digit PIN" data-testid="input-address-postal"/></label></div><label>Delivery instructions <span className="optional">Optional</span><textarea className={fieldClass} rows={3} value={form.instructions} onChange={(e)=>update('instructions',e.target.value)} placeholder="Gate code, call on arrival..." data-testid="input-address-instructions"/></label><button type="submit" className={primaryClass} data-testid="button-save-address">{saved ? <><Check size={16}/> Address saved</> : <>Save delivery address <ArrowRight size={16}/></>}</button></form>
  </div>;
}

function QuickOrderModal({ summary, prefillCustomer, prefillAddress, onConfirm, onClose, products }: {
  summary: ReturnType<typeof calculateOrder>;
  prefillCustomer: Customer;
  prefillAddress: Address;
  onConfirm: (c: Customer, a: Address) => void;
  onClose: () => void;
  products: Product[];
}) {
  const [name, setName] = useState(prefillCustomer.name || '');
  const [phone, setPhone] = useState(prefillCustomer.phone || '');
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [addrLine1, setAddrLine1] = useState(prefillAddress.line1 || '');
  const [addrCity, setAddrCity] = useState(prefillAddress.city || '');
  const [addrPin, setAddrPin] = useState(prefillAddress.postalCode || '');
  const [addrLandmark, setAddrLandmark] = useState(prefillAddress.landmark || '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault(); setErr('');
    if (name.trim().length < 2) { setErr('Please enter your full name.'); return; }
    if (!isValidIndianMobile(phone)) { setErr('Enter a valid 10-digit Indian mobile number.'); return; }
    if (orderType === 'delivery' && !addrLine1.trim()) { setErr('Please enter your delivery address.'); return; }
    if (orderType === 'delivery' && !addrCity.trim()) { setErr('Please enter your city.'); return; }
    setBusy(true);
    const cust: Customer = { name: name.trim(), phone: phone.trim() };
    const addr: Address = orderType === 'delivery'
      ? { recipient: name.trim(), line1: addrLine1.trim(), line2: '', landmark: addrLandmark.trim(), city: addrCity.trim(), postalCode: addrPin.trim(), instructions: '' }
      : { recipient: '', line1: '', line2: '', landmark: '', city: '', postalCode: '', instructions: '' };
    setTimeout(() => { setBusy(false); onConfirm(cust, addr); }, 200);
  };
  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); };
  return (
    <div onClick={onBackdrop} style={{ position:'fixed',inset:0,zIndex:100,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(6px)',display:'flex',alignItems:'flex-end',justifyContent:'center' }} role="dialog" aria-modal="true">
      <div style={{ width:'100%',maxWidth:'520px',background:'#1b1513',border:'1px solid #43302a',borderBottom:'none',borderRadius:'24px 24px 0 0',boxShadow:'0 -16px 60px rgba(0,0,0,0.6)',animation:'rise-in .35s ease both',maxHeight:'90dvh',overflowY:'auto' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 22px 14px',borderBottom:'1px solid #43302a',position:'sticky',top:0,background:'#1b1513',zIndex:1,borderRadius:'24px 24px 0 0' }}>
          <div><div style={{ fontSize:'9px',fontWeight:700,letterSpacing:'.18em',color:'#f24b26',marginBottom:'3px' }}>ALMOST THERE</div><h2 style={{ margin:0,fontSize:'20px',fontWeight:600,color:'#fff5e8',fontFamily:'var(--app-font-serif)' }}>Your order details</h2></div>
          <button onClick={onClose} aria-label="Close" style={{ border:'1px solid #43302a',background:'#241a17',borderRadius:'50%',width:'34px',height:'34px',display:'grid',placeItems:'center',cursor:'pointer',color:'#bba99d' }}><X size={17}/></button>
        </div>
        <div style={{ margin:'14px 22px 4px',padding:'12px 16px',background:'linear-gradient(135deg,#241a17 0%,#1b1513 100%)',border:'1px solid #43302a',borderRadius:'14px',color:'#fff5e8' }}>
          <div style={{ fontSize:'10px',color:'#ff8b48',fontWeight:700,letterSpacing:'.12em',marginBottom:'6px' }}>YOUR ORDER · {summary.items.length} {summary.items.length===1?'item':'items'}</div>
          {summary.items.slice(0,3).map(({productId,quantity})=>{const p=products.find(x=>x.id===productId);return p?<div key={productId} style={{ fontSize:'12px',color:'#bba99d',display:'flex',justifyContent:'space-between',marginBottom:'2px' }}><span>{p.name} × {quantity}</span><span style={{ color:'#ff8b48' }}>{money(p.price*quantity)}</span></div>:null;})}
          {summary.items.length>3&&<div style={{ fontSize:'11px',color:'#f9c778' }}>+{summary.items.length-3} more item{summary.items.length-3>1?'s':''}</div>}
          <div style={{ marginTop:'8px',paddingTop:'8px',borderTop:'1px solid #43302a',display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:'14px' }}><span>Total</span><span style={{ color:'#ff8b48' }}>{money(summary.grandTotal)}</span></div>
        </div>
        <form onSubmit={submit} style={{ padding:'8px 22px 28px',display:'grid',gap:'14px' }}>
          <div>
            <div style={{ fontSize:'11px',fontWeight:700,color:'#fff5e8',marginBottom:'8px' }}>Order type</div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px' }}>
              {(['pickup','delivery'] as const).map(type=>(
                <button key={type} type="button" onClick={()=>setOrderType(type)} style={{ padding:'12px 8px',border:`2px solid ${orderType===type?'#f24b26':'#43302a'}`,borderRadius:'12px',background:orderType===type?'#f24b26':'#241a17',color:orderType===type?'#ffffff':'#bba99d',fontWeight:700,fontSize:'12px',cursor:'pointer',transition:'all .2s',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px' }}>
                  <span style={{ fontSize:'18px' }}>{type==='pickup'?'🛍️':'🛵'}</span>
                  <span>{type==='pickup'?'Pickup / ಪಾರ್ಸೆಲ್':'Delivery / ಡೆಲಿವರಿ'}</span>
                </button>
              ))}
            </div>
          </div>
          <label style={{ display:'grid',gap:'6px',fontSize:'11px',fontWeight:700,color:'#fff5e8' }}>Your name *<input className={fieldClass} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Pavan Kumar" required data-testid="input-quick-name"/></label>
          <label style={{ display:'grid',gap:'6px',fontSize:'11px',fontWeight:700,color:'#fff5e8' }}>Mobile number *<input className={fieldClass} value={phone} onChange={e=>setPhone(e.target.value)} type="tel" inputMode="tel" placeholder="+91 98765 43210" required data-testid="input-quick-phone"/></label>
          {orderType==='delivery'&&<>
            <label style={{ display:'grid',gap:'6px',fontSize:'11px',fontWeight:700,color:'#fff5e8' }}>House / street address *<input className={fieldClass} value={addrLine1} onChange={e=>setAddrLine1(e.target.value)} placeholder="House no., street, area" required data-testid="input-quick-line1"/></label>
            <label style={{ display:'grid',gap:'6px',fontSize:'11px',fontWeight:700,color:'#fff5e8' }}>Landmark <span style={{ fontWeight:400,color:'#bba99d' }}>Optional</span><input className={fieldClass} value={addrLandmark} onChange={e=>setAddrLandmark(e.target.value)} placeholder="Near bus stand, temple..." data-testid="input-quick-landmark"/></label>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
              <label style={{ display:'grid',gap:'6px',fontSize:'11px',fontWeight:700,color:'#fff5e8' }}>City *<input className={fieldClass} value={addrCity} onChange={e=>setAddrCity(e.target.value)} placeholder="Udupi" required data-testid="input-quick-city"/></label>
              <label style={{ display:'grid',gap:'6px',fontSize:'11px',fontWeight:700,color:'#fff5e8' }}>PIN code<input className={fieldClass} value={addrPin} onChange={e=>setAddrPin(e.target.value)} inputMode="numeric" placeholder="576101" data-testid="input-quick-pin"/></label>
            </div>
          </>}
          {err&&<p style={{ margin:0,padding:'10px 13px',background:'rgba(242,75,38,0.12)',border:'1px solid #f24b26',borderRadius:'10px',color:'#ff8b48',fontSize:'12px' }} role="alert">{err}</p>}
          <button type="submit" disabled={busy} style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',width:'100%',padding:'15px',borderRadius:'99px',background:'#f24b26',color:'#ffffff',fontWeight:700,fontSize:'14px',border:0,cursor:busy?'not-allowed':'pointer',opacity:busy?0.7:1,boxShadow:'0 4px 16px rgba(242,75,38,0.35)' }} data-testid="button-quick-order-submit">
            {busy?'Opening WhatsApp…':<><MessageCircle size={18}/> Send order on WhatsApp</>}
          </button>
          <p style={{ margin:0,textAlign:'center',fontSize:'10px',color:'#bba99d' }}>Sends directly to +91 95385 96072 · ⚠️ Prices are demo — confirm with restaurant</p>
        </form>
      </div>
    </div>
  );
}

function Cart({ cart, setCart, summary, customer, address, products }: { cart: CartItem[]; setCart: (value: CartItem[]) => void; summary: ReturnType<typeof calculateOrder>; customer: Customer; address: Address; products: Product[] }) {
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const configuredPhone = restaurantConfig.whatsappPhone.replace(/\D/g,'');
  const validPhone = configuredPhone.length >= 10 && configuredPhone.length <= 15;
  const addressReady = Boolean(address.recipient && address.line1 && address.city && address.postalCode);
  const customerReady = Boolean(customer.name && isValidIndianMobile(customer.phone));
  const recommendations = products.filter((product) => product.available && !cart.some((item) => item.productId === product.id)).slice(0, 3);
  const sendToWhatsApp = (cust: Customer, addr: Address) => {
    const reference = createOrderReference();
    const url = `https://wa.me/${configuredPhone}?text=${encodeURIComponent(buildWhatsAppMessage(summary, cust, addr, reference))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setMessage('Your order request was sent to WhatsApp!');
  };
  const order = () => {
    if (!cart.length) { setMessage('Add at least one available menu item before continuing.'); return; }
    if (!validPhone) { setMessage('WhatsApp ordering is not configured yet. Please contact the restaurant directly.'); return; }
    if (!customerReady) { setShowModal(true); return; }
    sendToWhatsApp(customer, address);
  };
  return <div className="shell cart-page page-enter">
    {showModal && <QuickOrderModal summary={summary} prefillCustomer={customer} prefillAddress={address} products={products} onConfirm={(c,a)=>{setShowModal(false);sendToWhatsApp(c,a);}} onClose={()=>setShowModal(false)}/>}
    <div className="cart-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR ORDER</div><h1 className="font-display">Your cart.</h1><p>Your favourites, coming together.</p></div><Link href="/" className="back-link" data-testid="link-back-menu"><ArrowLeft size={16}/> Back to menu</Link></div>
    {cart.length === 0 ? <div className="empty-cart" data-testid="status-cart-empty"><div className="empty-icon"><ShoppingBag size={25}/></div><h2 className="font-display">Your cart is waiting for something delicious.</h2><p>Find something delicious on the menu. Your choices will be waiting here.</p><Link className={`${primaryClass} no-underline`} href="/" data-testid="button-browse-menu">Explore Menu <ArrowRight size={16}/></Link></div> : <>
      <div className="cart-layout">
        <section className="cart-items">{cart.map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          if (!product) return null;
          return <article className="cart-item" key={product.id} data-testid={`row-cart-item-${product.id}`}>
            <img src={product.image} alt={product.name} onError={handleFoodImageError}/>
            <div className="cart-item-info"><h2 className="font-display">{product.name}</h2><p>{product.description}</p><span>{money(product.price)} each</span>
              <div className="quantity-control large">
                <button onClick={() => setCart(cart.map((entry) => entry.productId === product.id ? { ...entry, quantity: entry.quantity - 1 } : entry).filter((entry) => entry.quantity > 0))} aria-label={`Remove one ${product.name}`} data-testid={`button-cart-decrease-${product.id}`}><Minus size={14}/></button>
                <span data-testid={`text-cart-quantity-${product.id}`}>{item.quantity}</span>
                <button disabled={!product.available} onClick={() => setCart(cart.map((entry) => entry.productId === product.id ? { ...entry, quantity: entry.quantity + 1 } : entry))} aria-label={`Add one ${product.name}`} data-testid={`button-cart-increase-${product.id}`}><Plus size={14}/></button>
              </div>
            </div>
            <div className="cart-item-end"><strong>{money(product.price * item.quantity)}</strong><button className="remove-button" onClick={() => setCart(cart.filter((entry) => entry.productId !== product.id))} aria-label={`Remove ${product.name}`} data-testid={`button-remove-${product.id}`}><Trash2 size={16}/></button></div>
          </article>;
        })}<Link href="/" className="add-more" data-testid="link-add-more"><Plus size={16}/> Add something else</Link></section>
        <aside className="summary-card" style={{ borderColor: '#43302a', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)' }}>
          <h2 className="font-display">Bill summary</h2>
          <div className="summary-line"><span>Food item total</span><strong data-testid="text-subtotal">{money(summary.subtotal)}</strong></div>
          <div className="summary-line"><span style={{ color: '#ff8b48', fontWeight: 600 }}>Platform fee</span><span style={{ color: '#25D366', fontWeight: 700 }}>₹0 · Free</span></div>
          <div className="summary-line"><span style={{ color: '#ff8b48', fontWeight: 600 }}>Packaging charges</span><span style={{ color: '#25D366', fontWeight: 700 }}>₹0 · Free</span></div>
          <div className="summary-line"><span style={{ color: '#ff8b48', fontWeight: 600 }}>Delivery charges</span><span style={{ color: '#25D366', fontWeight: 700 }}>₹0 · Free</span></div>
          <div className="summary-line total"><span>Grand total</span><strong data-testid="text-grand-total">{money(summary.grandTotal)}</strong></div>
          <div style={{ background: 'rgba(242, 75, 38, 0.08)', border: '1px solid #43302a', borderRadius: '12px', padding: '12px 14px', marginTop: '14px' }}>
            <span style={{ color: '#fff5e8', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✨ Honest pricing: Only food amount is charged.
            </span>
            <span style={{ color: '#bba99d', fontSize: '10px', display: 'block', marginTop: '3px' }}>
              No hidden fees, zero platform fee, and zero packaging charges.
            </span>
          </div>
          <div className="checkout-details">
            <h3>Deliver to</h3>
            {addressReady ? <p><MapPin size={15}/>{address.recipient}, {address.line1}{address.line2 ? `, ${address.line2}` : ''}{address.landmark ? ` · Near ${address.landmark}` : ''}, {address.city} {address.postalCode}</p> : <Link href="/location" className="checkout-link" data-testid="link-add-address">Add a delivery address <ArrowRight size={14}/></Link>}
            <Link href="/location" className="edit-link" data-testid="link-edit-address">{addressReady ? 'Change address' : 'Manage address'}</Link>
            <h3>Your details</h3>
            {customerReady ? <p><CircleUserRound size={15}/>{customer.name} · {customer.phone}</p> : <button className="checkout-link" style={{ border:0,background:'none',cursor:'pointer',padding:0,display:'inline-flex',alignItems:'center',gap:'6px',color:'#f24b26',fontSize:'10px',fontWeight:600 }} onClick={()=>setShowModal(true)} data-testid="link-add-profile">Enter your name &amp; mobile <ArrowRight size={14}/></button>}
          </div>
          {!validPhone && <div className="owner-notice" data-testid="status-whatsapp-unconfigured"><strong>Restaurant setup needed</strong><p>The WhatsApp number is blank. Add the restaurant’s verified international number in the replaceable config before enabling order requests.</p></div>}
          {message && <p className="form-message" role="status" data-testid="status-order-message">{message}</p>}
          <button className={`${primaryClass} checkout-button`} onClick={order} disabled={!cart.length} data-testid="button-whatsapp-order">Request order on WhatsApp <MessageCircle size={16}/></button>
          <p className="request-disclaimer">Order will be sent directly to +91 95385 96072 via WhatsApp.</p>
        </aside>
      </div>
      {recommendations.length > 0 && <section className="cart-recommendations" data-testid="section-cart-recommendations">
        <div className="eyebrow"><span className="eyebrow-line"/> A LITTLE EXTRA</div><h2 className="font-display">Complete your meal.</h2><p>A little extra makes it better.</p>
        <div className="cart-recommendation-row">{recommendations.map((product) => <article key={product.id} className="cart-recommendation" data-testid={`card-cart-recommendation-${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" onError={handleFoodImageError}/>
          <div><strong className="font-display">{product.name}</strong><span>{money(product.price)}</span></div>
          <button className="add-button" onClick={() => setCart(cart.some((item) => item.productId === product.id) ? cart.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { productId: product.id, quantity: 1 }])} data-testid={`button-cart-recommend-add-${product.id}`}>Add <Plus size={14}/></button>
        </article>)}</div>
      </section>}
    </>}
  </div>;
}

function Account({ customer, setCustomer, address, setAddress, saved, setSaved }: { customer: Customer; setCustomer: (value: Customer) => void; address: Address; setAddress: (value: Address) => void; saved: boolean; setSaved: (value: boolean) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(customer);
  const [status, setStatus] = useState('');
  const [, setLocation] = useLocation();
  const saveProfile = (e: FormEvent) => { e.preventDefault(); setCustomer(form); setStatus('Profile saved on this device.'); setEditing(false); };
  const clear = () => { setCustomer(emptyCustomer); setAddress(emptyAddress); setSaved(false); setForm(emptyCustomer); setStatus('Saved profile and address cleared from this browser. Your cart was kept.'); };
  const logout = () => { clear(); setLocation('/login'); };
  return <div className="shell account-page page-enter"><PageTitle kicker="YOUR PLACE AT THE TABLE" title="A familiar face." description="Your local guest details and saved delivery address."/>
    <div className="notice demo-disclosure" data-testid="status-account-demo"><strong>Local guest profile · not secure authentication</strong><p>Your profile and address stay in this browser on this device. They are not sent to a server.</p></div>
    <div className="account-grid"><section className="account-card"><div className="card-heading"><div className="account-avatar"><CircleUserRound size={23}/></div><div><span className="eyebrow">GUEST PROFILE</span><h2 className="font-display">{customer.name || 'A seat is saved for you'}</h2></div></div>{editing || !customer.name ? <form onSubmit={saveProfile} className="account-form"><label>Name<input className={fieldClass} required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Your name" data-testid="input-account-name"/></label><label>Phone<input className={fieldClass} required type="tel" pattern="[+0-9 ()-]{7,}" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="Phone number" data-testid="input-account-phone"/></label><button className={primaryClass} type="submit" data-testid="button-account-save">Save profile <Check size={16}/></button></form> : <><p className="account-detail">{customer.phone}</p><button className={secondaryClass} onClick={()=>{setForm(customer);setEditing(true);}} data-testid="button-edit-profile">Edit profile</button></>}</section>
      <section className="account-card"><div className="card-heading"><div className="account-avatar warm"><MapPin size={22}/></div><div><span className="eyebrow">SAVED ADDRESS</span><h2 className="font-display">{saved && address.line1 ? address.recipient || 'Delivery address' : 'No address saved'}</h2></div></div>{saved && address.line1 ? <><p className="account-address">{address.line1}{address.line2 ? `, ${address.line2}` : ''}{address.landmark ? ` · Near ${address.landmark}` : ''}<br/>{address.city} {address.postalCode}</p><Link href="/location" className={secondaryClass} data-testid="link-edit-saved-address">Edit address</Link></> : <><p className="account-detail">Add a delivery address to make checkout easier.</p><Link href="/location" className={primaryClass} data-testid="link-add-saved-address">Add address <ArrowRight size={16}/></Link></>}</section></div>
    <div className="account-extra-grid">
      <section className="account-card" data-testid="section-order-history"><span className="eyebrow">ORDER HISTORY</span><h2 className="font-display">Your previous orders</h2><p className="account-detail">Your previous orders will appear here.</p></section>
      <section className="account-card" data-testid="section-account-help"><span className="eyebrow">HELP &amp; SUPPORT</span><h2 className="font-display">Need a hand?</h2><p className="account-detail">Support contact details have not been provided. The restaurant’s verified WhatsApp number can be added in the ordering setup.</p></section>
      <section className="account-card" data-testid="section-about-restaurant"><span className="eyebrow">ABOUT</span><h2 className="font-display">Coastal Swada</h2><p className="account-detail">A Karavali-inspired food ordering experience. Restaurant details and menu items are editable demo content until confirmed.</p></section>
    </div>
    {status && <p role="status" className="form-message" data-testid="status-account-message">{status}</p>}
    <div className="account-actions"><button className="secondary-button" onClick={clear} data-testid="button-clear-profile">Clear saved profile &amp; address</button><button className="clear-data" onClick={logout} data-testid="button-logout"><LogOut size={15}/> Log out</button></div>
  </div>;
}
function NotFound() { return <div className="shell not-found"><span>404 / NOTHING HERE</span><h1 className="font-display">We lost this tide.</h1><p>That page isn’t part of this little table.</p><Link href="/" className={primaryClass} data-testid="link-not-found-home">Back to the menu <ArrowRight size={16}/></Link></div>; }

export default App;
