import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastProvider';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const fmt = (n) => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 });
const noImageSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23231C1A'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13px' font-weight='bold' fill='%23B0A39C'%3ESin Foto%3C/text%3E%3C/svg%3E";

export default function Cart() {
  const navigate = useNavigate();
  const { isAutenticado, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promociones, setPromociones] = useState([]);
  
  const [promosAplicadas, setPromosAplicadas] = useState([]);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);

  useEffect(() => {
    if (!isAutenticado) {
      showToast({ icon: '⚠️', title: 'Inicia sesión', sub: 'Para ver tu carrito' });
      navigate('/login');
      return;
    }

    async function fetchCartAndPromos() {
      try {
        const [resCart, resPromo] = await Promise.all([
          fetch(`${API_URL}/carrito`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/promociones/activas`)
        ]);

        if (resCart.ok) {
          const dataCart = await resCart.json();
          setItems(dataCart.map(i => ({ ...i, price: Number(i.price) })));
        }
        if (resPromo.ok) {
          const dataPromo = await resPromo.json();
          setPromociones(dataPromo);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCartAndPromos();
  }, [isAutenticado, token, navigate]);

  useEffect(() => {
    if (!items || items.length === 0) {
      setDescuentoAplicado(0);
      setPromosAplicadas([]);
      return;
    }
    
    let ahorroTotal = 0;
    let aplicadasList = [];

    promociones.forEach(promo => {
      let itemsAplica = [];
      const idsEspecificos = promo.productos_ids ? promo.productos_ids.split(',').map(Number) : [];

      items.forEach(item => {
        let aplica = false;
        if (idsEspecificos.length > 0) {
           aplica = idsEspecificos.includes(item.id);
        } else {
           aplica = (promo.categoria_aplica === 'Todos' || item.category === promo.categoria_aplica);
        }

        if (aplica) {
          for (let i = 0; i < item.qty; i++) {
            itemsAplica.push(item);
          }
        }
      });

      itemsAplica.sort((a, b) => b.price - a.price);

      let ahorroPromo = 0;
      if (promo.tipo === '2X1' && itemsAplica.length >= 2) {
        let pares = Math.floor(itemsAplica.length / 2);
        for (let i = 0; i < pares; i++) {
          ahorroPromo += itemsAplica[itemsAplica.length - 1 - i].price;
        }
      } 
      else if (promo.tipo === 'DESCUENTO' && itemsAplica.length > 0) {
        let suma = itemsAplica.reduce((acc, it) => acc + it.price, 0);
        ahorroPromo += suma * (promo.valor / 100);
      } 
      else if (promo.tipo === 'COMBO' && itemsAplica.length >= 2) {
        let pares = Math.floor(itemsAplica.length / 2);
        for (let i = 0; i < pares; i++) {
          let precioNormal = itemsAplica[i*2].price + itemsAplica[i*2+1].price;
          let rebaja = precioNormal - promo.valor;
          if (rebaja > 0) ahorroPromo += rebaja; 
        }
      }

      if (ahorroPromo > 0) {
        ahorroTotal += ahorroPromo;
        aplicadasList.push({ titulo: promo.titulo, ahorro: ahorroPromo });
      }
    });

    setDescuentoAplicado(ahorroTotal);
    setPromosAplicadas(aplicadasList);
  }, [items, promociones]);

  const updateQty = async (id, delta) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    const newQty = Math.max(0, target.qty + delta);

    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: newQty } : item))
        .filter((item) => item.qty > 0)
    );

    if (newQty === 0) {
      showToast({ icon: '✕', title: 'Producto eliminado', sub: target.name });
    }

    try {
      await fetch(`${API_URL}/carrito/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ producto_id: id, cantidad: newQty })
      });
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast({ icon: '✕', title: 'Eliminado del carrito', sub: item?.name });

    try {
      await fetch(`${API_URL}/carrito/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ producto_id: id, cantidad: 0 })
      });
    } catch (err) { console.error(err); }
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  
  // ⚡ El envío gratis se evalúa estrictamente sobre el SUBATOTAL bruto de los productos ($150)
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 45;
  const total = Math.max(0, subtotal - descuentoAplicado + shipping);

  if (loading) {
    return <div style={{ ...s.page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando carrito...</div>;
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.eyebrow}>— Mi pedido</div>
        <h1 style={s.title}>Carrito</h1>
        <span style={s.count}>
          <span style={s.countNum}>{items.reduce((a, i) => a + i.qty, 0)}</span> artículos
        </span>
      </div>

      {items.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>∅</div>
          <p style={s.emptyText}>Tu carrito está vacío</p>
          <button onClick={() => navigate('/catalog')} style={s.emptyBtn}>
            Explorar menú →
          </button>
        </div>
      ) : (
        <div style={s.layout}>
          <div style={s.itemsList}>
            {items.map((item, idx) => (
              <CartItem
                key={item.id}
                item={item}
                index={idx}
                onIncrease={() => updateQty(item.id, +1)}
                onDecrease={() => updateQty(item.id, -1)}
                onRemove={() => remove(item.id)}
              />
            ))}

            {subtotal >= 150 && (
              <div style={s.freeShip}>✓ Envío gratis aplicado en tu pedido</div>
            )}
            {subtotal < 150 && subtotal > 0 && (
              <div style={s.shipNote}>Faltan {fmt(150 - subtotal)} para envío gratis</div>
            )}
          </div>

          <div style={s.summary}>
            <div style={s.summaryLabel}>Resumen de Pedido</div>
            <div style={s.summaryRows}>
              <div style={s.summaryRow}>
                <span style={s.summaryKey}>Subtotal</span>
                <span style={s.summaryVal}>{fmt(subtotal)}</span>
              </div>
              
              {promosAplicadas.map((p, index) => (
                <div key={index} style={s.summaryRow}>
                  <span style={{ ...s.summaryKey, color: '#D4A373' }}>★ {p.titulo}</span>
                  <span style={{...s.summaryVal, color: '#3a9a5c'}}>-{fmt(p.ahorro)}</span>
                </div>
              ))}

              <div style={s.summaryRow}>
                <span style={s.summaryKey}>Envío</span>
                <span style={shipping === 0 ? s.summaryFree : s.summaryVal}>
                  {shipping === 0 ? 'Gratis' : fmt(shipping)}
                </span>
              </div>
            </div>

            <div style={s.summaryTotal}>
              <span>Total</span>
              <span style={s.summaryTotalNum}>{fmt(total)}</span>
            </div>

            <button style={s.checkoutBtn} onClick={() => navigate('/checkout')}>
              Proceder al pago →
            </button>

            <button onClick={() => navigate('/catalog')} style={s.continueBtn}>
              Seguir comprando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CartItem({ item, index, onIncrease, onDecrease, onRemove }) {
  const [hovered, setHovered] = useState(false);
  const servidorBase = API_URL.replace('/api', '');
  const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${servidorBase}${item.image}`) : noImageSvg;

  return (
    <div
      style={{ ...s.item, background: hovered ? '#111' : '#0F0F0F' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.itemNum} aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
      <img src={imageUrl} alt={item.name} style={s.itemImg} onError={(e) => { if (e.target.src !== noImageSvg) e.target.src = noImageSvg; }} />
      <div style={s.itemInfo}>
        <div style={s.itemBrand}>{item.category}</div>
        <div style={s.itemName}>{item.name}</div>
        <div style={s.itemSize}>{item.type}</div>
      </div>
      <div style={s.qtyWrap}>
        <button onClick={onDecrease} style={s.qtyBtn}>−</button>
        <span style={s.qtyNum}>{item.qty}</span>
        <button onClick={onIncrease} style={s.qtyBtn}>+</button>
      </div>
      <div style={s.itemPrice}>{fmt(item.price * item.qty)}</div>
      <button onClick={onRemove} style={s.removeBtn} title="Eliminar">✕</button>
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
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 1, background: '#3A2E2A', margin: '32px 5%' },
  itemsList: { background: '#16110F', display: 'flex', flexDirection: 'column', gap: 1 },
  item: { display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', position: 'relative', transition: 'background 0.18s', borderBottom: '1px solid #3A2E2A' },
  itemNum: { fontSize: 32, fontWeight: 700, color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.04em', lineHeight: 1, minWidth: 36, userSelect: 'none' },
  itemImg: { width: 72, height: 72, objectFit: 'cover', flexShrink: 0, borderRadius: '6px' },
  itemInfo: { flex: 1, minWidth: 0 },
  itemBrand: { fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D4A373', marginBottom: 4 },
  itemName: { fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 600, color: '#F9F6F0', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  itemSize: { fontSize: 11, color: '#B0A39C', letterSpacing: '0.1em', textTransform: 'uppercase' },
  qtyWrap: { display: 'flex', alignItems: 'center', border: '1px solid #3A2E2A', borderRadius: '4px', background: '#231C1A' },
  qtyBtn: { background: 'transparent', border: 'none', color: '#B0A39C', width: 30, height: 30, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyNum: { fontSize: 13, fontWeight: 600, color: '#F9F6F0', minWidth: 28, textAlign: 'center' },
  itemPrice: { fontSize: 18, fontWeight: 600, color: '#D4A373', minWidth: 80, textAlign: 'right' },
  removeBtn: { background: 'none', border: '1px solid #3A2E2A', color: '#B0A39C', width: 28, height: 28, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' },
  freeShip: { padding: '12px 24px', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3a9a5c', background: 'rgba(58,154,92,0.06)' },
  shipNote: { padding: '12px 24px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0A39C', borderTop: '1px solid #3A2E2A' },
  summary: { background: '#231C1A', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 0 },
  summaryLabel: { fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B0A39C', marginBottom: 20 },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20, borderBottom: '1px solid #3A2E2A', marginBottom: 20 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryKey: { fontSize: 12, color: '#B0A39C', letterSpacing: '0.08em', textTransform: 'uppercase' },
  summaryVal: { fontSize: 14, fontWeight: 600, color: '#F9F6F0' },
  summaryFree: { fontSize: 11, fontWeight: 700, color: '#3a9a5c', letterSpacing: '0.08em', textTransform: 'uppercase' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, fontSize: 12, fontWeight: 600, color: '#B0A39C' },
  summaryTotalNum: { fontSize: 28, fontWeight: 700, color: '#D4A373' },
  checkoutBtn: { width: '100%', background: '#D4A373', border: 'none', color: '#16110F', padding: '14px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '6px', marginBottom: 10 },
  continueBtn: { width: '100%', background: 'transparent', border: '1px solid #3A2E2A', color: '#B0A39C', padding: '12px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '6px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 },
  emptyIcon: { fontSize: 48, color: '#3A2E2A', fontWeight: 700 },
  emptyText: { fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B0A39C' },
  emptyBtn: { marginTop: 8, background: 'transparent', border: '1px solid #3A2E2A', color: '#D4A373', padding: '12px 24px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '6px' }
};