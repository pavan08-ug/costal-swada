import { useEffect, useMemo, useState, type FormEvent, type SyntheticEvent } from 'react';
import { Link, Route, Router, Switch, useLocation } from 'wouter';
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, CircleUserRound, Clock3, Eye, EyeOff, Home as HomeIcon, LogOut, MapPin, MessageCircle, Minus, Plus, Search, ShoppingBag, Trash2, Utensils, X } from 'lucide-react';
import { Address, calculateOrder, CartItem, Customer, money, products, restaurantConfig, categories, buildWhatsAppMessage, createOrderReference } from './lib/restaurant-data';

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
    image.src = '/hero-karavali.jpg';
  } else {
    image.style.visibility = 'hidden';
  }
}
function readStore<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStore(key, fallback));
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}
const fieldClass = 'w-full rounded-xl border border-[#e9e5dc] bg-[#fffdf8] px-4 py-3 text-[14px] text-[#202923] outline-none transition focus:border-[#174d43] focus:ring-2 focus:ring-[#174d43]/10';
const primaryClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#174d43] px-5 py-3 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#103c34] disabled:cursor-not-allowed disabled:opacity-45';
const secondaryClass = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#e9e5dc] bg-[#fffdf8] px-5 py-3 text-sm font-semibold text-[#174d43] transition hover:border-[#174d43]';

