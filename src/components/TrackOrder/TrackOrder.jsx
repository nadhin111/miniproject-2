import { useState } from 'react';
import './TrackOrder.css';

// ── Tracking steps config per status ──
const ALL_STEPS = [
  { key: 'ordered',   icon: '🛍️', title: 'Order Placed',        desc: 'Your order has been confirmed' },
  { key: 'packed',    icon: '📦', title: 'Order Packed',         desc: 'Your items are being packed' },
  { key: 'shipped',   icon: '🚚', title: 'Shipped',              desc: 'Order is on its way to hub' },
  { key: 'outfordelivery', icon: '🏍️', title: 'Out for Delivery', desc: 'Delivery partner is on the way' },
  { key: 'delivered', icon: '✅', title: 'Delivered',            desc: 'Package delivered successfully' },
];

const STATUS_DONE_COUNT = {
  'Processing': 1,
  'In Transit': 3,
  'Delivered':  5,
  'Cancelled':  0,
};

const STATUS_BADGE_CLASS = {
  'Processing': 'tbadge-processing',
  'In Transit': 'tbadge-transit',
  'Delivered':  'tbadge-delivered',
  'Cancelled':  'tbadge-cancelled',
};

const STATUS_ICON = {
  'Processing': '⏳', 'In Transit': '🚚',
  'Delivered': '✅', 'Cancelled': '❌',
};

// ETA based on status
const ETA_MAP = {
  'Processing':  'Expected delivery in 4–6 days',
  'In Transit':  'Expected delivery in 1–2 days',
  'Delivered':   'Delivered successfully',
  'Cancelled':   'Order was cancelled',
};

