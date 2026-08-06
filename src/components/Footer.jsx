import React from 'react';
import { Link } from 'react-router-dom';

const CONTACT_INFO = {
  address: 'Av. Universidad 123, Querétaro, México',
  phone: '+52 442 123 4567',
  phoneHref: 'tel:+524421234567',
  email: 'contacto@rincondelcafe.mx',
  emailHref: 'mailto:contacto@rincondelcafe.mx',
};

const SOCIAL_LINKS = [
  { key: 'ig', label: 'IG', name: 'Instagram', href: 'https://instagram.com/rincondelcafe' },
  { key: 'tw', label: 'TW', name: 'Twitter / X', href: 'https://x.com/rincondelcafe' },
  { key: 'fb', label: 'FB', name: 'Facebook', href: 'https://facebook.com/rincondelcafe' },
];

export default function Footer() {
  return (
    <footer style={s.footer}>
      <style>{`
        .sd-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
        @media (max-width: 1024px) { .sd-footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; } }
        @media (max-width: 640px) { .sd-footer-grid { grid-template-columns: 1fr; gap: 32px; } }
        .footer-hover-link:hover { color: #D4A373 !important; }
        .footer-social-btn:hover { color: #16110F !important; background: #D4A373 !important; border-color: #D4A373 !important; }
      `}</style>

      <div className="sd-footer-grid" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
          <div style={s.footerLogo}>
            <span style={{ color: '#F9F6F0' }}>EL RINCÓN </span>
            <span style={{ color: '#D4A373', fontStyle: 'italic' }}>DEL CAFÉ</span>
          </div>
          <p style={s.footerDesc}>
            El mejor café de especialidad preparado por baristas expertos.<br />
            Tu pausa perfecta del día.
          </p>

          <div style={s.footerContactList}>
            <div style={s.footerContactItem}>
              <span style={s.footerContactIcon} aria-hidden="true">⚲</span>
              <span>{CONTACT_INFO.address}</span>
            </div>
            <div style={s.footerContactItem}>
              <span style={s.footerContactIcon} aria-hidden="true">☎</span>
              <a href={CONTACT_INFO.phoneHref} style={s.footerContactLink} className="footer-hover-link">{CONTACT_INFO.phone}</a>
            </div>
            <div style={s.footerContactItem}>
              <span style={s.footerContactIcon} aria-hidden="true">✉</span>
              <a href={CONTACT_INFO.emailHref} style={s.footerContactLink} className="footer-hover-link">{CONTACT_INFO.email}</a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4, justifyContent: 'flex-start' }}>
            {SOCIAL_LINKS.map((net) => (
              <a key={net.key} href={net.href} target="_blank" rel="noopener noreferrer" aria-label={net.name} style={s.socialBtn} className="footer-social-btn">
                {net.label}
              </a>
            ))}
          </div>
        </div>

        {/* ⚡ FIX: Usamos un arreglo con 'to' y 'label' para usar el componente <Link> de React Router */}
        {[
          { 
            title: 'Nuestra Cafetería', 
            links: [
              { label: 'Nosotros', to: '/nosotros' }, 
              { label: 'Menú', to: '/catalog' }, 
              { label: 'Nuestros Granos', to: '/granos' }, 
              { label: 'Ubicación', to: '/ubicacion' }
            ] 
          },
          { 
            title: 'Soporte', 
            links: [
              { label: 'Centro de ayuda', to: '/ayuda' }, 
              { label: 'Facturación', to: '/ayuda' }, 
              { label: 'Preguntas Frecuentes', to: '/faq' }
            ] 
          },
        ].map((col) => (
          <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', alignItems: 'flex-start' }}>
            <div style={s.footerColTitle}>{col.title}</div>
            {col.links.map((l) => (
              <Link key={l.label} to={l.to} style={s.footerLink} className="footer-hover-link">
                {l.label}
              </Link>
            ))}
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', alignItems: 'flex-start' }}>
          <div style={s.footerColTitle}>Legal</div>
          <Link to="/privacy" style={s.footerLink} className="footer-hover-link">Aviso de Privacidad</Link>
          <Link to="/terms" style={s.footerLink} className="footer-hover-link">Términos de Uso</Link>
        </div>
      </div>

      <div style={s.footerBottom}>
        <span style={s.footerCopy}>© 2026 El Rincón del Café. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}

const s = {
  footer: { background: '#16110F', padding: '60px 5% 40px', borderTop: '1px solid #3A2E2A', color: '#F9F6F0', fontFamily: '"Inter", sans-serif', marginTop: 'auto', width: '100%', boxSizing: 'border-box' },
  footerLogo: { fontSize: 18, fontWeight: 700, fontFamily: '"Playfair Display", serif', marginBottom: 16 },
  footerDesc: { fontSize: 14, color: '#B0A39C', lineHeight: 1.6, marginBottom: 24, textAlign: 'left' },
  footerContactList: { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' },
  footerContactItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#F9F6F0' },
  footerContactIcon: { color: '#D4A373', fontSize: 16 },
  footerContactLink: { color: '#F9F6F0', textDecoration: 'none', transition: 'color 0.2s' },
  socialBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: '1px solid #3A2E2A', borderRadius: '50%', color: '#B0A39C', fontSize: 11, textDecoration: 'none', transition: 'all 0.2s' },
  footerColTitle: { fontSize: 13, fontWeight: 600, color: '#D4A373', marginBottom: 20 },
  footerLink: { color: '#B0A39C', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s', textAlign: 'left' },
  footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginTop: 48, paddingTop: 24, borderTop: '1px solid #3A2E2A' },
  footerCopy: { fontSize: 12, color: '#B0A39C' },
};