import React from 'react';
import LocationMap from '../components/LocationMap';

export default function Ubicacion() {
  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.eyebrow}>— Visítanos</div>
        <h1 style={s.title}>Nuestra <span style={s.accent}>Ubicación</span></h1>
      </div>
      <div style={s.content}>
        <div style={s.infoCard}>
          <h2 style={s.subtitle}>El Rincón del Café - Matriz</h2>
          <p style={s.text}>Av. Universidad 123, Centro Histórico<br/>Querétaro, Qro. México, C.P. 76000</p>
          <div style={s.hours}>
            <h3 style={s.hoursTitle}>Horarios de atención</h3>
            <p style={s.text}>Lunes a Viernes: 7:00 AM - 9:00 PM<br/>Sábados y Domingos: 8:00 AM - 8:00 PM</p>
          </div>
        </div>
        {/* Aquí renderizamos tu mapa existente */}
        <div style={s.mapContainer}>
          <LocationMap />
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#16110F', minHeight: 'calc(100vh - 64px)', color: '#F9F6F0', fontFamily: '"Inter", sans-serif' },
  hero: { padding: '60px 5% 40px', borderBottom: '1px solid #3A2E2A', textAlign: 'center' },
  eyebrow: { fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4A373', fontWeight: 600, marginBottom: 16 },
  title: { fontFamily: '"Playfair Display", serif', fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 700, margin: 0 },
  accent: { color: '#D4A373', fontStyle: 'italic' },
  content: { padding: '60px 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 },
  infoCard: { background: '#231C1A', border: '1px solid #3A2E2A', borderRadius: '12px', padding: '40px' },
  subtitle: { fontFamily: '"Playfair Display", serif', fontSize: 24, color: '#D4A373', margin: '0 0 16px' },
  text: { color: '#B0A39C', lineHeight: 1.6, fontSize: 15, margin: 0 },
  hours: { marginTop: 32, paddingTop: 32, borderTop: '1px solid #3A2E2A' },
  hoursTitle: { fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#F9F6F0', marginBottom: 12 },
  mapContainer: { borderRadius: '12px', overflow: 'hidden', border: '1px solid #3A2E2A', minHeight: 300 }
};