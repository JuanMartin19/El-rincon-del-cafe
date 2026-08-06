import React from 'react';

export default function Ayuda() {
  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.eyebrow}>— Estamos para apoyarte</div>
        <h1 style={s.title}>Centro de <span style={s.accent}>Ayuda</span></h1>
        <p style={s.heroSub}>¿Tienes algún problema con tu pedido o tu cuenta? Contáctanos.</p>
      </div>
      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.icon}>📦</div>
          <h3 style={s.cardTitle}>Problemas con mi Pedido</h3>
          <p style={s.text}>Si tu pedido llegó incompleto o con errores, envíanos tu número de ticket.</p>
          <a href="mailto:soporte@rincondelcafe.mx" style={s.btn}>Enviar Email</a>
        </div>
        <div style={s.card}>
          <div style={s.icon}>💳</div>
          <h3 style={s.cardTitle}>Dudas de Facturación</h3>
          <p style={s.text}>Si requieres factura de tus consumos de este mes, entra a nuestro portal.</p>
          <button style={s.btn}>Ir a Facturación</button>
        </div>
        <div style={s.card}>
          <div style={s.icon}>📱</div>
          <h3 style={s.cardTitle}>Contacto Directo</h3>
          <p style={s.text}>Llámanos o envíanos un WhatsApp para atención inmediata en horario laboral.</p>
          <a href="tel:+524421234567" style={s.btn}>Llamar ahora</a>
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
  heroSub: { color: '#B0A39C', marginTop: 16, fontSize: 15 },
  accent: { color: '#D4A373', fontStyle: 'italic' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, padding: '60px 5%' },
  card: { background: '#231C1A', border: '1px solid #3A2E2A', borderRadius: '12px', padding: '32px', textAlign: 'center' },
  icon: { fontSize: 40, marginBottom: 16 },
  cardTitle: { fontSize: 18, color: '#F9F6F0', marginBottom: 12 },
  text: { color: '#B0A39C', lineHeight: 1.5, fontSize: 14, marginBottom: 24 },
  btn: { display: 'inline-block', background: 'transparent', color: '#D4A373', border: '1px solid #D4A373', padding: '10px 20px', borderRadius: 6, textDecoration: 'none', fontSize: 12, textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }
};