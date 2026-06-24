import { useState } from 'react';
import './Orders.css';

const TABS = ['All', 'Delivered', 'In Transit', 'Processing', 'Cancelled'];

const TRACK_STEPS = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
const TRACK_PROGRESS = { 'Processing': 1, 'In Transit': 3, 'Delivered': 5, 'Cancelled': 0 };
const STATUS_CLASS = { 'Delivered': 'status-delivered', 'In Transit': 'status-transit', 'Processing': 'status-processing', 'Cancelled': 'status-cancelled' };
const STATUS_ICON  = { 'Delivered': '✅', 'In Transit': '🚚', 'Processing': '⏳', 'Cancelled': '❌' };

// ── Confirmation Modal ──
function CancelModal({ order, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" id="cancel-modal-overlay">
      <div className="cancel-modal" id="cancel-modal">
        <div className="cancel-modal-icon">⚠️</div>
        <h3>Cancel Order?</h3>
        <p>Are you sure you want to cancel order <strong>#{order.id}</strong>?</p>
        <p className="cancel-modal-sub">This action cannot be undone.</p>

        <div className="cancel-modal-items">
          {order.items.map((item, i) => (
            <div className="cmi-row" key={i}>
              <img src={item.image} alt={item.title} className="cmi-img" />
              <span className="cmi-title">{item.title}</span>
              <span className="cmi-price">₹{item.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="cancel-modal-actions">
          <button
            className="cm-btn cm-keep"
            id="keep-order-btn"
            onClick={onClose}
          >
            Keep Order
          </button>
          <button
            className="cm-btn cm-cancel"
            id="confirm-cancel-btn"
            onClick={() => { onConfirm(order.id); onClose(); }}
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Orders Page ──
// Props: orders, onCancelOrder, onReorder, onNavigate
function Orders({ orders = [], onCancelOrder, onReorder, onNavigate }) {
  const [activeTab, setActiveTab]   = useState('All');
  const [cancelTarget, setCancelTarget] = useState(null);   // order to confirm cancel
  const [toast, setToast]           = useState(null);       // success toast message

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancel = (orderId) => {
    onCancelOrder(orderId);
    showToast('Order cancelled successfully! Refund will be processed in 5–7 days.', 'cancel');
  };

  const handleReorder = (order) => {
    onReorder(order);
    showToast('Items added to your cart! 🛒', 'success');
  };

  const filtered = activeTab === 'All'
    ? orders
    : orders.filter(o => o.status === activeTab);

  if (orders.length === 0) {
    return (
      <div className="orders-page" id="orders-page">
        <div className="orders-empty">
          <span className="e-icon">📦</span>
          <h2>No Orders Yet</h2>
          <p>Start shopping and your orders will appear here.</p>
          <button className="shop-btn" id="orders-shop-btn" onClick={() => onNavigate('home')}>
            🛍️ Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page" id="orders-page">

      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`order-toast ${toast.type}`} id="order-toast">
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* ── Cancel Confirmation Modal ── */}
      {cancelTarget && (
        <CancelModal
          order={cancelTarget}
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}

      <h1>📦 My Orders</h1>
      <p className="page-sub">{orders.length} total orders</p>

      {/* ── Filter Tabs ── */}
      <div className="order-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            id={`tab-${tab.replace(/\s/g, '-')}`}
            className={`order-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {STATUS_ICON[tab] || '📋'} {tab}
            <span className="tab-count">
              {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Order Cards ── */}
      {filtered.length === 0 ? (
        <div className="no-orders-tab">
          <span>😕</span>
          <p>No orders in "{activeTab}" category.</p>
        </div>
      ) : (
        filtered.map(order => {
          const done = TRACK_PROGRESS[order.status] || 0;
          const pct  = `${(done / TRACK_STEPS.length) * 100}%`;
          const isCancelled = order.status === 'Cancelled';
          const isDelivered = order.status === 'Delivered';
          const canCancel   = !isCancelled && !isDelivered;

          return (
            <div
              className={`order-card ${isCancelled ? 'order-cancelled' : ''}`}
              key={order.id}
              id={`order-${order.id}`}
            >
              {/* Header */}
              <div className="order-card-header">
                <div>
                  <div className="order-id">#{order.id}</div>
                  <div className="order-date">
                    📅 {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className={`order-status ${STATUS_CLASS[order.status]}`}>
                  {STATUS_ICON[order.status]} {order.status}
                </div>
                <div className="order-total">₹{order.total.toLocaleString()}</div>
              </div>

              {/* Tracking Bar */}
              {!isCancelled && (
                <div className="track-bar">
                  <div className="track-steps">
                    <div className="track-fill" style={{ width: pct }} />
                    {TRACK_STEPS.map((step, i) => (
                      <div className="track-step" key={step}>
                        <div className={`track-dot ${i < done ? 'done' : ''}`}>
                          {i < done ? '✓' : i + 1}
                        </div>
                        <span className={`track-step-label ${i < done ? 'done' : ''}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancelled notice */}
              {isCancelled && (
                <div className="cancelled-notice">
                  ❌ This order was cancelled. Refund processed within 5–7 business days.
                </div>
              )}

              {/* Items */}
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div className="order-item" key={idx}>
                    <img className="order-item-img" src={item.image} alt={item.title} />
                    <div className="order-item-info">
                      <div className="order-item-title">{item.title}</div>
                      <div className="order-item-qty">Qty: {item.qty}</div>
                    </div>
                    <div className="order-item-price">₹{item.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="order-card-footer">
                {/* Reorder – always available */}
                <button
                  className="order-action-btn primary"
                  id={`reorder-${order.id}`}
                  onClick={() => handleReorder(order)}
                >
                  🔄 Reorder
                </button>

                {/* Track – only active orders */}
                {!isCancelled && (
                  <button className="order-action-btn" id={`track-${order.id}`}>
                    📍 Track Order
                  </button>
                )}

                {/* Invoice */}
                <button className="order-action-btn" id={`invoice-${order.id}`}>
                  🧾 Invoice
                </button>

                {/* ── CANCEL BUTTON ── only for active (not delivered / cancelled) */}
                {canCancel && (
                  <button
                    className="order-action-btn cancel-btn"
                    id={`cancel-${order.id}`}
                    onClick={() => setCancelTarget(order)}
                  >
                    ✕ Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Orders;
