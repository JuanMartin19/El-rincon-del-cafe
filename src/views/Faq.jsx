import React, { useState } from 'react';

const PREGUNTAS = [
  { q: '¿Puedo pedir para recoger en sucursal?', a: 'Sí. Al realizar tu pedido en el carrito, se procesará inmediatamente y estará listo para que pases a recogerlo en nuestra sucursal matriz en el centro histórico sin hacer filas.' },
  { q: '¿Tienen opciones de leche vegetal?', a: '¡Claro! En todas nuestras bebidas calientes y frías puedes elegir leche de Almendra, Avena o Soya desde el menú de opciones antes de añadir al carrito.' },
  { q: '¿Cuánto tiempo tarda en prepararse un pedido?', a: 'El tiempo estimado es de 5 a 10 minutos dependiendo del volumen de órdenes en tienda. Te sugerimos pedir cuando estés a unos minutos de la cafetería.' },
  { q: '¿Venden los granos de café enteros?', a: 'Sí, vendemos bolsas de 250g y 500g de nuestras mejores mezclas en la sucursal física. Próximamente estarán disponibles en nuestra tienda web.' }
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.eyebrow}>— Aclara tus dudas</div>
        <h1 style={s.title}>Preguntas <span style={s.accent}>Frecuentes</span></h1>
      </div>
      <div style={s.content}>
        {PREGUNTAS.map((item, idx) => (
          <div key={idx} style={s.accordion}>
            <button style={s.question} onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
              <span>{item.q}</span>
              <span style={{ color: '#D4A373' }}>{openIdx === idx ? '−' : '+'}</span>
            </button>
            {openIdx === idx && <div style={s.answer}>{item.a}</div>}
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
  accent: { color: '#D4A373', fontStyle: 'italic' },
  content: { padding: '60px 5%', maxWidth: 800, margin: '0 auto' },
  accordion: { borderBottom: '1px solid #3A2E2A', marginBottom: 16 },
  question: { width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontSize: 16, fontWeight: 600, color: '#F9F6F0', cursor: 'pointer', textAlign: 'left' },
  answer: { padding: '0 0 24px 0', color: '#B0A39C', fontSize: 15, lineHeight: 1.6 }
};