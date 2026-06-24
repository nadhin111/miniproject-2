import './Footer.css';

// Footer Component - receives props: onNavigate
function Footer({ onNavigate }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer" id="footer">
      {/* Back to Top */}
      <button className="footer-top-btn" id="back-to-top-btn" onClick={scrollToTop}>
        Back to top
      </button>

      {/* Links Grid */}
      <div className="footer-links">
        <div className="footer-col">
          <h3>Get to Know Us</h3>
          <ul>
            <li><a href="#" id="footer-about">About Amazon</a></li>
            <li><a href="#" id="footer-careers">Careers</a></li>
            <li><a href="#" id="footer-press">Press Releases</a></li>
            <li><a href="#" id="footer-science">Amazon Science</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Connect with Us</h3>
          <ul>
            <li><a href="#" id="footer-facebook">Facebook</a></li>
            <li><a href="#" id="footer-twitter">Twitter</a></li>
            <li><a href="#" id="footer-instagram">Instagram</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Make Money with Us</h3>
          <ul>
            <li><a href="#" id="footer-sell">Sell on Amazon</a></li>
            <li><a href="#" id="footer-sell-handmade">Sell under Amazon Handmade</a></li>
            <li><a href="#" id="footer-advertise">Advertise Your Products</a></li>
            <li><a href="#" id="footer-affiliate">Become an Affiliate</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Let Us Help You</h3>
          <ul>
            <li><button id="footer-covid" onClick={scrollToTop}>COVID-19 and Amazon</button></li>
            <li><button id="footer-account" onClick={() => onNavigate('home')}>Your Account</button></li>
            <li><button id="footer-orders" onClick={() => onNavigate('home')}>Your Orders</button></li>
            <li><a href="#" id="footer-returns">Returns & Replacements</a></li>
            <li><a href="#" id="footer-help">Help</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-logo" onClick={() => onNavigate('home')} id="footer-logo">
          <span className="logo-text">amazon</span>
          <span className="logo-dot"></span>
        </div>

        <div className="footer-badges">
          <span className="footer-badge">🌐 India</span>
          <span className="footer-badge">💰 INR ₹</span>
          <span className="footer-badge">🔒 SSL Secure</span>
        </div>

        <p className="footer-copy">
          © 2024 Amazon Clone built with React + Props & Components |{' '}
          <a href="#" id="footer-conditions">Conditions of Use</a> &nbsp;|&nbsp;{' '}
          <a href="#" id="footer-privacy">Privacy Policy</a> &nbsp;|&nbsp;{' '}
          <a href="#" id="footer-interest">Interest-Based Ads</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
