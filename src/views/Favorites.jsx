import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastProvider';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const fmt = (n) => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 });
const noImageSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23231C1A'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13px' font-weight='bold' fill='%23B0A39C'%3ESin Foto%3C/text%3E%3C/svg%3E";

export default function Favorites() {
  const navigate = useNavigate();
  const { isAutenticado, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAutenticado) {
      showToast({ icon: '⚠️', title: 'Inicia sesión', sub: 'Para ver tus favoritos' });
      navigate('/login');
      return;
    }
    async function fetchData() {
      try {
        const [resFav, resPromo] = await Promise.all([
          fetch(`${API_URL}/favoritos`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/promociones/activas`)
        ]);

        if (resFav.ok) {
          const dataFav = await resFav.json();
          setFavorites(dataFav.map(p => ({ ...p, price: Number(p.price) })));
        }
        if (resPromo.ok) {
          const dataPromo = await resPromo.json();
          setPromociones(dataPromo);
        }
      } catch (error) { console.error('Error al cargar datos', error); } 
      finally { setLoading(false); }
    }
    fetchData();
  }, [isAutenticado, navigate, token]);

  const remove = async (id) => {
    const item = favorites.find((p) => p.id === id);
    setFavorites((f) => f.filter((p) => p.id !== id));
    showToast({ icon: '♡', title: 'Eliminado de favoritos', sub: item?.name });

    try {
      await fetch(`${API_URL}/favoritos/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ producto_id: id })
      });
    } catch (error) { console.error('Error al sincronizar', error); }
  };

  const addToCart = async (product) => {
    if (!isAutenticado) {
      showToast({ icon: '⚠️', title: 'Inicia sesión', sub: 'Para agregar al pedido' });
      return navigate('/login');
    }
    try {
      const res = await fetch(`${API_URL}/carrito/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ producto_id: product.id, cantidad: 1 })
      });
      if (res.ok) showToast({ icon: '✓', title: 'Agregado al pedido', sub: product.name });
      else showToast({ icon: '✕', title: 'Error', sub: 'No se pudo agregar al carrito' });
    } catch (err) {
      console.error(err);
      showToast({ icon: '✕', title: 'Error de red', sub: 'Intenta de nuevo' });
    }
  };

  if (loading) return <div style={{...s.page, display: 'flex', justifyContent: 'center'}}>Cargando tu lista...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.eyebrow}>— Mi lista</div>
        <h1 style={s.title}>Favoritos</h1>
        <span style={s.count}><span style={s.countNum}>{favorites.length}</span> guardados</span>
      </div>

      {favorites.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>♡</div>
          <p style={s.emptyText}>No tienes favoritos guardados</p>
          <button onClick={() => navigate('/catalog')} style={s.emptyBtn}>Explorar menú →</button>
        </div>
      ) : (
        <div style={s.grid}>
          {favorites.map((product, idx) => (
            <FavCard
              key={product.id}
              product={product}
              promociones={promociones}
              index={idx}
              onRemove={() => remove(product.id)}
              onAddCart={() => addToCart(product)}
              onView={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FavCard({ product, promociones, index, onRemove, onAddCart, onView }) {
  const [hovered, setHovered] = useState(false);
  const servidorBase = API_URL.replace('/api', '');
  const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `${servidorBase}${product.image}`) : noImageSvg;

  // ⚡ Calcular promoción para favoritos
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

  return (
    <div
      style={{ ...s.card, background: hovered ? '#2C2321' : '#231C1A' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.imgWrap}>
        <img 
          src={imageUrl} 
          alt={product.name} 
          style={{ ...s.img, transform: hovered ? 'scale(1.04)' : 'scale(1)' }} 
          onError={(e) => { if (e.target.src !== noImageSvg) e.target.src = noImageSvg; }}
        />
        <span style={s.brandTag}>{product.category}</span>
        {badgePromo && <span style={s.promoBadge}>{badgePromo}</span>}
        <span style={s.cardNum} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <button onClick={onRemove} style={s.removeBtn} title="Quitar de favoritos">✕</button>
      </div>
      <div style={s.cardBody}>
        <div style={s.cardName}>{product.name}</div>
        <div style={s.cardSize}>{product.type}</div>
        
        <div style={s.priceWrapper}>
          {badgePromo && precioFinal < product.price ? (
            <>
              <span style={s.oldPrice}>{fmt(product.price)}</span>
              <span style={s.cardPrice}>{fmt(precioFinal)}</span>
            </>
          ) : (
            <span style={s.cardPrice}>{fmt(product.price)}</span>
          )}
        </div>

        <div style={s.cardActions}>
          <button 
            onClick={onAddCart} 
            style={{ ...s.cardBtnPrimary, background: hovered ? '#D4A373' : 'transparent', color: hovered ? '#16110F' : '#D4A373', borderColor: hovered ? '#D4A373' : '#3A2E2A' }}
          >
            + Pedido
          </button>
          <button onClick={onView} style={{ ...s.cardBtnSecondary, borderColor: hovered ? '#4A3D36' : '#3A2E2A' }}>Ver →</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#16110F', minHeight: 'calc(100vh - 56px)', color: '#F9F6F0', fontFamily: '"Inter", sans-serif' },
  header: { padding: '48px 5% 32px', borderBottom: '1px solid #3A2E2A', display: 'flex', flexDirection: 'column', gap: 6 },
  eyebrow: { fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4A373', fontWeight: 600 },
  title: { fontFamily: '"Playfair Display", serif', fontSize: 48, fontWeight: 700, textTransform: 'uppercase', color: '#F9F6F0', margin: 0, lineHeight: 1 },
  count: { fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0A39C', marginTop: 4 },
  countNum: { color: '#D4A373', fontWeight: 700, fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24, padding: '32px 5%' },
  card: { borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'background 0.2s', border: '1px solid #3A2E2A' },
  imgWrap: { position: 'relative', overflow: 'hidden', height: 220, background: '#231C1A' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' },
  brandTag: { position: 'absolute', top: 12, left: 12, background: '#D4A373', color: '#16110F', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', padding: '4px 12px', borderRadius: '4px' },
  promoBadge: { position: 'absolute', top: 12, left: 90, background: '#E24B4A', color: '#FFF', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '4px' },
  cardNum: { position: 'absolute', bottom: 6, right: 10, fontSize: 56, fontWeight: 700, color: 'rgba(255,255,255,0.05)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' },
  removeBtn: { position: 'absolute', top: 12, right: 12, background: 'rgba(22,17,15,0.6)', border: '1px solid #3A2E2A', color: '#B0A39C', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, borderRadius: '50%', backdropFilter: 'blur(4px)' },
  cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: 4 },
  cardName: { fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 600, color: '#F9F6F0', marginBottom: 4 },
  cardSize: { fontSize: 13, color: '#B0A39C', marginBottom: 12 },
  priceWrapper: { display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 },
  oldPrice: { fontSize: 13, color: '#B0A39C', textDecoration: 'line-through' },
  cardPrice: { fontSize: 18, fontWeight: 600, color: '#D4A373', margin: 0 },
  cardActions: { display: 'flex', gap: 10 },
  cardBtnPrimary: { flex: 1, border: '1px solid #3A2E2A', padding: '10px 0', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: '6px' },
  cardBtnSecondary: { background: 'transparent', border: '1px solid #3A2E2A', color: '#B0A39C', padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', borderRadius: '6px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 },
  emptyIcon: { fontSize: 48, color: '#3A2E2A' },
  emptyText: { fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0A39C' },
  emptyBtn: { marginTop: 8, background: 'transparent', border: '1px solid #3A2E2A', color: '#D4A373', padding: '12px 24px', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: '6px' },
};