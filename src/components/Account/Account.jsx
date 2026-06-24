import './Account.css';

// Account Page
// Props: user, onNavigate, onLogout
function Account({ user, onNavigate, onLogout }) {
  const displayName = user?.name || 'Guest User';
  const displayEmail = user?.email || 'guest@shopnova.com';
  const initial = displayName.charAt(0).toUpperCase();

  const MENU_ITEMS = [
    { icon: '📦', title: 'My Orders',         sub: '3 active orders',         page: 'orders'   },
    { icon: '❤️', title: 'My Wishlist',        sub: 'Saved items',             page: 'wishlist' },
    { icon: '🛒', title: 'My Cart',            sub: 'Items waiting for you',   page: 'cart'     },
    { icon: '📍', title: 'Saved Addresses',    sub: '2 addresses saved',       page: null       },
    { icon: '💳', title: 'Payment Methods',    sub: 'UPI, Cards, Net Banking',  page: null       },
    { icon: '🎁', title: 'Coupons & Rewards',  sub: '₹250 Nova Cash available',page: null       },
    { icon: '🔔', title: 'Notifications',      sub: 'Manage preferences',      page: null       },
    { icon: '⚙️', title: 'Settings',           sub: 'Privacy, language, more', page: null       },
    { icon: '🆘', title: 'Help & Support',     sub: '24×7 customer support',   page: null       },
  ];

  return (
    <div className="account-page" id="account-page">

      {/* Profile Banner */}
      <div className="account-banner">
        <div className="account-avatar">{initial}</div>
        <div className="account-info">
          <h1>Hi, {displayName} 👋</h1>
          <p>{displayEmail}</p>
          <div className="account-prime-badge">⭐ Nova Prime Member</div>
        </div>
        <button className="edit-profile-btn" id="edit-profile-btn">✏️ Edit Profile</button>
      </div>

      {/* Stats */}
      <div className="account-stats">
        {[
          { icon: '📦', num: '3',   label: 'Orders'   },
          { icon: '❤️', num: '8',   label: 'Wishlist' },
          { icon: '⭐', num: '12',  label: 'Reviews'  },
          { icon: '💰', num: '₹250',label: 'Nova Cash'},
        ].map((s, i) => (
          <div className="stat-card" key={i} id={`stat-card-${i}`}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="account-grid">

        {/* Personal Info */}
        <div className="account-section">
          <div className="section-head">
            <h2>👤 Personal Info</h2>
            <button className="section-edit-btn" id="edit-info-btn">Edit</button>
          </div>
          <div className="section-body">
            {[
              { label: 'Full Name',  value: displayName },
              { label: 'Email',      value: displayEmail },
              { label: 'Phone',      value: '+91 98765 43210' },
              { label: 'Birthday',   value: 'Jan 15, 1995' },
              { label: 'Gender',     value: 'Male' },
            ].map((row, i) => (
              <div className="info-row" key={i}>
                <span className="info-label">{row.label}</span>
                <span className="info-value">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="account-section">
          <div className="section-head">
            <h2>📍 Addresses</h2>
            <button className="section-edit-btn" id="add-address-btn">+ Add New</button>
          </div>
          <div className="section-body">
            <div className="address-card default">
              <span className="address-default-tag">Default</span>
              <div className="address-name">Home 🏠</div>
              <div className="address-text">
                123, MG Road, Near City Mall,<br />
                Bengaluru, Karnataka – 560001
              </div>
              <div className="address-actions">
                <button className="addr-btn" id="edit-addr-1">Edit</button>
                <button className="addr-btn del" id="del-addr-1">Delete</button>
              </div>
            </div>
            <div className="address-card">
              <div className="address-name">Office 🏢</div>
              <div className="address-text">
                45, Tech Park, Whitefield,<br />
                Bengaluru, Karnataka – 560066
              </div>
              <div className="address-actions">
                <button className="addr-btn" id="edit-addr-2">Edit</button>
                <button className="addr-btn del" id="del-addr-2">Delete</button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items - full width */}
        <div className="account-section full">
          <div className="section-head">
            <h2>⚡ Quick Links</h2>
          </div>
          <ul className="account-menu-list">
            {MENU_ITEMS.map((item, i) => (
              <li
                key={i}
                className="account-menu-item"
                id={`menu-item-${i}`}
                onClick={() => item.page && onNavigate(item.page)}
              >
                <div className="ami-left">
                  <span className="ami-icon">{item.icon}</span>
                  <div>
                    <div className="ami-title">{item.title}</div>
                    <div className="ami-sub">{item.sub}</div>
                  </div>
                </div>
                <span className="ami-arrow">›</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Logout */}
      <button className="logout-btn" id="account-logout-btn" onClick={onLogout}>
        🚪 Sign Out
      </button>

    </div>
  );
}

export default Account;
