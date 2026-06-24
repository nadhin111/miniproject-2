import { useState, useRef } from 'react';
import './ProductGrid.css';

// ── Star Rating ──
function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`star ${s <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

// ── Discount % ──
function discountPct(price, orig) {
  return Math.round(((orig - price) / orig) * 100);
}

// ── Badge style map ──
const BADGE_CLASS = {
  'Best Seller': 'badge-bestseller',
  'Deal':        'badge-deal',
  'New':         'badge-new',
  'Premium':     'badge-premium',
  'Top Rated':   'badge-toprated',
  'Sale':        'badge-sale',
  'Choice':      'badge-choice',
  'Limited':     'badge-deal',
};

// ══════════════════════════════════════════════
//  PRODUCT CARD
//  Props: product, onProductClick, onAddToCart,
//         onToggleWishlist, wishlist
// ══════════════════════════════════════════════
function ProductCard({ product, onProductClick, onAddToCart, onToggleWishlist, wishlist }) {
  const [added, setAdded] = useState(false);
  const isWishlisted = wishlist.includes(product.id);
  const pct = discountPct(product.price, product.originalPrice);

  const handleCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <article
      className="product-card fade-in"
      id={`product-card-${product.id}`}
      onClick={() => onProductClick(product)}
    >
      {/* Badge */}
      {product.badge && (
        <span className={`card-badge ${BADGE_CLASS[product.badge] || 'badge-new'}`}>
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        className="card-wishlist"
        id={`wish-btn-${product.id}`}
        onClick={handleWish}
        aria-label="Wishlist"
      >
        {isWishlisted ? '❤️' : '🤍'}
      </button>

      {/* Image */}
      <div className="card-img-wrap">
        <img
          className="card-img"
          src={product.image}
          alt={product.title}
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="card-body">
        <span className="card-brand">{product.brand}</span>
        <p className="card-title">{product.title}</p>

        <div className="card-stars">
          <StarRating rating={product.rating} />
          <span className="card-reviews">({product.reviews?.toLocaleString()})</span>
        </div>

        {product.prime && (
          <div className="card-prime">
            <span className="prime-tag">prime</span>
            FREE Delivery
          </div>
        )}

        <div className="card-price">
          <span className="price-curr">₹</span>
          <span className="price-main">{product.price?.toLocaleString()}</span>
          <span className="price-orig">₹{product.originalPrice?.toLocaleString()}</span>
          <span className="price-off">({pct}% off)</span>
        </div>

        {!product.inStock && (
          <span className="card-oos-tag">Out of Stock</span>
        )}
      </div>

      {/* Add to Cart */}
      {product.inStock ? (
        <button
          className={`card-add-btn ${added ? 'added' : ''}`}
          id={`add-btn-${product.id}`}
          onClick={handleCart}
        >
          {added ? '✓ Added!' : '🛒 Add to Cart'}
        </button>
      ) : (
        <div className="card-oos-btn">Unavailable</div>
      )}
    </article>
  );
}

// ══════════════════════════════════════════════
//  PRODUCT ROW (Horizontal side-by-side scroll)
//  Props: title, products, ...card props
// ══════════════════════════════════════════════
function ProductRow({ title, products, onProductClick, onAddToCart, onToggleWishlist, wishlist }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 700, behavior: 'smooth' });
    }
  };

  return (
    <div className="product-row-section">
      {/* Section Header */}
      <div className="products-header">
        <div className="products-header-left">
          <h2>{title}</h2>
          <p>{products.length} products — scroll to see all →</p>
        </div>
        <div className="products-header-right">
          <div className="scroll-controls">
            <button
              className="scroll-arrow"
              id={`scroll-left-${title.replace(/\s/g,'')}`}
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              className="scroll-arrow"
              id={`scroll-right-${title.replace(/\s/g,'')}`}
              onClick={() => scroll(1)}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal row — all images SIDE BY SIDE */}
      <div className="products-row" ref={rowRef} id={`row-${title.replace(/\s/g,'')}`}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            wishlist={wishlist}
          />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  PRODUCT GRID (Main export)
//  Props: products, onProductClick, onAddToCart,
//         onToggleWishlist, wishlist, searchQuery
// ══════════════════════════════════════════════
function ProductGrid({ products, onProductClick, onAddToCart, onToggleWishlist, wishlist, searchQuery }) {

  // Group products by category
  const categories = [...new Set(products.map(p => p.category))];

  // If searching — show flat list in a single row
  const isSearching = searchQuery && searchQuery.trim() !== '';

  return (
    <main className="products-page" id="products-section">
      <div className="products-inner">

        {products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h3>No products found</h3>
            <p>Try a different search term or browse a category</p>
          </div>
        ) : isSearching ? (
          // ── SEARCH RESULTS: single horizontal row ──
          <ProductRow
            title={`Results for "${searchQuery}"`}
            products={products}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            wishlist={wishlist}
          />
        ) : (
          // ── HOME: one row PER category (side-by-side) ──
          <>
            {/* Featured / All row first */}
            <ProductRow
              title="🔥 Featured Products"
              products={products}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlist={wishlist}
            />

            {/* Divider */}
            <div style={{ margin: '8px 0 4px' }} />

            {/* Per-category rows */}
            {categories.map(cat => {
              const catProducts = products.filter(p => p.category === cat);
              return (
                <ProductRow
                  key={cat}
                  title={`🏷️ ${cat}`}
                  products={catProducts}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  wishlist={wishlist}
                />
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}

export default ProductGrid;
