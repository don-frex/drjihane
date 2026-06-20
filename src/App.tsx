import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Gallery3D from './components/Gallery3D';
import Services from './components/Services';
import Appointment from './components/Appointment';
import Footer from './components/Footer';
import { Calendar, Compass, ShieldAlert, Award, Star, ArrowDown } from 'lucide-react';
import './styles/App.css';
import AnimatedCounter from './components/AnimatedCounter';

const TypingTitle: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          const doneTimeout = setTimeout(() => {
            setIsTyping(false);
          }, 1500);
          return () => clearTimeout(doneTimeout);
        }
      }, 70);
      
      return () => clearInterval(interval);
    }, 300);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [text]);

  return (
    <span className={isTyping ? 'typing-cursor' : ''}>
      {displayedText}
    </span>
  );
};

const revealedIndices = new Set<string>();

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState(() => {
    const saved = sessionStorage.getItem('active_section');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [currentVideo, setCurrentVideo] = useState(1);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentVideo === 1) {
      if (videoRef1.current) {
        videoRef1.current.currentTime = 0;
        videoRef1.current.play().catch(() => {});
      }
    } else {
      if (videoRef2.current) {
        videoRef2.current.currentTime = 0;
        videoRef2.current.play().catch(() => {});
      }
    }
  }, [currentVideo]);

  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev === 1 ? 2 : 1));
  };

  const scrollToSection = (index: number) => {
    const anchors = document.querySelectorAll('.section-2d-anchor');
    if (anchors[index]) {
      anchors[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(index);
      sessionStorage.setItem('active_section', index.toString());
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('active_section');
    if (saved !== null) {
      const index = parseInt(saved, 10);
      if (index > 0) {
        const timer = setTimeout(() => {
          scrollToSection(index);
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Intersection Observer for scroll-reveal animations (runs on every render to prevent React re-renders from wiping active classes)
  useEffect(() => {
    const revealCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          const allReveals = Array.from(document.querySelectorAll('.reveal'));
          const idx = allReveals.indexOf(entry.target);
          if (idx !== -1) {
            revealedIndices.add(idx.toString());
          }
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px',
    });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, idx) => {
      // If it was already revealed in the past, restore the active class immediately
      if (revealedIndices.has(idx.toString())) {
        el.classList.add('active');
      }
      revealObserver.observe(el);
    });

    return () => {
      revealObserver.disconnect();
    };
  });

  // Intersection Observer for tracking the current section active state (runs only once on mount)
  useEffect(() => {
    const sectionCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-section-index');
          if (id !== null) {
            const index = parseInt(id, 10);
            setActiveSection(index);
            sessionStorage.setItem('active_section', index.toString());
          }
        }
      });
    };

    const sectionObserver = new IntersectionObserver(sectionCallback, {
      threshold: 0.35,
      rootMargin: '-80px 0px -50% 0px',
    });

    document.querySelectorAll('.section-2d-anchor').forEach((el) => sectionObserver.observe(el));

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="main-wrapper mode-2d-active">
      <div className="liquid-blob blob-primary" />
      <div className="liquid-blob blob-teal" />
      <div className="liquid-blob blob-bronze" />

      <Navbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      <section className="section-2d-anchor hero-section-container" data-section-index="0">
        <div className="hero-video-bg-container">
          <video
            ref={videoRef1}
            className={`hero-video-bg ${currentVideo === 1 ? 'active' : ''}`}
            src="https://res.cloudinary.com/dkgwvujw4/video/upload/v1781957724/1_hjutsb.mp4"
            muted
            playsInline
            onEnded={handleVideoEnded}
            preload="auto"
            autoPlay
          />
          <video
            ref={videoRef2}
            className={`hero-video-bg ${currentVideo === 2 ? 'active' : ''}`}
            src="https://res.cloudinary.com/dkgwvujw4/video/upload/v1781957724/2_sgized.mp4"
            muted
            playsInline
            onEnded={handleVideoEnded}
            preload="auto"
          />
          <div className="hero-video-overlay" />
        </div>

        <div className="hero-content-inner reveal">
          <h1 className="hero-title-h1">
            <TypingTitle text={t('hero.title')} />
          </h1>
          
          <p className="hero-tagline">{t('hero.tagline')}</p>
          
          <div className="hero-ctas">
            <button onClick={() => scrollToSection(4)} className="btn-primary">
              <Calendar size={18} />
              <span>{t('hero.cta_booking')}</span>
            </button>
            <button onClick={() => scrollToSection(1)} className="btn-secondary">
              <Compass size={18} />
              <span>{t('hero.cta_gallery')}</span>
            </button>
          </div>

          <div className="scroll-hint-wrapper" onClick={() => scrollToSection(1)}>
            <p className="scroll-hint-text">{t('hero.scroll_tip')}</p>
            <div className="scroll-hint-mouse">
              <div className="scroll-hint-wheel" />
            </div>
            <ArrowDown size={16} className="scroll-hint-arrow" />
          </div>
        </div>
      </section>

      <section className="section-2d-anchor gallery-section-container" data-section-index="1">
        <div className="section-content-inner">
          <Gallery3D />
        </div>
      </section>

      <section className="section-2d-anchor services-section-container" data-section-index="2">
        <div className="section-content-inner reveal">
          <Services />
        </div>
      </section>

      <section className="section-2d-anchor about-section-container" data-section-index="3">
        <div className="about-grid-wrapper reveal">
          <div className="about-text-column">
            <div className="about-badge">{t('nav.about')}</div>
            <h2 className="about-h2">{t('about.title')}</h2>
            <h3 className="about-h3">{t('about.subtitle')}</h3>
            <p className="about-p">{t('about.p1')}</p>
            <p className="about-p">{t('about.p2')}</p>
          </div>
          
          <div className="about-stats-column">
            <div className="stat-box glass-panel">
              <Award size={24} className="stat-box-icon" />
              <div>
                <h4 className="stat-box-value"><AnimatedCounter end={10} suffix="+" /></h4>
                <p className="stat-box-label">{t('about.fact_experience')}</p>
              </div>
            </div>
            <div className="stat-box glass-panel">
              <Star size={24} className="stat-box-icon" />
              <div>
                <h4 className="stat-box-value"><AnimatedCounter end={5000} suffix="+" /></h4>
                <p className="stat-box-label">{t('about.fact_patients')}</p>
              </div>
            </div>
            <div className="stat-box glass-panel">
              <ShieldAlert size={24} className="stat-box-icon" />
              <div>
                <h4 className="stat-box-value"><AnimatedCounter end={100} suffix="%" /></h4>
                <p className="stat-box-label">{t('about.fact_equipment')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-2d-anchor booking-section-container" data-section-index="4">
        <div className="section-content-inner reveal">
          <Appointment />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
