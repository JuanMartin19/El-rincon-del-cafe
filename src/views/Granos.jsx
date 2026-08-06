import React from 'react';

const GRANOS = [
  { nombre: 'Mezcla Veracruz', tueste: 'Medio-Oscuro', notas: 'Chocolate amargo, nuez, piloncillo', origen: 'Veracruz, México' },
  { nombre: 'Supremo Colombia', tueste: 'Medio', notas: 'Caramelo, frutos rojos, acidez cítrica', origen: 'Antioquia, Colombia' },
  { nombre: 'Kenia AA', tueste: 'Claro', notas: 'Frutos negros, floral, cuerpo jugoso', origen: 'Nyeri, Kenia' },
];

export default function Granos() {
  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.eyebrow}>— Orígenes Selectos</div>
        <h1 style={s.title}>Nuestros <span style={s.accent}>Granos</span></h1>
        <p style={s.heroSub}>Descubre la procedencia y el perfil de sabor detrás de cada taza.</p>
      </div>
      <div style={s.grid}>
        {GRANOS.map((g) => (
          <div key={g.nombre} style={s.card}>
            <div style={s.cardBadge}>{g.origen}</div>
            <h3 style={s.cardTitle}>{g.nombre}</h3>
            <div style={s.cardRow}><span>Tueste:</span> <span style={s.accent}>{g.tueste}</span></div>
            <div style={s.cardRow}><span>Notas:</span> <span style={s.accent}>{g.notas}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { background: '#16110F', minHeight: 'calc(100vh - 64px)', color: '#F9F6F0', fontFamily: '"Inter", sans-serif' },
  hero: { padding: '60px 5% 40px', borderBottom: '1px solid #3A2E2A', textAlign: 'center' },
  eyebrow: { fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4A373', fontWeight: 600, marginBottom: 16 },
  title: { fontFamily: '"Playfair Display", serif', fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 700, margin: 0 },
  heroSub: { color: '#B0A39C', marginTop: 16, fontSize: 15 },
  accent: { color: '#D4A373', fontStyle: 'italic' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, padding: '60px 5%' },
  card: { background: '#231C1A', border: '1px solid #3A2E2A', borderRadius: '12px', padding: '32px', position: 'relative' },
  cardBadge: { position: 'absolute', top: 16, right: 16, background: '#16110F', color: '#B0A39C', padding: '4px 10px', fontSize: 11, borderRadius: 4, border: '1px solid #3A2E2A' },
  cardTitle: { fontFamily: '"Playfair Display", serif', fontSize: 24, margin: '0 0 20px', color: '#F9F6F0' },
  cardRow: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #3A2E2A', padding: '12px 0', fontSize: 14, color: '#B0A39C' }
};