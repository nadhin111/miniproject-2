import { useState } from 'react';
import './Cart.css';

// Cart Component
// Props: cartItems, onRemove, onUpdateQuantity, onClearCart, onBack, onNavigate
function Cart({ cartItems, onRemove, onUpdateQuantity, onClearCart, onBack, onNavigate }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [removingId, setRemovingId]             = useState(null);

  const subtotal   = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const delivery   = subtotal > 500 ? 0 : 49;
  const total      = subtotal + delivery;

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => { onRemove(id); setRemovingId(null); }, 300);
  };

  // ── Empty Cart ──
  if (cartItems.length === 0) {
    return (
      <div className="cart-page" id="cart-page">
        <div className="cart-empty">
          <span className="empty-icon">🛒</span>
          <h2>Your ShopNova Cart is Empty</h2>
          <p>Add items you like to your cart. Review them before you buy.</p>
          <button className="continue-btn" id="continue-shopping-btn" onClick={onBack}>
            🛍️ Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" id="cart-page">

      {/* ── Clear Cart Confirmation Modal ── */}
      {showClearConfirm && (
        <div className="cart-modal-overlay" id="clear-cart-modal">
          <div className="cart-modal">
            <div className="cart-modal-icon">🗑️</div>
            <h3>Clear Entire Cart?</h3>
            <p>This will remove all <strong>{totalItems} items</strong> from your cart.</p>
            <div className="cart-modal-actions">
              <button
                className="cm-btn cm-keep"
                id="keep-cart-btn"
                onClick={() => setShowClearConfirm(false)}
              >
                Keep Items
              </button>
              <button
                className="cm-btn cm-clear"
                id="confirm-clear-btn"
                onClick={() => { onClearCart(); setShowClearConfirm(false); }}
              >
                Yes, Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header Row ── */}
      <div className="cart-top-bar">
        <div>
          <h1>🛒 Shopping Cart</h1>
          <p className="cart-subtitle">{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>
        </div>
        <div className="cart-top-actions">
          <button className="back-btn" id="cart-back-btn" onClick={onBack}>
            ← Continue Shopping
          </button>
          <button
            className="clear-cart-btn"
            id="clear-cart-btn"
            onClick={() => setShowClearConfirm(true)}
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>

      <div className="cart-layout">

        {/* ── ITEMS LIST ── */}
        <div className="cart-items" id="cart-items-list">

          {cartItems.map((item) => (
            <div
              className={`cart-item ${removingId === item.id ? 'removing' : ''}`}
              key={item.id}
              id={`cart-item-${item.id}`}
            >
              {/* Image */}
              <img className="cart-item-img" src={item.image} alt={item.title} />

              {/* Info */}
              <div className="cart-item-info">
                <p className="cart-item-title">{item.title}</p>
                <p className="cart-item-brand">{item.brand}</p>
                <p className="cart-item-stock">✅ In Stock</p>
                {item.prime && <p className="cart-item-prime">⚡ Nova Prime Eligible</p>}

                {/* Actions */}
                <div className="cart-item-actions">
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      id={`qty-dec-${item.id}`}
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      id={`qty-inc-${item.id}`}
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                  </div>

                  <div className="cart-item-btns">
                    <button
                      className="cart-action-link"
                      id={`save-later-${item.id}`}
                    >
                      💾 Save for Later
                    </button>
                    <span className="divider-dot">|</span>
                    <button
                      className="cart-action-link delete"
                      id={`delete-btn-${item.id}`}
                      onClick={() => handleRemove(item.id)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="cart-item-price">
                <div className="cip-main">₹{(item.price * item.quantity).toLocaleString()}</div>
                {item.quantity > 1 && (
                  <div className="cip-unit">₹{item.price.toLocaleString()} each</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── ORDER SUMMARY ── */}
        <div className="cart-summary" id="cart-summary">
          <p className="summary-title">
            ✅ Your order is eligible for FREE Delivery
          </p>

          <div className="summary-row">
            <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}):</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery:</span>
            <span className={delivery === 0 ? 'free-tag' : ''}>{delivery === 0 ? 'FREE 🎉' : `₹${delivery}`}</span>
          </div>
          {delivery > 0 && (
            <div className="free-ship-hint">
              Add ₹{(500 - subtotal).toLocaleString()} more for FREE delivery
            </div>
          )}
          <div className="summary-row total">
            <span>Order Total:</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <button
            className="checkout-btn"
            id="checkout-btn"
            onClick={() => onNavigate('checkout')}
          >
            Proceed to Checkout →
          </button>

          <button
            className="clear-cart-btn-summary"
            id="clear-cart-summary-btn"
            onClick={() => setShowClearConfirm(true)}
          >
            🗑️ Clear Cart
          </button>

          <p className="summary-secure">🔒 Safe and Secure Payments</p>
        </div>
      </div>
    </div>
  );
}

export default Cart;