// ════════════════════════════════════
//  TRACK ORDER COMPONENT
//  Props: order, onBack, onNavigate, onCancelOrder
// ════════════════════════════════════
function TrackOrder({ order, onBack, onNavigate, onCancelOrder }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!order) {
    return (
      <div className="track-page" id="track-page">
        <div className="track-not-found">
          <span className="nf-icon">📭</span>
          <h2>Order Not Found</h2>
          <p>We couldn't find the tracking details for this order.</p>
          <button onClick={onBack}>← Back to Orders</button>
        </div>
      </div>
    );
  }

  const doneCount  = STATUS_DONE_COUNT[order.status] ?? 0;
  const isCancelled = order.status === 'Cancelled';
  const isDelivered = order.status === 'Delivered';
  const canCancel   = !isCancelled && !isDelivered;
  const orderDate   = new Date(order.date);
  const etaDate     = new Date(orderDate);
  etaDate.setDate(etaDate.getDate() + (order.status === 'In Transit' ? 2 : 5));

  return (
    <div className="track-page" id="track-page">

      {/* Cancel Confirm Modal */}
      {showCancelConfirm && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <div className="cart-modal-icon">⚠️</div>
            <h3>Cancel Order?</h3>
            <p>Cancel <strong>#{order.id}</strong>? This cannot be undone.</p>
            <div className="cart-modal-actions" style={{ marginTop: 0 }}>
              <button className="cm-btn cm-keep" onClick={() => setShowCancelConfirm(false)}>Keep It</button>
              <button className="cm-btn cm-clear" onClick={() => { onCancelOrder(order.id); setShowCancelConfirm(false); onBack(); }}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back bar */}
      <div className="track-back-bar">
        <button className="track-back-btn" id="track-back-btn" onClick={onBack}>
          ← Back to Orders
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Last updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* ── HERO CARD ── */}
      <div className="track-hero">
        <div className="th-left">
          <div className="th-tag">📦 Tracking Details</div>
          <div className="th-order-id">#{order.id}</div>
          <div className="th-date">
            Placed on {orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div className="th-right">
          <div className={`th-status-badge ${STATUS_BADGE_CLASS[order.status]}`}>
            {STATUS_ICON[order.status]} {order.status}
          </div>
          <div className="th-eta">
            {isCancelled
              ? '❌ Order Cancelled'
              : <>📅 <strong>{ETA_MAP[order.status]}</strong></>
            }
          </div>
          <div className="th-total" style={{ color: '#FFD700', fontWeight: 800, fontSize: 18, marginTop: 8 }}>
            ₹{order.total.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      {!isCancelled ? (
        <div className="track-steps-card">
          <h2>📍 Order Journey</h2>
          <div className="track-timeline">
            {ALL_STEPS.map((step, i) => {
              const isDone   = i < doneCount;
              const isActive = i === doneCount - 1;
              const isPending= i >= doneCount;
              return (
                <div
                  key={step.key}
                  className={`tl-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isPending && !isDone ? 'pending' : ''}`}
                  id={`tl-step-${step.key}`}
                >
                  <div className="tl-icon-wrap">
                    {isDone ? '✓' : step.icon}
                  </div>
                  <div className="tl-content">
                    <div className="tl-title">
                      {step.title}
                      {isActive && <span className="tl-active-pill">● CURRENT</span>}
                    </div>
                    <div className="tl-desc">{step.desc}</div>
                    {isDone && (
                      <div className="tl-time">
                        {new Date(orderDate.getTime() + i * 18 * 3600 * 1000)
                          .toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    {isPending && !isDone && (
                      <div className="tl-time" style={{ color: '#ccc' }}>Upcoming</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="track-steps-card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: 60, marginBottom: 14 }}>❌</div>
          <h2 style={{ color: '#EF4444', marginBottom: 8 }}>Order Cancelled</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            This order was cancelled. Your refund will be processed within 5–7 business days.
          </p>
        </div>
      )}

      {/* ── SIMULATED MAP ── */}
      {!isCancelled && (
        <div className="track-map-card">
          <div className="track-map-head">
            <h2>🗺️ Live Tracking Map</h2>
            {order.status !== 'Delivered' && (
              <div className="live-pill">
                <div className="live-dot" />
                LIVE
              </div>
            )}
          </div>

          {/* Visual Map */}
          <div className="track-map-visual">
            <div className="map-grid" />
            {/* Roads */}
            <div className="map-road-h" style={{ top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' }} />
            <div className="map-road-h" style={{ top: '25%', left: 0, right: 0, transform: 'translateY(-50%)', opacity: 0.4 }} />
            <div className="map-road-h" style={{ top: '75%', left: 0, right: 0, transform: 'translateY(-50%)', opacity: 0.4 }} />
            <div className="map-road-v" style={{ left: '20%', top: 0, bottom: 0, transform: 'translateX(-50%)', opacity: 0.4 }} />
            <div className="map-road-v" style={{ left: '50%', top: 0, bottom: 0, transform: 'translateX(-50%)', opacity: 0.4 }} />
            <div className="map-road-v" style={{ left: '80%', top: 0, bottom: 0, transform: 'translateX(-50%)', opacity: 0.4 }} />
            {/* Route line */}
            <div className="map-route" style={{ top: 'calc(50% - 2px)', left: '15%', right: '15%' }} />
            {/* Pins */}
            <div className="map-pin" style={{ left: '13%', top: '32%' }}>
              <div className="map-pin-icon">🏭</div>
              <div className="map-pin-label">Warehouse</div>
            </div>
            <div className="map-pin" style={{ right: '10%', top: '28%' }}>
              <div className="map-pin-icon">🏠</div>
              <div className="map-pin-label">Your Home</div>
            </div>
            {/* Moving truck */}
            {order.status === 'In Transit' && (
              <div className="map-truck" style={{ top: 'calc(50% - 22px)' }}>🚚</div>
            )}
            {order.status === 'Processing' && (
              <div className="map-truck" style={{ top: 'calc(50% - 22px)', left: '15%' }}>📦</div>
            )}
            {order.status === 'Delivered' && (
              <div className="map-truck" style={{ top: 'calc(50% - 22px)', right: '10%', animation: 'none' }}>✅</div>
            )}
          </div>

          {/* Route strip */}
          <div className="route-strip">
            <div className="rs-point">
              <span className="rs-label">From</span>
              <span className="rs-city">🏭 ShopNova Hub, Mumbai</span>
            </div>
            <span className="rs-arrow">→</span>
            <div className="rs-stat">
              <div className="rs-stat-num">
                {order.status === 'Delivered' ? '0' : order.status === 'In Transit' ? '84' : '320'}
              </div>
              <div className="rs-stat-unit">km remaining</div>
            </div>
            <span className="rs-arrow">→</span>
            <div className="rs-point" style={{ textAlign: 'right' }}>
              <span className="rs-label">To</span>
              <span className="rs-city">🏠 Your Address, Bengaluru</span>
            </div>
          </div>
        </div>
      )}

      {/* ── ORDERED ITEMS ── */}
      <div className="track-items-card">
        <div className="track-items-head">🛍️ Items in this Order</div>
        {order.items.map((item, i) => (
          <div className="track-item-row" key={i}>
            <img src={item.image} alt={item.title} className="tri-img" />
            <div className="tri-info">
              <div className="tri-name">{item.title}</div>
              <div className="tri-qty">Qty: {item.qty || 1}</div>
            </div>
            <div className="tri-price">₹{item.price.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* ── DELIVERY & PAYMENT INFO ── */}
      <div className="track-info-grid">
        <div className="track-info-card">
          <div className="tic-head">📍 Delivery Address</div>
          <div className="tic-row"><span className="tic-label">Name</span><span className="tic-value">Customer</span></div>
          <div className="tic-row"><span className="tic-label">City</span><span className="tic-value">Bengaluru</span></div>
          <div className="tic-row"><span className="tic-label">State</span><span className="tic-value">Karnataka</span></div>
          <div className="tic-row"><span className="tic-label">Pincode</span><span className="tic-value">560001</span></div>
        </div>
        <div className="track-info-card">
          <div className="tic-head">💳 Payment Summary</div>
          <div className="tic-row"><span className="tic-label">Subtotal</span><span className="tic-value">₹{order.total.toLocaleString()}</span></div>
          <div className="tic-row"><span className="tic-label">Delivery</span><span className="tic-value green">FREE</span></div>
          <div className="tic-row"><span className="tic-label">Tax</span><span className="tic-value">Included</span></div>
          <div className="tic-row"><span className="tic-label">Total Paid</span><span className="tic-value purple">₹{order.total.toLocaleString()}</span></div>
        </div>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="track-actions">
        <button className="track-action-btn tab-primary" id="track-invoice-btn"
          onClick={() => onNavigate('invoice', order)}>
          🧾 View Invoice
        </button>
        <button className="track-action-btn tab-outline" id="track-help-btn">
          💬 Need Help?
        </button>
        {canCancel && (
          <button className="track-action-btn tab-danger" id="track-cancel-btn"
            onClick={() => setShowCancelConfirm(true)}>
            ✕ Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;
