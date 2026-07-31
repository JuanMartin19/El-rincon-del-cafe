import React from 'react';

// ─── Skeleton base ─────────────────────────────────────────────────────────
function Skel({ style = {} }) {
  return (
    <div
      aria-hidden="true"
      style={{
        background: '#1E1E1E',
        borderRadius: '10px',
        animation: 'skeletonPulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export default function LoadingView() {
  return (
    <div
      className="loading-root"
      aria-busy="true"
      aria-live="polite"
      style={{ background: '#0A0A0A', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}
    >
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }

        /* ── Responsive helpers ─────────────────────────────────────── */
        .lv-nav-links   { display: flex; gap: 20px; }
        .lv-nav-actions { display: flex; gap: 10px; }
        .lv-hero        { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .lv-products    { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .lv-content-wrap { display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: start; }
        .lv-footer-grid  { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }

        @media (max-width: 1024px) {
          .lv-content-wrap { grid-template-columns: 1fr; }
          .lv-display-banner-col { display: none; }
        }

        @media (max-width: 768px) {
          .lv-nav-links   { display: none; }
          .lv-hero        { grid-template-columns: 1fr; }
          .lv-hero-img    { display: none; }
          .lv-products    { grid-template-columns: 1fr; }
          .lv-footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
        }

        @media (max-width: 480px) {
          .lv-nav-actions { gap: 6px; }
          .lv-footer-grid { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>

      {/* ── Banner superior skeleton ──────────────────────────────────── */}
      <Skel style={{ height: '38px', borderRadius: 0, background: '#111' }} />

      {/* ── Nav skeleton ─────────────────────────────────────────────── */}
      <div style={{
        background: '#0A0A0A',
        borderBottom: '1px solid #1E1E1E',
        padding: '14px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Skel style={{ height: '22px', width: '140px' }} />
        <div className="lv-nav-links">
          {[80, 70].map((w, i) => (
            <Skel key={i} style={{ height: '14px', width: `${w}px` }} />
          ))}
        </div>
        <div className="lv-nav-actions">
          <Skel style={{ height: '34px', width: '70px', borderRadius: '8px' }} />
          <Skel style={{ height: '34px', width: '80px', borderRadius: '10px' }} />
        </div>
      </div>

      {/* ── Hero skeleton ─────────────────────────────────────────────── */}
      <div style={{ background: '#0A0A0A', padding: '60px 5%' }}>
        <div className="lv-hero">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Skel style={{ height: '28px', width: '180px', background: '#111' }} />
            <Skel style={{ height: '52px', width: '90%', background: '#111' }} />
            <Skel style={{ height: '52px', width: '70%', background: '#111' }} />
            <Skel style={{ height: '18px', width: '85%', background: '#111' }} />
            <Skel style={{ height: '18px', width: '60%', background: '#111' }} />
            <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
              <Skel style={{ height: '46px', width: '140px', borderRadius: '12px', background: '#111' }} />
              <Skel style={{ height: '46px', width: '140px', borderRadius: '12px', background: '#111' }} />
            </div>
          </div>
          <div className="lv-hero-img">
            <Skel style={{ height: '300px', borderRadius: '22px', background: '#111' }} />
          </div>
        </div>
      </div>

      {/* ── Promo banner skeleton ─────────────────────────────────────── */}
      <div style={{
        background: '#111',
        padding: '36px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderTop: '1px solid #1E1E1E',
        borderBottom: '1px solid #1E1E1E'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Skel style={{ height: '20px', width: '280px', background: '#1A1A1A' }} />
          <Skel style={{ height: '14px', width: '200px', background: '#1A1A1A' }} />
        </div>
        <Skel style={{ height: '46px', width: '130px', borderRadius: '12px', background: '#1A1A1A' }} />
      </div>

      {/* ── Contenido principal + Banner display lateral ──────────────── */}
      <div style={{ padding: '56px 5%' }}>
        <div className="lv-content-wrap">

          {/* Columna principal: productos */}
          <section>
            <div style={{ textAlign: 'center', marginBottom: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Skel style={{ height: '34px', width: '280px' }} />
              <Skel style={{ height: '16px', width: '220px' }} />
            </div>

            <div className="lv-products">
              {[1, 2, 3].map(n => (
                <div key={n} style={{
                  background: '#0F0F0F',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid #1E1E1E',
                }}>
                  <Skel style={{ height: '210px', borderRadius: 0, background: '#111' }} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Skel style={{ height: '12px', width: '100px', background: '#1A1A1A' }} />
                    <Skel style={{ height: '18px', width: '140px', background: '#1A1A1A' }} />
                    <Skel style={{ height: '22px', width: '80px', background: '#1A1A1A' }} />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <Skel style={{ flex: 1, height: '42px', borderRadius: '12px', background: '#1A1A1A' }} />
                      <Skel style={{ height: '42px', width: '80px', borderRadius: '12px', background: '#1A1A1A' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Banner display lateral 300×250 (Medium Rectangle) ─────── */}
          <aside
            className="lv-display-banner-col"
            aria-label="Espacio publicitario"
            style={{ position: 'sticky', top: '24px' }}
          >
            {/* Leaderboard-style label */}
            <div style={{
              fontSize: '10px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '4px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Promoción
            </div>

            {/* 300×250 Medium Rectangle */}
            <div style={{
              width: '300px',
              height: '250px',
              background: '#0F0F0F',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #1E1E1E',
            }}>
              <Skel style={{ height: '140px', borderRadius: 0, background: '#111' }} />
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skel style={{ height: '14px', width: '80%', background: '#1A1A1A' }} />
                <Skel style={{ height: '12px', width: '60%', background: '#1A1A1A' }} />
                <Skel style={{ height: '34px', width: '120px', borderRadius: '8px', marginTop: '4px', background: '#1A1A1A' }} />
              </div>
            </div>

            {/* Segundo banner display 300×600 (Half Page) — más abajo */}
            <div style={{ marginTop: '24px' }}>
              <div style={{
                fontSize: '10px',
                color: '#666',
                textAlign: 'center',
                marginBottom: '4px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Acompañamiento
              </div>
              <div style={{
                width: '300px',
                height: '250px',
                background: '#0F0F0F',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #1E1E1E',
              }}>
                <Skel style={{ height: '100%', borderRadius: 0, background: '#111' }} />
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* ── Footer skeleton ───────────────────────────────────────────── */}
      <footer style={{ background: '#0A0A0A', padding: '56px 5% 32px', borderTop: '1px solid #1E1E1E' }}>
        <div className="lv-footer-grid" style={{ marginBottom: '40px' }}>
          {/* Columna marca */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Skel style={{ height: '24px', width: '130px', background: '#111' }} />
            <Skel style={{ height: '13px', width: '90%', background: '#111' }} />
            <Skel style={{ height: '13px', width: '75%', background: '#111' }} />
            {/* Redes sociales */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {[1, 2, 3].map(i => (
                <Skel key={i} style={{ height: '32px', width: '32px', borderRadius: '50%', background: '#111' }} />
              ))}
            </div>
          </div>

          {/* Columnas de links */}
          {[
            ['Cafetería', 4],
            ['Soporte', 3],
            ['Legal', 2],
          ].map(([, count], colIdx) => (
            <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skel style={{ height: '14px', width: '90px', background: '#111' }} />
              {Array.from({ length: count }).map((_, i) => (
                <Skel key={i} style={{ height: '12px', width: `${60 + i * 10}px`, background: '#111' }} />
              ))}
            </div>
          ))}
        </div>

        {/* Divider + copyright */}
        <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <Skel style={{ height: '12px', width: '220px', background: '#111' }} />
          <div style={{ display: 'flex', gap: '16px' }}>
            {[80, 90].map((w, i) => (
              <Skel key={i} style={{ height: '12px', width: `${w}px`, background: '#111' }} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}