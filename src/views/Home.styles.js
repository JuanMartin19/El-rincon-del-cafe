export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap');

  .sd-cat-bar { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
  .sd-cat-bar::-webkit-scrollbar { display: none; }
  
  .sd-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 80px 5%; align-items: center; }
  .sd-hero-img { position: relative; }
  
  .sd-content { display: grid; grid-template-columns: 1fr 320px; gap: 40px; margin-top: 32px; }
  .sd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; }
  .sd-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 32px; }
  
  @media (max-width: 900px) {
    .sd-hero { grid-template-columns: 1fr; text-align: center; padding: 40px 5%; }
    .sd-hero-img { display: none; }
    .sd-content { grid-template-columns: 1fr; }
    .sd-sidebar { display: none; }
    .sd-contact-grid { grid-template-columns: 1fr; }
  }
`;

const bg = '#16110F';
const surface = '#231C1A';
const border = '#3A2E2A';
const accent = '#D4A373';
const textMain = '#F9F6F0';
const textMuted = '#B0A39C';

const s = {
  root: { background: bg, minHeight: '100vh', color: textMain, fontFamily: '"Inter", sans-serif' },
  
  ticker: { background: accent, color: '#16110F', padding: '10px', textAlign: 'center', fontSize: 13, fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 },
  tickerDot: { width: 6, height: 6, background: '#16110F', borderRadius: '50%' },
  
  catBar: { padding: '24px 5%', borderBottom: `1px solid ${border}` },
  catBtn: { padding: '8px 20px', borderRadius: '24px', border: `1px solid ${border}`, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', textTransform: 'capitalize' },
  
  heroLeft: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  heroEyebrow: { fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: 16 },
  heroTitle: { fontFamily: '"Playfair Display", serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.1, color: textMain, margin: '0 0 20px' },
  heroAccent: { color: accent, fontStyle: 'italic' },
  heroSub: { fontSize: 16, color: textMuted, lineHeight: 1.6, marginBottom: 32, maxWidth: '90%' },
  heroCtas: { display: 'flex', gap: 16 },
  ctaPrimary: { background: accent, color: '#16110F', border: 'none', padding: '14px 28px', borderRadius: '8px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' },
  ctaSecondary: { background: 'transparent', border: `1px solid ${border}`, color: textMain, padding: '14px 28px', borderRadius: '8px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' },
  
  heroImg: { width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  heroBadge: { position: 'absolute', bottom: -20, left: -20, background: surface, color: accent, padding: '16px 24px', borderRadius: '8px', fontSize: 13, fontWeight: 600, border: `1px solid ${border}`, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
  heroWatermark: { display: 'none' },
  
  promoStrip: { 
    background: '#D4A373', 
    padding: '24px 5%', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    flexWrap: 'wrap', 
    gap: 16,
    position: 'relative',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    margin: '0 0 20px 0'
  },
  promoTitle: { fontSize: 20, fontWeight: 700, color: '#16110F', marginBottom: 4, fontFamily: '"Playfair Display", serif' },
  promoSub: { fontSize: 14, color: '#231C1A' },
  ctaPromo: { background: '#16110F', color: '#D4A373', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' },
  
  leaderboardWrap: { display: 'none' },
  
  featured: { padding: '60px 5%' },
  sectionHeader: { marginBottom: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  sectionEyebrow: { fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: 12 },
  sectionTitle: { fontFamily: '"Playfair Display", serif', fontSize: 36, fontWeight: 700, color: textMain, margin: '0 0 12px' },
  sectionSub: { fontSize: 16, color: textMuted },
  
  adLabel: { fontSize: 11, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 },
  mrect: { position: 'relative', height: 250, borderRadius: '12px', overflow: 'hidden', marginBottom: 32 },
  mrectOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,17,15,0.9), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24 },
  mrectTitle: { fontFamily: '"Playfair Display", serif', fontSize: 20, color: textMain, marginBottom: 16 },
  mrectCta: { background: accent, color: '#16110F', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: 'fit-content' },
  halfpage: { position: 'relative', height: 400, borderRadius: '12px', overflow: 'hidden' },
  halfpageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,17,15,0.9), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24 },
  halfpageTitle: { fontFamily: '"Playfair Display", serif', fontSize: 24, color: accent, marginBottom: 8 },
  halfpageSub: { fontSize: 15, color: textMain, marginBottom: 16 },
  
  contactSection: { padding: '60px 5%', borderTop: `1px solid ${border}`, background: surface },
  
  card: { borderRadius: '12px', overflow: 'hidden', background: surface, border: `1px solid ${border}`, transition: 'all 0.3s ease' },
  cardImgWrap: { position: 'relative', height: 240, overflow: 'hidden' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
  cardBadge: { position: 'absolute', top: 12, left: 12, background: accent, color: '#16110F', padding: '4px 12px', borderRadius: '4px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' },
  favBtn: { position: 'absolute', top: 12, right: 12, background: 'rgba(22,17,15,0.4)', border: `1px solid ${border}`, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all 0.2s' },
  cardNum: { display: 'none' },
  cardBody: { padding: '20px' },
  cardMeta: { fontSize: 12, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
  cardName: { fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 600, color: textMain, marginBottom: 12 },
  cardPrice: { fontSize: 18, fontWeight: 600, color: accent, marginBottom: 20 },
  cardActions: { display: 'flex', gap: 10 },
  cardBtnPrimary: { flex: 1, background: accent, border: 'none', color: '#16110F', padding: '10px 0', borderRadius: '6px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  cardBtnSecondary: { padding: '10px 16px', border: `1px solid ${border}`, background: 'transparent', borderRadius: '6px', color: textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  
  notif: { position: 'fixed', bottom: 24, right: 24, background: surface, border: `1px solid ${border}`, borderRadius: '12px', padding: 20, width: 320, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 50 },
  notifHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  notifLabel: { fontSize: 12, color: accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  notifClose: { background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: 16 },
  notifMsg: { fontSize: 14, color: textMain, lineHeight: 1.5, marginBottom: 16 },
  notifCta: { width: '100%', background: accent, color: '#16110F', border: 'none', padding: '10px', borderRadius: '6px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  
  nlOverlay: { position: 'fixed', inset: 0, background: 'rgba(22,17,15,0.8)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  nlModal: { background: surface, border: `1px solid ${border}`, borderRadius: '16px', padding: '40px', width: '100%', maxWidth: 400, position: 'relative', textAlign: 'center' },
  nlClose: { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: 18 },
  nlEyebrow: { fontSize: 12, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 12 },
  nlTitle: { fontFamily: '"Playfair Display", serif', fontSize: 28, color: textMain, margin: '0 0 16px' },
  nlSub: { fontSize: 15, color: textMuted, lineHeight: 1.5, marginBottom: 24 },
  nlForm: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 },
  nlInput: { background: bg, border: `1px solid ${border}`, padding: '14px', borderRadius: '8px', color: textMain, fontSize: 14, outline: 'none' },
  nlSkip: { background: 'none', border: 'none', color: textMuted, fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }
};

export default s;