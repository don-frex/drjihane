import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Menu, X, Phone } from 'lucide-react';
import '../styles/Components.css';

interface NavbarProps {
  activeSection: number;
  scrollToSection: (index: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  scrollToSection,
}) => {
  const { locale, setLocale, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollPos > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger immediately on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen]);

  const navItems = [
    { key: 'home', label: t('nav.home'), index: 0 },
    { key: 'gallery', label: t('nav.gallery'), index: 1 },
    { key: 'services', label: t('nav.services'), index: 2 },
    { key: 'about', label: t('nav.about'), index: 3 },
    { key: 'booking', label: t('nav.booking'), index: 4 },
  ];

  const handleNavClick = (index: number) => {
    scrollToSection(index);
    setMobileMenuOpen(false);
  };



  return (
    <nav className={`navbar glass-panel ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo" onClick={() => handleNavClick(0)}>
          <span className="logo-badge">JM</span>
          <div className="logo-text">
            <span className="logo-title">Dr. Jihane El Masbahi</span>
          </div>
        </div>

        <div className="nav-desktop">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleNavClick(item.index)}
                  className={`nav-link-btn ${activeSection === item.index ? 'active' : ''}`}
                >
                  {item.label}
                  {activeSection === item.index && <span className="active-dot" />}
                </button>
              </li>
            ))}
          </ul>

          <div className="nav-actions" ref={dropdownRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)} 
              className="lang-btn" 
              aria-label="Select language"
              aria-expanded={langDropdownOpen}
            >
              <Globe size={16} />
              <span>{locale.toUpperCase()}</span>
            </button>

            {langDropdownOpen && (
              <div className="lang-dropdown glass-panel">
                <button 
                  onClick={() => { setLocale('fr'); setLangDropdownOpen(false); }} 
                  className={`lang-dropdown-item ${locale === 'fr' ? 'active' : ''}`}
                >
                  Français (FR)
                </button>
                <button 
                  onClick={() => { setLocale('en'); setLangDropdownOpen(false); }} 
                  className={`lang-dropdown-item ${locale === 'en' ? 'active' : ''}`}
                >
                  English (EN)
                </button>
                <button 
                  onClick={() => { setLocale('ar'); setLangDropdownOpen(false); }} 
                  className={`lang-dropdown-item ${locale === 'ar' ? 'active' : ''}`}
                >
                  العربية (AR)
                </button>
              </div>
            )}

            <a href="tel:0528770404" className="nav-tel-btn">
              <Phone size={16} />
              <span className="tel-text">05 28 77 04 04</span>
            </a>
          </div>
        </div>

        <div className="nav-mobile-trigger">
          <a href="tel:0528770404" className="mobile-header-call-btn" aria-label="Call clinic">
            <Phone size={18} />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hamburger-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-panel glass-panel">
          <ul className="mobile-nav-links">
            {navItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleNavClick(item.index)}
                  className={`mobile-nav-link-btn ${activeSection === item.index ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mobile-nav-actions">
            <div className="mobile-lang-selector">
              <span className="mobile-lang-title">
                <Globe size={16} />
                <span>Langue / Language / اللغة</span>
              </span>
              <div className="mobile-lang-buttons">
                <button 
                  onClick={() => { setLocale('fr'); setMobileMenuOpen(false); }} 
                  className={`mobile-lang-btn ${locale === 'fr' ? 'active' : ''}`}
                >
                  FR
                </button>
                <button 
                  onClick={() => { setLocale('en'); setMobileMenuOpen(false); }} 
                  className={`mobile-lang-btn ${locale === 'en' ? 'active' : ''}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => { setLocale('ar'); setMobileMenuOpen(false); }} 
                  className={`mobile-lang-btn ${locale === 'ar' ? 'active' : ''}`}
                >
                  AR
                </button>
              </div>
            </div>

            <a href="tel:0528770404" className="mobile-call-btn btn-primary">
              <Phone size={16} />
              <span>Appeler le Cabinet</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
