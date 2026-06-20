import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Stethoscope, Activity, HeartPulse, ClipboardList } from 'lucide-react';
import '../styles/Services.css';

interface ServiceItem {
  key: string;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
}

export const Services: React.FC = () => {
  const { t } = useLanguage();

  const servicesList: ServiceItem[] = [
    {
      key: 'general',
      icon: <Stethoscope className="service-icon-svg" size={32} />,
      titleKey: 'services.general.title',
      descKey: 'services.general.desc',
    },
    {
      key: 'ultrasound',
      icon: <Activity className="service-icon-svg" size={32} />,
      titleKey: 'services.ultrasound.title',
      descKey: 'services.ultrasound.desc',
    },
    {
      key: 'preventative',
      icon: <HeartPulse className="service-icon-svg" size={32} />,
      titleKey: 'services.preventative.title',
      descKey: 'services.preventative.desc',
    },
    {
      key: 'nursing',
      icon: <ClipboardList className="service-icon-svg" size={32} />,
      titleKey: 'services.nursing.title',
      descKey: 'services.nursing.desc',
    },
  ];

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

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  };

  const handleMouseLeave = (idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  return (
    <div className="services-section-wrapper">
      <div className="section-header">
        <h2>{t('services.title')}</h2>
        <p>{t('services.subtitle')}</p>
      </div>

      <div className="services-grid">
        {servicesList.map((service, index) => (
          <div
            key={service.key}
            ref={(el) => { cardRefs.current[index] = el; }}
            className="service-card glass-panel"
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className="service-icon-container">
              {service.icon}
              <div className="service-icon-glow" />
            </div>
            
            <h3 className="service-card-title">{t(service.titleKey)}</h3>
            <p className="service-card-desc">{t(service.descKey)}</p>
            
            <div className="service-card-glow-overlay" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Services;
