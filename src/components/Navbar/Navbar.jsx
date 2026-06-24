import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

// ── Bottom nav links config ──
const NAV_LINKS = [
  { id: 'home',       icon: '🏠', label: 'Home' },
  { id: 'deals',      icon: '🔥', label: "Today's Deals", hot: true },
  { id: 'electronics',icon: '📱', label: 'Electronics' },
  { id: 'fashion',    icon: '👗', label: 'Fashion' },
  { id: 'home-kitchen', icon: '🏡', label: 'Home & Kitchen' },
  { id: 'cart',       icon: '🛒', label: 'Cart' },
  { id: 'wishlist',   icon: '❤️', label: 'Wishlist' },
  { id: 'orders',     icon: '📦', label: 'My Orders' },
  { id: 'account',    icon: '👤', label: 'Account' },
];

// ── Navbar Component ──
// Props: cartCount, searchQuery, onSearch, onNavigate, currentPage, user, onLogout
function Navbar({ cartCount, searchQuery, onSearch, onNavigate, currentPage, user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNavLink = (linkId) => {
    // Map link ids to pages / categories
    const pageMap = {
      home:          () => onNavigate('home'),
      deals:         () => onNavigate('home'),
      electronics:   () => onNavigate('home'),
      fashion:       () => onNavigate('home'),
      'home-kitchen':() => onNavigate('home'),
      cart:          () => onNavigate('cart'),
      wishlist:      () => onNavigate('wishlist'),
      orders:        () => onNavigate('orders'),
      account:       () => onNavigate('account'),
    };
    pageMap[linkId]?.();
  };

  return (
    <header className="navbar" id="main-navbar">

      {/* ════ TOP BAR ════ */}
      <div className="navbar-top">

        {/* Logo */}
        <div
          className="navbar-logo"
          id="navbar-logo"
          onClick={() => onNavigate('home')}
          role="button"
          tabIndex={0}
        >
          <div className="logo-icon-box">🛍️</div>
          <span className="logo-wordmark">Shop<span>Nova</span></span>
        </div>

        {/* Search */}
        <div className="navbar-search" id="navbar-search">
          <select className="search-cat-select" id="search-cat-select" defaultValue="All">
            <option>All</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home &amp; Kitchen</option>
            <option>Books</option>
            <option>Sports</option>
            <option>Beauty</option>
          </select>

          <input
            id="search-input"
            className="search-input"
            type="text"
            placeholder="🔍  Search ShopNova…"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />

          <button
            className="search-submit-btn"
            id="search-submit-btn"
            aria-label="Search"
            onClick={() => onNavigate('home')}
          >
            🔍
          </button>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">

          {/* Wishlist */}
          <button
            className="nav-icon-btn"
            id="nav-wishlist-btn"
            onClick={() => onNavigate('wishlist')}
          >
            <span className="icon">❤️</span>
            <span className="label">Wishlist</span>
          </button>

          {/* Orders */}
          <button
            className="nav-icon-btn"
            id="nav-orders-btn"
            onClick={() => onNavigate('orders')}
          >
            <span className="icon">📦</span>
            <span className="label">Orders</span>
          </button>

          {/* Cart */}
          <button
            className="nav-icon-btn"
            id="nav-cart-btn"
            onClick={() => onNavigate('cart')}
          >
            <span className="icon">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge" id="cart-badge">{cartCount}</span>
            )}
            <span className="label">Cart</span>
          </button>

          {/* User: Logged In → Avatar + Dropdown | Logged Out → Login btn */}
          {user ? (
            <div className="user-menu-wrap" ref={dropdownRef}>
              <button
                className="user-menu-btn"
                id="user-menu-btn"
                onClick={() => setShowDropdown(s => !s)}
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
                <span>{showDropdown ? '▲' : '▼'}</span>
              </button>

              {showDropdown && (
                <div className="user-dropdown" id="user-dropdown">
                  <div className="dropdown-header">
                    <div className="d-name">👋 {user.name}</div>
                    <div className="d-email">{user.email}</div>
                  </div>

                  <button className="dropdown-item" id="dd-account"
                    onClick={() => { onNavigate('account'); setShowDropdown(false); }}>
                    <span className="d-icon">👤</span> My Account
                  </button>
                  <button className="dropdown-item" id="dd-orders"
                    onClick={() => { onNavigate('orders'); setShowDropdown(false); }}>
                    <span className="d-icon">📦</span> My Orders
                  </button>
                  <button className="dropdown-item" id="dd-wishlist"
                    onClick={() => { onNavigate('wishlist'); setShowDropdown(false); }}>
                    <span className="d-icon">❤️</span> Wishlist
                  </button>
                  <button className="dropdown-item" id="dd-cart"
                    onClick={() => { onNavigate('cart'); setShowDropdown(false); }}>
                    <span className="d-icon">🛒</span> Cart
                  </button>

                  <div className="dropdown-divider" />

                  <button className="dropdown-item logout" id="dd-logout"
                    onClick={() => { onLogout(); setShowDropdown(false); }}>
                    <span className="d-icon">🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="login-nav-btn"
              id="nav-login-btn"
              onClick={() => onNavigate('login')}
            >
              <span>👤</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* ════ BOTTOM NAV BAR ════ */}
      <nav className="navbar-bottom" id="navbar-bottom" aria-label="Main Navigation">
        {NAV_LINKS.map(link => (
          <button
            key={link.id}
            id={`nav-link-${link.id}`}
            className={`nav-link-btn ${link.hot ? 'hot' : ''} ${currentPage === link.id ? 'active' : ''}`}
            onClick={() => handleNavLink(link.id)}
          >
            <span className="nl-icon">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>

    </header>
  );
}

export default Navbar;
