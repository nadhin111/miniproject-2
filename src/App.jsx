import { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import CategoryBar from './components/CategoryBar/CategoryBar';
import ProductGrid from './components/ProductGrid/ProductGrid';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Cart from './components/Cart/Cart';
import Footer from './components/Footer/Footer';
import Wishlist from './components/Wishlist/Wishlist';
import Orders from './components/Orders/Orders';
import Account from './components/Account/Account';
import Checkout from './components/Checkout/Checkout';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './components/Auth/Auth';
import { products, categories, mockOrders } from './data/products';

function App() {
  const [currentPage, setCurrentPage]     = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems]         = useState([]);
  const [searchQuery, setSearchQuery]     = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlist, setWishlist]           = useState([]);
  const [user, setUser]                   = useState(null);
  const [orders, setOrders]               = useState(mockOrders);

  /* ── Navigation ── */
  const navigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedProduct(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Auth ── */
  const handleLogin  = (u) => { setUser(u); navigate('home'); };
  const handleLogout = ()  => { setUser(null); navigate('home'); };

  /* ── Cart ── */
  const addToCart = (product) =>
    setCartItems(prev => {
      const ex = prev.find(i => i.id === product.id);
      return ex
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, quantity: 1 }];
    });
  const removeFromCart  = (id)       => setCartItems(prev => prev.filter(i => i.id !== id));
  const clearCart       = ()         => setCartItems([]);
  const updateQuantity  = (id, qty)  => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  /* ── Orders ── */
  const cancelOrder  = (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
  const reorder      = (order) => {
    order.items.forEach(item => {
      const product = products.find(p => p.title === item.title);
      if (product) addToCart(product);
      else addToCart({ id: `reorder-${item.title}`, title: item.title, price: item.price, image: item.image, quantity: 1 });
    });
    navigate('cart');
  };

  /* ── Wishlist ── */
  const toggleWishlist = (id) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  /* ── Product click handler ── */
  const handleProductClick = (product) => navigate('product', product);

  /* ── Filtered products ── */
  const filteredProducts = products.filter(p => {
    const matchCat    = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartCount  = cartItems.reduce((s, i) => s + i.quantity, 0);
  const isAuthPage = ['login', 'register', 'forgot'].includes(currentPage);

  return (
    <div className="app">

      {/* ── Navbar (hide on auth pages) ── */}
      {!isAuthPage && (
        <Navbar
          cartCount={cartCount}
          searchQuery={searchQuery}
          onSearch={(q) => { setSearchQuery(q); if (currentPage !== 'home') navigate('home'); }}
          onNavigate={navigate}
          currentPage={currentPage}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* ══════════ PAGES ══════════ */}

      {/* HOME */}
      {currentPage === 'home' && (
        <>
          <Hero onNavigate={navigate} />
          <CategoryBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ProductGrid
            products={filteredProducts}
            onProductClick={handleProductClick}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlist={wishlist}
            searchQuery={searchQuery}
          />
        </>
      )}

      {/* PRODUCT DETAIL */}
      {currentPage === 'product' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onAddToCart={addToCart}
          onBack={() => navigate('home')}
          onToggleWishlist={toggleWishlist}
          wishlist={wishlist}
        />
      )}

      {/* CART */}
      {currentPage === 'cart' && (
        <Cart
          cartItems={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClearCart={clearCart}
          onBack={() => navigate('home')}
          onNavigate={navigate}
        />
      )}

      {/* CHECKOUT */}
      {currentPage === 'checkout' && (
        <Checkout
          cartItems={cartItems}
          onNavigate={navigate}
        />
      )}

      {/* WISHLIST */}
      {currentPage === 'wishlist' && (
        <Wishlist
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onNavigate={navigate}
          onProductClick={handleProductClick}
        />
      )}

      {/* ORDERS */}
      {currentPage === 'orders' && (
        <Orders
          orders={orders}
          onCancelOrder={cancelOrder}
          onReorder={reorder}
          onNavigate={navigate}
        />
      )}

      {/* ACCOUNT */}
      {currentPage === 'account' && (
        <Account
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {/* AUTH PAGES */}
      {currentPage === 'login'    && <LoginPage    onNavigate={navigate} onLogin={handleLogin} />}
      {currentPage === 'register' && <RegisterPage onNavigate={navigate} onLogin={handleLogin} />}
      {currentPage === 'forgot'   && <ForgotPasswordPage onNavigate={navigate} />}

      {/* ── Footer (hide on auth pages) ── */}
      {!isAuthPage && <Footer onNavigate={navigate} />}
    </div>
  );
}

export default App;
