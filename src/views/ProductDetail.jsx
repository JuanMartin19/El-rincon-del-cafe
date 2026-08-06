import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { showToast } from '../components/ToastProvider';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext'; 

const OPTIONS = ['Normal', 'Deslactosada', 'Almendra', 'Avena', 'Soya'];
const NUTRITION_GUIDE = [
  { tipo: 'Normal', cal: '120 kcal', carb: '12g', pro: '8g' },
  { tipo: 'Deslactosada', cal: '110 kcal', carb: '12g', pro: '8g' },
  { tipo: 'Almendra', cal: '60 kcal', carb: '2g', pro: '1g' },
  { tipo: 'Avena', cal: '130 kcal', carb: '16g', pro: '3g' },
  { tipo: 'Soya', cal: '100 kcal', carb: '7g', pro: '7g' },
];
const noImageSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23231C1A'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13px' font-weight='bold' fill='%23B0A39C'%3ESin Foto%3C/text%3E%3C/svg%3E";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { isAutenticado, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartState, setCartState] = useState('idle');
  const [optionError, setOptionError] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    let cancelado = false;
    async function fetchData() {
      try {
        const [resProd, resPromo] = await Promise.all([
          fetch(`${API_URL}/productos/${id}`),
          fetch(`${API_URL}/promociones/activas`)
        ]);

        if (!resProd.ok) throw new Error('Producto no encontrado');
        const dataProd = await resProd.json();
        const dataPromo = await resPromo.ok ? await resPromo.json() : [];

        if (!cancelado) {
          setProduct({ ...dataProd, price: Number(dataProd.price) });
          setPromociones(dataPromo);
        }
      } catch (err) {
        console.error(err);
        if (!cancelado) setError(true);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    fetchData();
    return () => cancelado = true;
  }, [id]);

  useEffect(() => {
    if (isAutenticado && token && product) {
      fetch(`${API_URL}/favoritos`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setIsFav(data.some(p => p.id === product.id)); })
      .catch(console.error);
    }
  }, [isAutenticado, token, product]);

  const handleAddToCart = async () => {
    if (!isAutenticado) {
      showToast({ icon: '⚠️', title: 'Inicia sesión', sub: 'Para agregar al pedido' });
      return navigate('/login');
    }
    if (!selectedOption && product.type === 'Bebida') {
      setOptionError(true);
      return;
    }
    setOptionError(false);
    setCartState('added');

    if (socket) {
      socket.emit('accion_telefono', {
        tipo: 'NUEVO_PEDIDO',
        producto: product.name,
        preparacion: selectedOption || 'Estándar',
        precio: product.price
      });
    }

    try {
      await fetch(`${API_URL}/carrito/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ producto_id: product.id, cantidad: 1 })
      });
      showToast({ icon: '✓', title: 'Agregado al pedido', sub: product.name });
    } catch (err) {
      console.error(err);
      showToast({ icon: '✕', title: 'Error', sub: 'No se pudo agregar al carrito' });
    }
    setTimeout(() => setCartState('idle'), 2000);
  };

  const handleToggleFav = async () => {
    if (!isAutenticado) {
      showToast({ icon: '⚠️', title: 'Inicia sesión', sub: 'Para guardar tus favoritos' });
      return navigate('/login');
    }
    const prevFav = isFav;
    setIsFav(!prevFav);
    showToast({ icon: !prevFav ? '♥' : '♡', title: !prevFav ? 'Guardado en favoritos' : 'Eliminado de favoritos', sub: product.name });

    try {
      await fetch(`${API_URL}/favoritos/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ producto_id: product.id })
      });
    } catch (error) { console.error('Error al actualizar favorito', error); }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setOptionError(false);
  };

  if (loading) return <div style={{...s.root, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Cargando detalles...</div>;
  if (error || !product) return <div style={{...s.root, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}><p>No se pudo cargar el producto.</p><button onClick={() => navigate('/catalog')} style={s.ctaPrimary}>Volver al menú</button></div>;

  // ⚡ Calcular si este producto tiene una promoción activa asociada
  let precioFinal = product.price;
  let badgePromo = null;

  promociones.forEach(promo => {
    const idsEspecificos = promo.productos_ids ? promo.productos_ids.split(',').map(Number) : [];
    let aplica = idsEspecificos.length > 0 ? idsEspecificos.includes(product.id) : (promo.categoria_aplica === 'Todos' || product.category === promo.categoria_aplica);

    if (aplica) {
      if (promo.tipo === 'DESCUENTO') {
        precioFinal = product.price * (1 - promo.valor / 100);
        badgePromo = `${promo.valor}% OFF`;
      } else if (promo.tipo === '2X1') {
        badgePromo = '¡2x1!';
      } else if (promo.tipo === 'COMBO') {
        badgePromo = '¡Combo!';
      }
    }
  });

  const servidorBase = API_URL.replace('/api', '');
  const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `${servidorBase}${product.image}`) : noImageSvg;

  return (
    <div style={s.root}>
      <style>{GLOBAL_CSS}</style>
      <div style={s.breadcrumb}>
        <span style={s.breadcrumbLink} onClick={() => navigate('/catalog')}>Menú</span><span style={s.breadcrumbSep}>·</span>
        <span style={s.breadcrumbLink}>{product.category}</span><span style={s.breadcrumbSep}>·</span>
        <span style={s.breadcrumbCurrent}>{product.name}</span>
      </div>

      <div className="pd-grid">
        <div style={s.imgWrap}>
          <img
            src={imageUrl} alt={product.name} style={s.img}
            onError={(e) => { if (e.target.src !== noImageSvg) e.target.src = noImageSvg; }}
          />
          <span style={s.badge}>{product.type}</span>
          {badgePromo && <span style={s.promoBadge}>{badgePromo}</span>}
          <div style={s.stockBar}><span style={s.stockLabel}>Preparación</span><span style={s.stockSep} /><span style={s.stockCount}>5 min apróx.</span></div>
        </div>

        <div>
          <div style={s.eyebrow}>— Nuestra Cafetería</div>
          <h1 style={s.title}>{product.name}</h1>
          
          {/* ⚡ Precio con descuento y tachado si aplica */}
          <div style={s.priceRow}>
            {badgePromo && precioFinal < product.price ? (
              <>
                <span style={s.oldPrice}>${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                <span style={s.price}>${precioFinal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </>
            ) : (
              <span style={s.price}>${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            )}
          </div>

          {product.type === 'Bebida' && (
            <div style={s.sizeSection}>
              <div style={s.sizeHeader}><span style={s.sizeLabel}>Tipo de leche</span><button onClick={() => setIsModalOpen(true)} style={s.guideBtn}>Ver información nutrimental</button></div>
              <div style={s.sizeGrid}>
                {OPTIONS.map((option) => (
                  <button key={option} onClick={() => handleOptionSelect(option)} style={{ ...s.sizeBtn, ...(selectedOption === option ? s.sizeBtnActive : {}) }}>{option}</button>
                ))}
              </div>
              <div style={{ ...s.sizeMsg, color: optionError ? '#E24B4A' : '#D4A373', minHeight: 18 }}>{optionError ? 'Selecciona una opción' : selectedOption ? `Leche ${selectedOption} seleccionada` : ''}</div>
            </div>
          )}
          <div style={s.ctaGroup}>
            <button onClick={handleAddToCart} style={{ ...s.ctaPrimary, ...(cartState === 'added' ? s.ctaAdded : {}) }}>{cartState === 'added' ? '✓ Agregado al pedido' : '+ Añadir al pedido'}</button>
            <button onClick={handleToggleFav} style={s.ctaSecondary}>{isFav ? '♥ Guardado en favoritos' : '♡ Guardar en favoritos'}</button>
          </div>
          <div style={s.benefits}>{['Preparado al momento', 'Ingredientes seleccionados', 'Calidad garantizada'].map((b) => (<div key={b} style={s.benefit}><span style={s.benefitIcon}>✓</span>{b}</div>))}</div>
        </div>
      </div>

      {isModalOpen && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div style={s.modal}>
            <button onClick={() => setIsModalOpen(false)} style={s.modalClose}>✕</button>
            <div style={s.modalEyebrow}>Salud y Nutrición</div>
            <h3 style={s.modalTitle}>Información Nutrimental</h3>
            <p style={s.modalSub}>Valores aproximados por vaso</p>
            <table style={s.table}>
              <thead><tr>{['Opción', 'Calorías', 'Carbs', 'Proteína'].map((h) => (<th key={h} style={s.th}>{h}</th>))}</tr></thead>
              <tbody>{NUTRITION_GUIDE.map((row) => (<tr key={row.tipo} style={selectedOption === row.tipo ? s.trActive : {}}>{[row.tipo, row.cal, row.carb, row.pro].map((val, i) => (<td key={i} style={s.td}>{val}</td>))}</tr>))}</tbody>
            </table>
            <button onClick={() => setIsModalOpen(false)} style={s.modalCloseBtn}>Cerrar guía</button>
          </div>
        </div>
      )}
    </div>
  );
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap');
  .pd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
  @media (max-width: 768px) { .pd-grid { grid-template-columns: 1fr; gap: 32px; } }
`;

const s = {
  root: { background: '#16110F', minHeight: '100vh', color: '#F9F6F0', fontFamily: '"Inter", sans-serif', padding: '48px 5%' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 },
  breadcrumbLink: { fontSize: 11, color: '#B0A39C', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' },
  breadcrumbSep: { fontSize: 11, color: '#3A2E2A' },
  breadcrumbCurrent: { fontSize: 11, color: '#D4A373', letterSpacing: '0.08em', textTransform: 'uppercase' },
  imgWrap: { position: 'relative', overflow: 'hidden', background: '#231C1A', aspectRatio: '1/1', borderRadius: '12px' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  badge: { position: 'absolute', top: 14, left: 14, background: '#D4A373', color: '#16110F', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '4px' },
  promoBadge: { position: 'absolute', top: 14, left: 95, background: '#E24B4A', color: '#FFF', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '6px 10px', borderRadius: '4px' },
  stockBar: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(22,17,15,0.85)', backdropFilter: 'blur(4px)', padding: '14px', display: 'flex', alignItems: 'center', gap: 8 },
  stockLabel: { fontSize: 11, color: '#F9F6F0', letterSpacing: '0.08em', textTransform: 'uppercase' },
  stockSep: { flex: 1, height: 1, background: '#3A2E2A' },
  stockCount: { fontSize: 11, fontWeight: 700, color: '#D4A373', letterSpacing: '0.08em' },
  eyebrow: { fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4A373', fontWeight: 600, marginBottom: 12 },
  title: { fontFamily: '"Playfair Display", serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: '#F9F6F0', margin: '0 0 16px', lineHeight: 1.1 },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 12, margin: '0 0 28px' },
  oldPrice: { fontSize: 18, color: '#B0A39C', textDecoration: 'line-through' },
  price: { fontSize: 28, fontWeight: 600, color: '#D4A373' },
  sizeSection: { borderTop: '1px solid #3A2E2A', paddingTop: 24 },
  sizeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sizeLabel: { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F9F6F0' },
  guideBtn: { background: 'none', border: 'none', color: '#B0A39C', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'underline' },
  sizeGrid: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  sizeBtn: { padding: '10px 18px', border: '1px solid #3A2E2A', background: '#231C1A', color: '#B0A39C', borderRadius: '6px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  sizeBtnActive: { background: '#D4A373', color: '#16110F', borderColor: '#D4A373', fontWeight: 600 },
  sizeMsg: { fontSize: 12, marginTop: 10 },
  ctaGroup: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 },
  ctaPrimary: { background: '#D4A373', color: '#16110F', border: 'none', borderRadius: '8px', padding: '16px', width: '100%', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  ctaAdded: { background: '#231C1A', color: '#D4A373', border: '1px solid #D4A373' },
  ctaSecondary: { background: 'transparent', border: '1px solid #3A2E2A', borderRadius: '8px', color: '#B0A39C', padding: '14px', width: '100%', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  benefits: { borderTop: '1px solid #3A2E2A', marginTop: 32, paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12 },
  benefit: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#F9F6F0' },
  benefitIcon: { color: '#D4A373', fontSize: 16, flexShrink: 0 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(22,17,15,0.85)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { position: 'relative', background: '#231C1A', border: '1px solid #3A2E2A', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: 450 },
  modalClose: { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#B0A39C', cursor: 'pointer', fontSize: 20 },
  modalEyebrow: { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4A373', marginBottom: 12 },
  modalTitle: { fontFamily: '"Playfair Display", serif', fontSize: 24, color: '#F9F6F0', margin: '0 0 8px' },
  modalSub: { fontSize: 14, color: '#B0A39C', margin: '0 0 0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14, margin: '24px 0 32px' },
  th: { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0A39C', padding: '10px 0', borderBottom: '1px solid #3A2E2A', textAlign: 'left' },
  td: { padding: '12px 0', borderBottom: '1px solid #3A2E2A', color: '#F9F6F0' },
  trActive: { background: 'rgba(212,163,115,0.1)' },
  modalCloseBtn: { background: 'transparent', border: '1px solid #3A2E2A', borderRadius: '8px', color: '#B0A39C', padding: '12px', width: '100%', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' },
};