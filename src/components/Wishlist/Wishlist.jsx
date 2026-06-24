import './Wishlist.css';
import { products } from '../../data/products';

// Wishlist Page
// Props: wishlist, onToggleWishlist, onAddToCart, onNavigate, onProductClick
function Wishlist({ wishlist, onToggleWishlist, onAddToCart, onNavigate, onProductClick }) {
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  const discountPct = (p, o) => Math.round(((o - p) / o) * 100);

  if (wishlistProducts.length === 0) {
    return (
      <div className="wishlist-page" id="wishlist-page">
        <div className="wishlist-empty">
          <span className="e-icon">💔</span>
          <h2>Your Wishlist is Empty</h2>
          <p>Save your favourite products here and shop them later.</p>
          <button
            className="shop-btn"
            id="wishlist-shop-btn"
            onClick={() => onNavigate('home')}
          >
            🛍️ Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page" id="wishlist-page">
      <div className="page-hero">
        <span className="page-hero-icon">❤️</span>
        <h1>My Wishlist</h1>
        <p>{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="wishlist-grid">
        {wishlistProducts.map(product => (
          <div key={product.id} className="wishlist-card" id={`wish-card-${product.id}`}>
            <div className="wishlist-img-wrap">
              <img
                className="wishlist-card-img"
                src={product.image}
                alt={product.title}
                onClick={() => onProductClick(product)}
              />
            </div>

            <div className="wishlist-card-body">
              <p
                className="wishlist-card-title"
                onClick={() => onProductClick(product)}
              >
                {product.title}
              </p>
              <div className="wishlist-price-row">
                <span className="w-price">₹{product.price.toLocaleString()}</span>
                <span className="w-orig">₹{product.originalPrice.toLocaleString()}</span>
                <span className="w-off">{discountPct(product.price, product.originalPrice)}% off</span>
              </div>
            </div>

            <div className="wishlist-card-actions">
              <button
                className="w-add-btn"
                id={`w-add-${product.id}`}
                onClick={() => onAddToCart(product)}
              >
                🛒 Add to Cart
              </button>
              <button
                className="w-remove-btn"
                id={`w-remove-${product.id}`}
                title="Remove from wishlist"
                onClick={() => onToggleWishlist(product.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
