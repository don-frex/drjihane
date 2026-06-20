import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/Gallery3D.css';

interface GalleryItem {
  id: string;
  img: string;
  titleKey: string;
  descKey: string;
}

export const Gallery3D: React.FC = () => {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const items: GalleryItem[] = [
    {
      id: 'reception',
      img: '/clinic/reception.jpg',
      titleKey: 'gallery.reception.title',
      descKey: 'gallery.reception.desc',
    },
    {
      id: 'consultation1',
      img: '/clinic/consultation1.jpg',
      titleKey: 'gallery.consultation1.title',
      descKey: 'gallery.consultation1.desc',
    },
    {
      id: 'consultation2',
      img: '/clinic/consultation2.jpg',
      titleKey: 'gallery.consultation2.title',
      descKey: 'gallery.consultation2.desc',
    },
    {
      id: 'treatment',
      img: '/clinic/treatment.jpg',
      titleKey: 'gallery.treatment.title',
      descKey: 'gallery.treatment.desc',
    },
    {
      id: 'office',
      img: '/clinic/office.jpg',
      titleKey: 'gallery.office.title',
      descKey: 'gallery.office.desc',
    },
  ];

  // Derived state
  const isOpen = selectedIndex !== null;
  const lightboxItem = isOpen ? items[selectedIndex!] : null;

  // Handlers
  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const showNext = useCallback(() => {
    setSelectedIndex((prevIndex) => 
      prevIndex === null ? 0 : (prevIndex === items.length - 1 ? 0 : prevIndex + 1)
    );
  }, [items.length]);

  const showPrev = useCallback(() => {
    setSelectedIndex((prevIndex) => 
      prevIndex === null ? 0 : (prevIndex === 0 ? items.length - 1 : prevIndex - 1)
    );
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showNext, showPrev]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div className="gallery-3d-wrapper">
      <div className="section-header reveal">
        <h2>{t('gallery.title')}</h2>
        <p>{t('gallery.subtitle')}</p>
      </div>

      <div className="gallery-2d-grid">
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => { cardRefs.current[index] = el; }}
            className="gallery-grid-card glass-panel reveal"
            onClick={() => openLightbox(index)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className="card-image-wrapper">
              <img src={item.img} alt={t(item.titleKey)} className="card-image" />
              <div className="card-glow-overlay" />
              <button className="expand-badge" aria-label="Expand image">
                <Maximize2 size={16} />
              </button>
            </div>
            
            <div className="card-content-panel">
              <h3 className="card-title">{t(item.titleKey)}</h3>
              <p className="card-description-summary">{t(item.descKey).substring(0, 75)}...</p>
            </div>
          </div>
        ))}
      </div>

      {isOpen && lightboxItem && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-wrapper" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
              <X size={24} />
            </button>

            {/* Previous Button */}
            <button 
              className="lightbox-nav-btn lightbox-prev" 
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              aria-label="Previous"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Main Content Box */}
            <div className="lightbox-content glass-panel">
              <div className="lightbox-image-container">
                <img
                  src={lightboxItem.img}
                  alt={t(lightboxItem.titleKey)}
                  className="lightbox-image"
                />
              </div>
              <div className="lightbox-details">
                <h3>{t(lightboxItem.titleKey)}</h3>
                <p>{t(lightboxItem.descKey)}</p>
              </div>
            </div>

            {/* Next Button */}
            <button 
              className="lightbox-nav-btn lightbox-next" 
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              aria-label="Next"
            >
              <ChevronRight size={28} />
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery3D;
