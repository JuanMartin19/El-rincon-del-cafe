import React from 'react';
import { Link } from 'react-router-dom';

const wrap = { background: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0', fontFamily: 'system-ui, sans-serif', padding: '64px 5% 80px' };
const inner = { maxWidth: 760, margin: '0 auto' };
const back = { fontSize: 11, color: '#F0E040', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 };
const h1 = { fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '18px 0 6px' };
const updated = { fontSize: 12, color: '#555', marginBottom: 36 };
const h2 = { fontSize: 15, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F0E040', marginTop: 32, marginBottom: 10 };
const p = { fontSize: 13, color: '#999', lineHeight: 1.8, margin: '0 0 12px' };

export default function Privacy() {
  return (
    <div style={wrap}>
      <div style={inner}>
        <Link to="/" style={back}>← Volver</Link>
        <h1 style={h1}>Aviso de Privacidad</h1>
        <div style={updated}>Última actualización: julio 2026</div>

        <p style={p}>
          Este es un texto de ejemplo. Sustituye este contenido por tu Aviso de Privacidad real,
          idealmente revisado por un especialista legal, conforme a la Ley Federal de Protección
          de Datos Personales en Posesión de los Particulares (México) o la normativa que
          corresponda a tu jurisdicción.
        </p>

        <h2 style={h2}>1. Datos que recopilamos</h2>
        <p style={p}>Describe aquí qué datos personales recolectas (nombre, correo, teléfono, historial de pedidos, etc.) y por qué medios (formularios, cuenta de usuario, cookies).</p>

        <h2 style={h2}>2. Uso de los datos</h2>
        <p style={p}>Explica las finalidades del tratamiento de datos: procesar pedidos de cafetería, enviar promociones, mejorar el servicio, cumplir obligaciones legales.</p>

        <h2 style={h2}>3. Derechos ARCO</h2>
        <p style={p}>Indica cómo el usuario puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición sobre sus datos personales, y el correo o medio de contacto para hacerlo.</p>

        <h2 style={h2}>4. Cookies</h2>
        <p style={p}>Describe el uso de cookies y tecnologías similares en el sitio, y cómo el usuario puede gestionarlas.</p>

        <h2 style={h2}>5. Contacto</h2>
        <p style={p}>Para dudas sobre este aviso, escribe a contacto@rincondelcafe.mx.</p>
      </div>
    </div>
  );
}