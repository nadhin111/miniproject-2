import { useState, useEffect } from 'react';
import './Hero.css';
import { banners } from '../../data/products';

// Hero Component - receives props: onNavigate
function Hero({ onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () =>
    setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);

  const nextSlide = () =>
    setCurrentSlide(prev => (prev + 1) % banners.length);

  const currentBanner = banners[currentSlide];

  return (
    <section
      className="hero"
      style={{ background: currentBanner.bg }}
      id="hero-section"
    >
      <button className="hero-prev" onClick={prevSlide} id="hero-prev-btn" aria-label="Previous slide">‹</button>

      <div className="hero-slide">
        <div className="hero-content">
          <span className="hero-badge">🔥 Hot Deals</span>
          <h1 className="hero-title" style={{ color: currentBanner.textColor }}>
            {currentBanner.title}
          </h1>
          <p className="hero-subtitle">{currentBanner.subtitle}</p>
          <p className="hero-description">{currentBanner.description}</p>
          <button
            className="hero-cta"
            id="hero-shop-now-btn"
            onClick={() => onNavigate('home')}
          >
            Shop Now →
          </button>
        </div>
      </div>

      <button className="hero-next" onClick={nextSlide} id="hero-next-btn" aria-label="Next slide">›</button>

      {/* Dot Indicators */}
      <div className="hero-dots">
        {banners.map((_, idx) => (
          <button
            key={idx}
            id={`hero-dot-${idx}`}
            className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
