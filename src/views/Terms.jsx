import React from 'react';
import { Link } from 'react-router-dom';

const wrap = { background: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0', fontFamily: 'system-ui, sans-serif', padding: '64px 5% 80px' };
const inner = { maxWidth: 760, margin: '0 auto' };
const back = { fontSize: 11, color: '#F0E040', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 };
const h1 = { fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '18px 0 6px' };
const updated = { fontSize: 12, color: '#555', marginBottom: 36 };
const h2 = { fontSize: 15, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F0E040', marginTop: 32, marginBottom: 10 };
const p = { fontSize: 13, color: '#999', lineHeight: 1.8, margin: '0 0 12px' };

export default function Terms() {
  return (
    <div style={wrap}>
      <div style={inner}>
        <Link to="/" style={back}>← Volver</Link>
        <h1 style={h1}>Términos de Uso</h1>
        <div style={updated}>Última actualización: julio 2026</div>

        <p style={p}>
          Este es un texto de ejemplo. Sustitúyelo por tus Términos y Condiciones reales,
          revisados idealmente por un especialista legal.
        </p>

        <h2 style={h2}>1. Aceptación de los términos</h2>
        <p style={p}>Al usar este sitio y realizar pedidos, el usuario acepta estos términos en su totalidad.</p>

        <h2 style={h2}>2. Pedidos y pagos</h2>
        <p style={p}>Describe métodos de pago aceptados, precios, disponibilidad de alimentos y bebidas, y políticas de cancelación de pedidos.</p>

        <h2 style={h2}>3. Entregas y recolección</h2>
        <p style={p}>Explica los tiempos de preparación, procesos para recoger en sucursal y opciones de entrega a domicilio.</p>

        <h2 style={h2}>4. Propiedad intelectual</h2>
        <p style={p}>El contenido del sitio (marca, imágenes, textos) es propiedad de El Rincón del Café o de sus licenciantes.</p>

        <h2 style={h2}>5. Limitación de responsabilidad</h2>
        <p style={p}>Define los límites de responsabilidad de la empresa respecto al uso del sitio y los productos alimenticios.</p>

        <h2 style={h2}>6. Contacto</h2>
        <p style={p}>Para dudas sobre estos términos, escribe a contacto@rincondelcafe.mx.</p>
      </div>
    </div>
  );
}