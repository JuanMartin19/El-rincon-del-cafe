import React, { useState } from 'react';

// Ahora son opciones de preparación o complementos (ej. tamaño o tipo de leche)
const OPTIONS = ['Normal', 'Deslactosada', 'Almendra', 'Avena', 'Soya'];

const NUTRITION_GUIDE = [
  { tipo: 'Normal', cal: '120 kcal', carb: '12g', pro: '8g' },
  { tipo: 'Deslactosada', cal: '110 kcal', carb: '12g', pro: '8g' },
  { tipo: 'Almendra', cal: '60 kcal', carb: '2g', pro: '1g' },
  { tipo: 'Avena', cal: '130 kcal', carb: '16g', pro: '3g' },
  { tipo: 'Soya', cal: '100 kcal', carb: '7g', pro: '7g' },
];

export default function ProductDetail() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartState, setCartState] = useState('idle'); // 'idle' | 'added'
  const [optionError, setOptionError] = useState(false);

  const handleAddToCart = () => {
    if (!selectedOption) {
      setOptionError(true);
      return;
    }
    setOptionError(false);
    setCartState('added');
    setTimeout(() => setCartState('idle'), 2000);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setOptionError(false);
  };

  return (
    <div style={s.root}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div style={s.breadcrumb}>
        <span style={s.breadcrumbLink}>Menú</span>
        <span style={s.breadcrumbSep}>·</span>
        <span style={s.breadcrumbLink}>Frío</span>
        <span style={s.breadcrumbSep}>·</span>
        <span style={s.breadcrumbCurrent}>Frappé Caramelo</span>
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="pd-grid">

        {/* Imagen */}
        <div style={s.imgWrap}>
          <img
            src="https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600"
            alt="Frappé Caramelo"
            style={s.img}
          />
          <span style={s.badge}>Top</span>
          <div style={s.stockBar}>
            <span style={s.stockLabel}>Preparación</span>
            <span style={s.stockSep} />
            <span style={s.stockCount}>5 min apróx.</span>
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={s.eyebrow}>— Especialidades</div>
          <h1 style={s.title}>Frappé<br />Caramelo</h1>

          {/* Precio */}
          <div style={s.priceRow}>
            <span style={s.price}>$85.00</span>
            <span style={s.priceOld}>$95.00</span>
            <span style={s.discount}>-10%</span>
          </div>

          {/* Opciones */}
          <div style={s.sizeSection}>
            <div style={s.sizeHeader}>
              <span style={s.sizeLabel}>Tipo de leche</span>
              <button onClick={() => setIsModalOpen(true)} style={s.guideBtn}>
                Ver información nutrimental
              </button>
            </div>
            <div style={s.sizeGrid}>
              {OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  style={{
                    ...s.sizeBtn,
                    ...(selectedOption === option ? s.sizeBtnActive : {}),
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            <div style={{ ...s.sizeMsg, color: optionError ? '#E24B4A' : '#F0E040', minHeight: 18 }}>
              {optionError
                ? 'Selecciona una opción de preparación'
                : selectedOption
                ? `Leche ${selectedOption} seleccionada`
                : ''}
            </div>
          </div>

          {/* CTAs */}
          <div style={s.ctaGroup}>
            <button
              onClick={handleAddToCart}
              style={{
                ...s.ctaPrimary,
                ...(cartState === 'added' ? s.ctaAdded : {}),
              }}
            >
              {cartState === 'added' ? '✓ Agregado al pedido' : '+ Añadir al pedido'}
            </button>
            <button style={s.ctaSecondary}>♡ Guardar en favoritos</button>
          </div>

          {/* Beneficios */}
          <div style={s.benefits}>
            {[
              'Preparado al momento',
              'Personalización sin costo adicional',
              'Grano de especialidad local',
            ].map((b) => (
              <div key={b} style={s.benefit}>
                <span style={s.benefitIcon}>✓</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal: Guía Nutrimental ───────────────────────────────────────── */}
      {isModalOpen && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div style={s.modal}>
            <button onClick={() => setIsModalOpen(false)} style={s.modalClose} aria-label="Cerrar">✕</button>
            <div style={s.modalEyebrow}>Salud y Nutrición</div>
            <h3 style={s.modalTitle}>Información Nutrimental</h3>
            <p style={s.modalSub}>Valores aproximados por vaso (400ml)</p>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Opción', 'Calorías', 'Carbs', 'Proteína'].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NUTRITION_GUIDE.map((row) => (
                  <tr key={row.tipo} style={selectedOption === row.tipo ? s.trActive : {}}>
                    {[row.tipo, row.cal, row.carb, row.pro].map((val, i) => (
                      <td key={i} style={s.td}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setIsModalOpen(false)} style={s.modalCloseBtn}>
              Cerrar guía
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Global CSS (responsive) ──────────────────────────────────────────────
const GLOBAL_CSS = `
  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .pd-grid { grid-template-columns: 1fr; gap: 32px; }
  }
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
`;

// ─── Styles ───────────────────────────────────────────────────────────────
const s = {
  root: {
    background: '#0A0A0A',
    minHeight: '100vh',
    color: '#F5F5F0',
    fontFamily: 'system-ui, sans-serif',
    padding: '48px 5%',
  },

  breadcrumb: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 },
  breadcrumbLink: { fontSize: 11, color: '#444', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' },
  breadcrumbSep: { fontSize: 11, color: '#2A2A2A' },
  breadcrumbCurrent: { fontSize: 11, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' },

  // Imagen
  imgWrap: { position: 'relative', overflow: 'hidden', background: '#111', aspectRatio: '1/1' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(10%)' },
  badge: { position: 'absolute', top: 14, left: 0, background: '#F0E040', color: '#0A0A0A', fontSize: 9, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '5px 12px' },
  stockBar: { position: 'absolute', bottom: 0, left: 0, right: 0, background: '#0A0A0A', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 },
  stockLabel: { fontSize: 10, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' },
  stockSep: { flex: 1, height: 1, background: '#1E1E1E' },
  stockCount: { fontSize: 10, fontWeight: 900, color: '#F0E040', letterSpacing: '0.08em' },

  // Info
  eyebrow: { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F0E040', fontWeight: 900, marginBottom: 12 },
  title: { fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#F5F5F0', margin: '0 0 16px', lineHeight: 0.96 },

  priceRow: { display: 'flex', alignItems: 'baseline', gap: 12, margin: '0 0 28px' },
  price: { fontSize: 28, fontWeight: 900, color: '#F5F5F0', letterSpacing: '-0.02em' },
  priceOld: { fontSize: 14, color: '#444', textDecoration: 'line-through' },
  discount: { background: '#F0E040', color: '#0A0A0A', fontSize: 9, fontWeight: 900, letterSpacing: '0.12em', padding: '3px 8px' },

  // Opciones
  sizeSection: { borderTop: '1px solid #1E1E1E', paddingTop: 24 },
  sizeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sizeLabel: { fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F5F5F0' },
  guideBtn: { background: 'none', border: 'none', color: '#555', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.06em' },
  sizeGrid: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  sizeBtn: { padding: '10px 16px', border: '1px solid #2A2A2A', background: '#1A1A1A', color: '#F5F5F0', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
  sizeBtnActive: { background: '#F0E040', color: '#0A0A0A', borderColor: '#F0E040' },
  sizeMsg: { fontSize: 11, marginTop: 10, letterSpacing: '0.04em' },

  // CTAs
  ctaGroup: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 },
  ctaPrimary: { background: '#F0E040', color: '#0A0A0A', border: 'none', padding: 16, width: '100%', fontSize: 11, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  ctaAdded: { background: '#1A1A1A', color: '#F0E040', border: '1px solid #F0E040' },
  ctaSecondary: { background: 'transparent', border: '1px solid #2A2A2A', color: '#888', padding: 14, width: '100%', fontSize: 11, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },

  // Beneficios
  benefits: { borderTop: '1px solid #1E1E1E', marginTop: 28, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 },
  benefit: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#555' },
  benefitIcon: { color: '#F0E040', fontSize: 12, flexShrink: 0 },

  // Modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { position: 'relative', background: '#0F0F0F', border: '1px solid #2A2A2A', padding: '32px', width: '100%', maxWidth: 450 },
  modalClose: { position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, fontFamily: 'inherit' },
  modalEyebrow: { fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F0E040', marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#F5F5F0', margin: '0 0 4px' },
  modalSub: { fontSize: 12, color: '#555', margin: '0 0 0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13, margin: '20px 0 28px' },
  th: { fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', padding: '8px 0', borderBottom: '1px solid #1E1E1E', textAlign: 'left' },
  td: { padding: '10px 0', borderBottom: '1px solid #1A1A1A', color: '#F5F5F0' },
  trActive: { background: 'rgba(240,224,64,0.06)' },
  modalCloseBtn: { background: 'transparent', border: '1px solid #2A2A2A', color: '#888', padding: 12, width: '100%', fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
};