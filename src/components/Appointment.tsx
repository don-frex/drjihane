import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Phone, User, Mail, Clipboard, CheckCircle2, ChevronRight } from 'lucide-react';
import '../styles/Appointment.css';

export const Appointment: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    timeSlot: 'morning',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.service || !formData.date) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
      existing.push({
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('bookings', JSON.stringify(existing));
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      timeSlot: 'morning',
      notes: '',
    });
    setSuccess(false);
  };

  return (
    <div className="appointment-section-wrapper">
      <div className="appointment-grid glass-panel">
        
        <div className="appointment-info-panel">
          <div className="info-badge">{t('nav.booking')}</div>
          <h2 className="info-title">{t('booking.title')}</h2>
          <p className="info-desc">{t('booking.subtitle')}</p>
          
          <div className="quick-stats">
            <div className="quick-stat-item">
              <span className="stat-num">99%</span>
              <span className="stat-lbl">Satisfaction</span>
            </div>
            <div className="quick-stat-item">
              <span className="stat-num">24h</span>
              <span className="stat-lbl">Réponse rapide</span>
            </div>
          </div>

          <div className="info-details-list">
            <div className="info-detail-item">
              <div className="info-detail-icon">
                <Phone size={18} />
              </div>
              <div>
                <h4>{t('contact.phone_label')}</h4>
                <p className="phone-number">{t('contact.phone_val')}</p>
              </div>
            </div>
            <div className="info-detail-item">
              <div className="info-detail-icon">
                <Calendar size={18} />
              </div>
              <div>
                <h4>{t('contact.hours_label')}</h4>
                <p>{t('contact.hours_weekdays')}</p>
              </div>
            </div>
          </div>
          
          <p className="compliance-tag">✓ {t('ui.morocco_compliance')}</p>
        </div>

        <div className="appointment-form-panel">
          {success ? (
            <div className="booking-success-message">
              <div className="success-icon-wrap">
                <CheckCircle2 size={48} className="success-check-icon" />
              </div>
              <h3>{t('ui.success_title')}</h3>
              <p>{t('ui.success_message')}</p>
              
              <div className="success-summary glass-panel">
                <div><strong>{t('booking.name')}:</strong> {formData.name}</div>
                <div><strong>{t('booking.date')}:</strong> {formData.date}</div>
                <div><strong>{t('booking.time_slot')}:</strong> {formData.timeSlot === 'morning' ? t('booking.time_morning') : t('booking.time_afternoon')}</div>
              </div>

              <button onClick={handleReset} className="btn-primary reset-btn">
                <span>Prendre un autre RDV</span>
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label className="form-label">{t('booking.name')} *</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Ahmed Alami"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">{t('booking.phone')} *</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="e.g. 0661234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">{t('booking.email')}</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="e.g. contact@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('booking.service')} *</label>
                <div className="input-wrapper">
                  <Clipboard size={18} className="input-icon" />
                  <select
                    required
                    className="form-input select-input"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="" disabled>{t('booking.select_service')}</option>
                    <option value="general">{t('services.general.title')}</option>
                    <option value="ultrasound">{t('services.ultrasound.title')}</option>
                    <option value="preventative">{t('services.preventative.title')}</option>
                    <option value="nursing">{t('services.nursing.title')}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">{t('booking.date')} *</label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <input
                      type="date"
                      required
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">{t('booking.time_slot')} *</label>
                  <div className="time-toggle-group">
                    <button
                      type="button"
                      className={`time-toggle-btn ${formData.timeSlot === 'morning' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, timeSlot: 'morning' })}
                    >
                      {t('booking.time_morning')}
                    </button>
                    <button
                      type="button"
                      className={`time-toggle-btn ${formData.timeSlot === 'afternoon' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, timeSlot: 'afternoon' })}
                    >
                      {t('booking.time_afternoon')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('booking.notes')}</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Notes, symptômes ou motif de consultation..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <p className="form-disclaimer">{t('booking.disclaimer')}</p>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary submit-booking-btn"
              >
                {loading ? t('ui.submitting') : t('booking.submit')}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
export default Appointment;
