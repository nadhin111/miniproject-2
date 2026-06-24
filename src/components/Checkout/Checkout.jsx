import { useState } from 'react';
import './Checkout.css';

const STEPS = ['Address', 'Payment', 'Review'];

// Checkout Page
// Props: cartItems, onNavigate
function Checkout({ cartItems, onNavigate }) {
  const [step, setStep]       = useState(0);
  const [payMethod, setPayMethod] = useState('upi');
  const [placed, setPlaced]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId]             = useState(`SNV-${Date.now().toString().slice(-6)}`);

  const [addr, setAddr] = useState({
    name: '', phone: '', pincode: '', flat: '', area: '', city: '', state: ''
  });
  const setA = (k) => (e) => setAddr(a => ({ ...a, [k]: e.target.value }));

  const subtotal  = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery  = subtotal > 499 ? 0 : 49;
  const tax       = Math.round(subtotal * 0.05);
  const total     = subtotal + delivery + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setPlaced(true);
  };

  // ── Success Screen ──
  if (placed) {
    return (
      <div className="checkout-page" id="checkout-success-page">
        <div className="checkout-success">
          <div className="success-circle">✅</div>
          <h2>Order Placed!</h2>
          <p>Your order has been confirmed and will be delivered within 2–5 business days.</p>
          <div className="order-num-box">
            <p>Your Order ID</p>
            <strong>{orderId}</strong>
          </div>
          <div className="co-success-actions">
            <button className="primary-btn" id="go-orders-btn" onClick={() => onNavigate('orders')}>
              📦 Track Order
            </button>
            <button className="outline-btn" id="keep-shopping-btn" onClick={() => onNavigate('home')}>
              🛍️ Keep Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page" id="checkout-page">
      <h1>🛒 Checkout</h1>

      {/* Step Indicator */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
            <div className="step-num">{i < step ? '✓' : i + 1}</div>
            <span className="step-label">{s}</span>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? 'var(--nova-primary)' : 'var(--border)', margin: '0 8px' }} />}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        {/* ── LEFT ── */}
        <div>

          {/* STEP 0 – Address */}
          {step === 0 && (
            <div className="checkout-card" id="address-section">
              <div className="checkout-card-head">📍 Delivery Address</div>
              <div className="checkout-card-body">
                <div className="co-form">
                  <div className="co-row">
                    <div className="co-group">
                      <label className="co-label">Full Name</label>
                      <input id="co-name" className="co-input" placeholder="John Doe"
                        value={addr.name} onChange={setA('name')} />
                    </div>
                    <div className="co-group">
                      <label className="co-label">Phone</label>
                      <input id="co-phone" className="co-input" placeholder="+91 9876543210"
                        value={addr.phone} onChange={setA('phone')} />
                    </div>
                  </div>
                  <div className="co-group">
                    <label className="co-label">Flat / House No. / Building</label>
                    <input id="co-flat" className="co-input" placeholder="Flat 4B, Rose Apartments"
                      value={addr.flat} onChange={setA('flat')} />
                  </div>
                  <div className="co-group">
                    <label className="co-label">Area / Street / Locality</label>
                    <input id="co-area" className="co-input" placeholder="MG Road, Near City Mall"
                      value={addr.area} onChange={setA('area')} />
                  </div>
                  <div className="co-row">
                    <div className="co-group">
                      <label className="co-label">City</label>
                      <input id="co-city" className="co-input" placeholder="Bengaluru"
                        value={addr.city} onChange={setA('city')} />
                    </div>
                    <div className="co-group">
                      <label className="co-label">Pincode</label>
                      <input id="co-pincode" className="co-input" placeholder="560001"
                        value={addr.pincode} onChange={setA('pincode')} />
                    </div>
                  </div>
                  <div className="co-group">
                    <label className="co-label">State</label>
                    <select className="co-input" id="co-state" value={addr.state} onChange={setA('state')}>
                      <option value="">Select State</option>
                      {['Karnataka','Maharashtra','Tamil Nadu','Delhi','Uttar Pradesh','Gujarat','West Bengal','Telangana'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button className="co-place-btn" id="next-to-payment" onClick={() => setStep(1)}>
                    Continue to Payment →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 – Payment */}
          {step === 1 && (
            <div className="checkout-card" id="payment-section">
              <div className="checkout-card-head">💳 Payment Method</div>
              <div className="checkout-card-body">
                <div className="payment-options">
                  {[
                    { id: 'upi',   icon: '📱', label: 'UPI',          sub: 'Pay with GPay, PhonePe, Paytm' },
                    { id: 'card',  icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay' },
                    { id: 'netb',  icon: '🏦', label: 'Net Banking',   sub: 'All major banks supported' },
                    { id: 'emi',   icon: '📅', label: 'EMI',           sub: 'No-cost EMI options available' },
                    { id: 'cod',   icon: '💵', label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
                  ].map(opt => (
                    <label key={opt.id}
                      className={`payment-option ${payMethod === opt.id ? 'selected' : ''}`}
                      id={`pay-opt-${opt.id}`}
                    >
                      <input type="radio" name="payment" value={opt.id}
                        checked={payMethod === opt.id}
                        onChange={() => setPayMethod(opt.id)} />
                      <span className="pay-icon">{opt.icon}</span>
                      <div>
                        <div className="pay-label">{opt.label}</div>
                        <div className="pay-sub">{opt.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {payMethod === 'upi' && (
                  <div className="upi-input-wrap">
                    <div className="co-group">
                      <label className="co-label">UPI ID</label>
                      <input id="upi-id" className="co-input" placeholder="yourname@upi" />
                    </div>
                  </div>
                )}
                {payMethod === 'card' && (
                  <div className="co-form" style={{ marginTop: 16 }}>
                    <div className="co-group">
                      <label className="co-label">Card Number</label>
                      <input id="card-num" className="co-input" placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="co-row">
                      <div className="co-group">
                        <label className="co-label">Expiry</label>
                        <input id="card-exp" className="co-input" placeholder="MM / YY" maxLength={7} />
                      </div>
                      <div className="co-group">
                        <label className="co-label">CVV</label>
                        <input id="card-cvv" className="co-input" placeholder="•••" maxLength={4} type="password" />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button className="co-place-btn" id="back-to-addr" style={{ background: 'var(--border)', color: 'var(--text-primary)', boxShadow: 'none' }}
                    onClick={() => setStep(0)}>← Back</button>
                  <button className="co-place-btn" id="next-to-review" onClick={() => setStep(2)}>
                    Review Order →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 – Review */}
          {step === 2 && (
            <div className="checkout-card" id="review-section">
              <div className="checkout-card-head">🔍 Review Your Order</div>
              <div className="checkout-card-body">
                {cartItems.map(item => (
                  <div className="co-item" key={item.id}>
                    <img className="co-item-img" src={item.image} alt={item.title} />
                    <span className="co-item-name">{item.title} × {item.quantity}</span>
                    <span className="co-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <hr className="co-divider" />
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button className="co-place-btn" id="back-to-payment" style={{ background: 'var(--border)', color: 'var(--text-primary)', boxShadow: 'none' }}
                    onClick={() => setStep(1)}>← Back</button>
                  <button
                    className={`co-place-btn ${loading ? '' : ''}`}
                    id="place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading
                      ? <><div className="spinner" style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> Placing Order...</>
                      : '🎉 Place Order'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── ORDER SUMMARY (right) ── */}
        <div className="co-summary" id="checkout-summary">
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div className="co-item" key={item.id}>
              <img className="co-item-img" src={item.image} alt={item.title} />
              <span className="co-item-name">{item.title} × {item.quantity}</span>
              <span className="co-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <hr className="co-divider" />
          <div className="co-row-price"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="co-row-price"><span>Delivery</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
          <div className="co-row-price"><span>Tax (5%)</span><span>₹{tax.toLocaleString()}</span></div>
          <div className="co-row-price total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <p className="co-secure">🔒 Safe & Secure Checkout</p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
