import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, MapPin, Mail, Clock, AlertTriangle } from 'lucide-react';
import '../styles/Footer.css';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          
          <div className="footer-column clinic-summary">
            <div className="footer-logo">
              <span className="logo-badge">JM</span>
              <span className="logo-title-footer">Dr. Jihane El Masbahi</span>
            </div>
            <p className="clinic-bio">
              {t('about.p1').substring(0, 140)}...
            </p>
            <div className="emergency-alert glass-panel">
              <AlertTriangle className="alert-icon" size={18} />
              <div>
                <strong>{t('contact.emergency_label')}</strong>
                <p>{t('contact.emergency_val')}</p>
              </div>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="column-title">{t('contact.title')}</h3>
            <ul className="footer-contact-list">
              <li>
                <MapPin className="contact-icon" size={16} />
                <span>{t('contact.address_val')}</span>
              </li>
              <li>
                <Phone className="contact-icon" size={16} />
                <a href="tel:0528770404">{t('contact.phone_val')}</a>
              </li>
              <li>
                <Mail className="contact-icon" size={16} />
                <a href="mailto:dr.jihane.elmasbahi@gmail.com">{t('contact.email_val')}</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="column-title">{t('contact.hours_label')}</h3>
            <ul className="hours-list">
              <li>
                <Clock className="hours-icon" size={14} />
                <div>
                  <span className="day-name">Lundi - Vendredi</span>
                  <span className="day-time">09:00 - 13:00, 14:30 - 18:30</span>
                </div>
              </li>
              <li>
                <Clock className="hours-icon" size={14} />
                <div>
                  <span className="day-name">Samedi</span>
                  <span className="day-time">09:00 - 13:00</span>
                </div>
              </li>
              <li>
                <Clock className="hours-icon" size={14} />
                <div>
                  <span className="day-name">Dimanche</span>
                  <span className="day-time closed-label">Fermé</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="footer-column map-column">
            <h3 className="column-title">Localisation</h3>
            <div className="map-wrapper glass-panel">
              <iframe
                title="Clinic Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113401.44297126027!2d-10.126442654388439!3d28.983995874272183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb5858cfd7990ff9%3A0xe54e6005c2a16d0c!2sGuelmim%2C%20Morocco!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="google-map-iframe"
              ></iframe>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} Dr. Jihane El Masbahi. Tous droits réservés.
          </p>
          <div className="footer-links">
            <a href="#legal">Mentions Légales</a>
            <span className="separator">•</span>
            <a href="#privacy">Politique de Confidentialité</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
