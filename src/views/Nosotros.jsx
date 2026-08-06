import React from 'react';

export default function Nosotros() {
  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.eyebrow}>— Nuestra Historia</div>
        <h1 style={s.title}>El Rincón del <span style={s.accent}>Café</span></h1>
      </div>
      <div style={s.content}>
        <div style={s.grid}>
          <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800" 
            alt="Barista preparando café" 
            style={s.image} 
          />
          <div style={s.textBlock}>
            <h2 style={s.subtitle}>Pasión por el detalle</h2>
            <p style={s.text}>
              Nacimos en 2020 con una idea simple pero poderosa: ofrecer una pausa perfecta en medio del caos diario. Creemos que una buena taza de café tiene el poder de cambiar tu día.
            </p>
            <p style={s.text}>
              Trabajamos de la mano con productores locales para asegurar que cada grano que llega a tu taza sea cultivado de manera ética y sostenible. Nuestro equipo de baristas está obsesionado con la extracción perfecta, la temperatura exacta y la sonrisa que te entregamos cada mañana.
            </p>
            <div style={s.stats}>
              <div><strong style={s.accent}>+5</strong><br/>Años de experiencia</div>
              <div><strong style={s.accent}>100%</strong><br/>Grano orgánico</div>
            </div>
          </div>
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
  content: { padding: '60px 5%' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' },
  image: { width: '100%', borderRadius: '12px', border: '1px solid #3A2E2A' },
  textBlock: { display: 'flex', flexDirection: 'column', gap: 20 },
  subtitle: { fontFamily: '"Playfair Display", serif', fontSize: 32, color: '#F9F6F0', margin: 0 },
  text: { color: '#B0A39C', lineHeight: 1.7, fontSize: 15 },
  stats: { display: 'flex', gap: 40, marginTop: 20, color: '#F9F6F0', fontSize: 14, letterSpacing: '0.05em' }
};