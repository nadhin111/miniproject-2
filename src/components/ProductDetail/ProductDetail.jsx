import { useState } from 'react';
import './ProductDetail.css';

// Helper: Star Rating
function StarRating({ rating, size = 16 }) {
  return (
    <div className="stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

// ProductDetail Component
// Props: product, onAddToCart, onBack, onToggleWishlist, wishlist
function ProductDetail({ product, onAddToCart, onBack, onToggleWishlist, wishlist }) {
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const savings = product.originalPrice - product.price;
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="product-detail" id="product-detail-page">
      {/* ← Back Button */}
      <button className="back-btn" id="back-to-home-btn" onClick={onBack}>
        ← Back to results
      </button>

      <div className="detail-layout">
        {/* ── IMAGE COLUMN ── */}
        <div className="detail-img-col">
          <img
            className="detail-img-main"
            src={product.image}
            alt={product.title}
            id="detail-main-img"
          />
        </div>

        {/* ── INFO COLUMN ── */}
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title" id="detail-product-title">{product.title}</h1>

          {product.badge && (
            <span className="detail-badge">{product.badge}</span>
          )}

          {/* Stars */}
          <div className="detail-stars">
            <StarRating rating={product.rating} size={18} />
            <span className="detail-rating-num">{product.rating}</span>
            <span className="detail-reviews">{product.reviews.toLocaleString()} ratings</span>
          </div>

          <hr className="detail-divider" />

          {/* Price */}
          <div className="detail-price-wrap">
            <span className="detail-price-main">₹{product.price.toLocaleString()}</span>
            <span className="detail-price-original">₹{product.originalPrice.toLocaleString()}</span>
            <span className="detail-discount">({discount}% off)</span>
          </div>
          <p className="detail-savings">You save: ₹{savings.toLocaleString()}</p>

          {/* Prime */}
          {product.prime && (
            <div className="detail-prime">
              <span className="prime-badge">prime</span>
              FREE Delivery by Tomorrow
            </div>
          )}

          <hr className="detail-divider" />

          {/* Description */}
          <p className="detail-description">{product.description}</p>
        </div>

        {/* ── BUY BOX ── */}
        <div className="detail-buy-box" id="buy-box">
          <div className="buy-box-price">₹{product.price.toLocaleString()}</div>

          <div className="buy-box-delivery">
            <strong>FREE Delivery</strong> by <strong>Tomorrow</strong><br />
            Eligible for Prime delivery
          </div>

          <p className={`buy-box-stock ${product.inStock ? 'in-stock' : 'out-stock'}`}>
            {product.inStock ? 'In Stock' : 'Currently Unavailable'}
          </p>

          {/* Quantity */}
          {product.inStock && (
            <div className="qty-row">
              <span className="qty-label">Qty:</span>
              <select
                className="qty-select"
                id="qty-selector"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          {/* Buttons */}
          {product.inStock && (
            <>
              <button
                className="buy-box-btn btn-cart"
                id="detail-add-cart-btn"
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>
              <button
                className="buy-box-btn btn-buy"
                id="detail-buy-now-btn"
                onClick={handleAddToCart}
              >
                ⚡ Buy Now
              </button>
            </>
          )}

          <button
            className="buy-box-wishlist"
            id="detail-wishlist-btn"
            onClick={() => onToggleWishlist(product.id)}
          >
            {isWishlisted ? '❤️ Saved to Wishlist' : '🤍 Add to Wish List'}
          </button>

          <p className="buy-box-secure">🔒 Secure transaction</p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="cart-toast" id="cart-added-toast">
          ✓ Added to Cart!
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