function App() {
  const [cart, setCart] = usePersisted<CartItem[]>('coastal-cart', []);
  const [customer, setCustomer] = usePersisted<Customer>('coastal-customer', emptyCustomer);
  const [address, setAddress] = usePersisted<Address>('coastal-address', emptyAddress);
  const [saved, setSaved] = usePersisted<boolean>('coastal-address-saved', false);
  const [cartNotice, setCartNotice] = useState('');
  const [path] = useLocation();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const summary = useMemo(() => calculateOrder(cart), [cart]);
  const changeQuantity = (id: string, delta: number) => {
    const product = products.find((entry) => entry.id === id);
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
      <div className="min-h-[100dvh] bg-[#fffdf8] text-[#202923]">
        <header className="sticky top-0 z-40 border-b border-[#e9e5dc]/80 bg-[#fffdf8]/95 backdrop-blur">
          <div className="shell flex h-[76px] items-center justify-between">
            <Link href="/" className="flex items-center gap-3 no-underline" data-testid="link-brand">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#174d43] text-[#fffdf8]"><Utensils size={19}/></span>
              <span className="leading-none"><strong className="font-display text-[20px] font-semibold tracking-[-.04em]">Coastal Swada</strong><small className="mt-1 block text-[9px] font-bold uppercase tracking-[.22em] text-[#777c76]">A Karavali table</small></span>
            </Link>
            <Link href="/location" className="header-location" data-testid="link-header-location">
              <MapPin size={16}/>
              <span><small>DELIVER TO</small><strong>{saved && address.city ? address.city : 'Add your location'}</strong></span>
              <ChevronDown size={13}/>
            </Link>
            <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
              <Link href="/" className={`nav-link ${path === '/' ? 'is-active' : ''}`} data-testid="link-menu">Menu</Link>
              <Link href="/location" className={`nav-link ${path === '/location' ? 'is-active' : ''}`} data-testid="link-location">Delivery area</Link>
              <Link href="/account" className={`nav-link ${path === '/account' ? 'is-active' : ''}`} data-testid="link-account">My profile</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login" className="grid h-10 w-10 place-items-center rounded-full text-[#174d43] transition hover:bg-[#f2f0e9]" aria-label="Guest profile" data-testid="link-login"><CircleUserRound size={20}/></Link>
              <Link href="/cart" className="relative inline-flex h-11 items-center gap-2 rounded-full bg-[#174d43] px-4 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#103c34]" data-testid="link-cart"><ShoppingBag size={17}/><span className="hidden sm:inline">Your bag</span>{count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[#fffdf8] bg-[#d56b45] px-1 text-[10px] font-bold text-white" data-testid="text-cart-count">{count}</span>}</Link>
            </div>
          </div>
        </header>
        <div className="demo-banner" data-testid="status-demo"><span className="demo-dot"/> Demo menu &amp; prices · editable sample content</div>
        <main className="page-enter">
          <Switch>
            <Route path="/" component={() => <Home cart={cart} changeQuantity={changeQuantity}/>}/>
            <Route path="/login" component={() => <Login customer={customer} setCustomer={setCustomer}/>}/>
            <Route path="/location" component={() => <Location address={address} setAddress={setAddress} saved={saved} setSaved={setSaved}/>}/>
            <Route path="/cart" component={() => <Cart cart={cart} setCart={setCart} summary={summary} customer={customer} address={address}/>}/>
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
        <footer className="mt-20 border-t border-[#e9e5dc] py-9">
          <div className="shell flex flex-col justify-between gap-4 text-xs text-[#777c76] sm:flex-row"><span>Coastal Swada · A Karavali table</span><span>Menu, prices &amp; delivery information shown are editable demo content.</span></div>
        </footer>
      </div>
    </Router>
  );
}

function Home({ cart, changeQuantity }: { cart: CartItem[]; changeQuantity: (id: string, delta: number) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [sortPopular, setSortPopular] = useState(false);
  const chosen = useMemo(() => products.filter((p) => (category === 'All' || p.category === category) && (!onlyVeg || p.vegetarian) && `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sortPopular ? b.popular-a.popular : 0), [category, onlyVeg, query, sortPopular]);
  return <div>
    <section className="hero shell">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line"/> COASTAL KARNATAKA, ON YOUR TABLE</div>
        <h1 className="font-display">A little taste<br/>of the <em>coast.</em></h1>
        <p>Slow-roasted masalas, soft neer dosa and the kind of comfort that travels home with you.</p>
        <a href="#menu" className={`${primaryClass} mt-7 no-underline`} data-testid="button-explore-menu">Explore the menu <ArrowDown size={16}/></a>
        <div className="hero-meta"><span><Clock3 size={15}/> Hours &amp; delivery details are demo</span><span className="meta-separator"/></div>
      </div>
      <div className="hero-image-wrap"><img src="/hero-karavali.jpg" className="hero-image" alt="A coastal Karnataka thali with red rice and curry" data-testid="img-hero-food"/><div className="image-caption"><span>THE KARAVALI TABLE</span><span>01 — 08</span></div><div className="hero-stamp">Made<br/>for<br/><i>sharing</i></div></div>
    </section>
    <section className="shell intro-strip"><p className="font-display">From the griddle to the ghee roast — discover a table inspired by the flavours of the western shore.</p><span>Menu is demo content <ArrowRight size={15}/></span></section>
    <section className="shell featured-section" aria-labelledby="featured-title">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> SAMPLE MENU</div><h2 className="font-display" id="featured-title">Karavali <em>favourites.</em></h2></div><span className="menu-count">Demo picks</span></div>
      <div className="featured-row">{products.filter((product) => product.popular >= 90).slice(0, 4).map((product) => <article className="featured-card" key={product.id} data-testid={`card-featured-${product.id}`}><img src={product.image} alt={product.name} loading="lazy" onError={handleFoodImageError}/><div><span>DEMO PICK</span><h3 className="font-display">{product.name}</h3><strong>{money(product.price)}</strong><button onClick={() => changeQuantity(product.id, 1)} disabled={!product.available} data-testid={`button-featured-add-${product.id}`}>{product.available ? <>Add <Plus size={14}/></> : 'Unavailable'}</button></div></article>)}</div>
    </section>
    <section id="menu" className="shell menu-section">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> MADE FOR A LONG LUNCH</div><h2 className="font-display">Find your <em>favourite.</em></h2></div><span className="menu-count">{chosen.length} dishes</span></div>
      <div className="toolbar">
        <label className="searchbox"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the menu" aria-label="Search menu" data-testid="input-menu-search"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search" data-testid="button-clear-search"><X size={15}/></button>}</label>
        <div className="filters"><div className="category-scroll">{categories.map((name) => <button key={name} onClick={() => setCategory(name)} className={`filter-chip ${category === name ? 'selected' : ''}`} data-testid={`filter-category-${name.toLowerCase().replaceAll(' ', '-')}`}>{name}</button>)}</div>
        <label className="switch-label"><input type="checkbox" checked={onlyVeg} onChange={(e) => setOnlyVeg(e.target.checked)} data-testid="toggle-vegetarian"/><span className="veg-box"/>Veg only</label>
        <button className={`sort-button ${sortPopular ? 'sorted' : ''}`} onClick={() => setSortPopular((v) => !v)} data-testid="button-sort-popular">Featured <ChevronDown size={14}/></button></div>
      </div>
      {chosen.length ? <div className="product-grid">{chosen.map((product) => {
        const quantity = cart.find((item) => item.productId === product.id)?.quantity ?? 0;
        return <article className={`product-card ${!product.available ? 'unavailable' : ''}`} key={product.id} data-testid={`card-product-${product.id}`}>
          <div className="product-image-wrap"><img src={product.image} alt={product.name} className="product-image" loading="lazy" data-testid={`img-product-${product.id}`} onError={handleFoodImageError}/>{product.popular >= 90 && <span className="popular-tag">Demo pick</span>}{!product.available && <div className="sold-out"><span>Not available today</span></div>}</div>
          <div className="product-info"><div className="product-title-row"><h3 className="font-display">{product.name}</h3><strong>{money(product.price)}</strong></div><p>{product.description}</p><div className="product-bottom"><span className="food-mark"><i className={product.vegetarian ? 'veg-mark' : 'nonveg-mark'}/>{product.vegetarian ? 'Vegetarian' : 'Coastal'}<span className="spice">{'•'.repeat(product.spice)}</span></span>{product.available ? quantity ? <div className="quantity-control"><button onClick={() => changeQuantity(product.id,-1)} aria-label={`Remove one ${product.name}`} data-testid={`button-decrease-${product.id}`}><Minus size={14}/></button><span data-testid={`text-quantity-${product.id}`}>{quantity}</span><button onClick={() => changeQuantity(product.id,1)} aria-label={`Add one ${product.name}`} data-testid={`button-increase-${product.id}`}><Plus size={14}/></button></div> : <button className="add-button" onClick={() => changeQuantity(product.id,1)} data-testid={`button-add-${product.id}`}>Add <Plus size={15}/></button> : <span className="unavailable-label">Unavailable</span>}</div></div>
        </article>;
      })}</div> : <div className="empty-search"><Search size={24}/><h3 className="font-display">Nothing on this plate.</h3><p>Try a different search or browse all dishes.</p><button className={secondaryClass} onClick={() => { setQuery(''); setCategory('All'); setOnlyVeg(false); }} data-testid="button-reset-menu">Reset menu</button></div>}
    </section>
    <section className="recommend-strip"><div className="shell recommend-inner"><div><div className="eyebrow light"><span className="eyebrow-line"/> A LITTLE SOMETHING EXTRA</div><h2 className="font-display">Good things<br/>go <em>together.</em></h2><p>A cool kokum pour beside a spicy roast. That’s the pairing.</p></div><div className="recommend-item"><img src="/chicken-ghee-roast.jpg" alt="Chicken ghee roast" loading="lazy"/><span>TRY IT WITH</span><strong className="font-display">Chicken Ghee Roast</strong><button className="recommend-link" onClick={() => changeQuantity('chicken-ghee-roast',1)} data-testid="button-add-recommended">Add to your bag <Plus size={15}/></button></div></div></section>
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

function Cart({ cart, setCart, summary, customer, address }: { cart: CartItem[]; setCart: (value: CartItem[]) => void; summary: ReturnType<typeof calculateOrder>; customer: Customer; address: Address }) {
  const [message, setMessage] = useState('');
  const configuredPhone = restaurantConfig.whatsappPhone.replace(/\D/g,'');
  const validPhone = configuredPhone.length >= 10 && configuredPhone.length <= 15;
  const addressReady = Boolean(address.recipient && address.line1 && address.city && address.postalCode);
  const customerReady = Boolean(customer.name && isValidIndianMobile(customer.phone));
  const recommendations = products.filter((product) => product.available && !cart.some((item) => item.productId === product.id)).slice(0, 3);
  const order = () => {
    if (!cart.length) { setMessage('Add at least one available menu item before continuing.'); return; }
    if (!addressReady) { setMessage('Add a delivery address before preparing your order request.'); return; }
    if (!customerReady) { setMessage('Add your name and a valid Indian mobile number to your guest profile first.'); return; }
    if (!validPhone) { setMessage('WhatsApp ordering is not configured yet. Please contact the restaurant directly.'); return; }
    const reference = createOrderReference();
    const url = `https://wa.me/${configuredPhone}?text=${encodeURIComponent(buildWhatsAppMessage(summary, customer, address, reference))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setMessage('Your order request was prepared in WhatsApp. The restaurant must confirm it; this is not a completed order.');
  };
  return <div className="shell cart-page page-enter">
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
        <aside className="summary-card">
          <h2 className="font-display">Bill summary</h2>
          <div className="summary-line"><span>Item total</span><strong data-testid="text-subtotal">{money(summary.subtotal)}</strong></div>
          <div className="summary-line"><span>Delivery fee <small>demo value</small></span><strong>{money(summary.deliveryFee)}</strong></div>
          <div className="summary-line"><span>Packaging <small>per item · demo value</small></span><strong>{money(summary.packagingFee)}</strong></div>
          <div className="summary-line"><span>Discount</span><strong>{money(summary.discount)}</strong></div>
          <div className="summary-line total"><span>Grand total</span><strong data-testid="text-grand-total">{money(summary.grandTotal)}</strong></div>
          <p className="summary-note">Fees are demo values for illustration only. No payment is collected here.</p>
          <div className="checkout-details">
            <h3>Deliver to</h3>
            {addressReady ? <p><MapPin size={15}/>{address.recipient}, {address.line1}{address.line2 ? `, ${address.line2}` : ''}{address.landmark ? ` · Near ${address.landmark}` : ''}, {address.city} {address.postalCode}</p> : <Link href="/location" className="checkout-link" data-testid="link-add-address">Add a delivery address <ArrowRight size={14}/></Link>}
            <Link href="/location" className="edit-link" data-testid="link-edit-address">{addressReady ? 'Change address' : 'Manage address'}</Link>
            <h3>Your details</h3>
            {customerReady ? <p><CircleUserRound size={15}/>{customer.name} · {customer.phone}</p> : <Link href="/login" className="checkout-link" data-testid="link-add-profile">Add your name and valid mobile <ArrowRight size={14}/></Link>}
          </div>
          {!validPhone && <div className="owner-notice" data-testid="status-whatsapp-unconfigured"><strong>Restaurant setup needed</strong><p>The WhatsApp number is blank. Add the restaurant’s verified international number in the replaceable config before enabling order requests.</p></div>}
          {message && <p className="form-message" role="status" data-testid="status-order-message">{message}</p>}
          <button className={`${primaryClass} checkout-button`} onClick={order} disabled={!cart.length} data-testid="button-whatsapp-order">Request order on WhatsApp <MessageCircle size={16}/></button>
          <p className="request-disclaimer">WhatsApp opens a draft. You must send it; the restaurant must confirm it. No order is assumed placed and the cart stays saved.</p>
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
