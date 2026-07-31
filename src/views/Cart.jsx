import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastProvider';

const initialItems = [
  {
    id: 1,
    name: 'Espresso Doble',
    category: 'Caliente',
    price: 45,
    type: 'Bebida',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200',
  },
  {
    id: 2,
    name: 'Frappé Caramelo',
    category: 'Frío',
    price: 85,
    type: 'Bebida',
    qty: 2,
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=200',
  },
];

const fmt = (n) => '$' + n.toLocaleString('es-MX');

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
    if (delta < 0) {
      const item = items.find((i) => i.id === id);
      if (item && item.qty === 1) {
        showToast({ icon: '✕', title: 'Producto eliminado', sub: item.name });
      }
    }
  };

  const remove = (id) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast({ icon: '✕', title: 'Eliminado del carrito', sub: item?.name });
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping = subtotal >= 300 ? 0 : 45;
  const total = subtotal + shipping;

  return (
    <div style={s.page}>

      {/* Header */}
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

          {/* Items list */}
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

            {shipping === 0 && (
              <div style={s.freeShip}>
                ✓ Envío gratis aplicado en tu pedido
              </div>
            )}
            {shipping > 0 && (
              <div style={s.shipNote}>
                Faltan {fmt(300 - subtotal)} para envío gratis
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={s.summary}>
            <div style={s.summaryLabel}>Resumen de Pedido</div>

            <div style={s.summaryRows}>
              <div style={s.summaryRow}>
                <span style={s.summaryKey}>Subtotal</span>
                <span style={s.summaryVal}>{fmt(subtotal)}</span>
              </div>
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

            <button
              onClick={() => navigate('/catalog')}
              style={s.continueBtn}
            >
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

  return (
    <div
      style={{ ...s.item, background: hovered ? '#111' : '#0F0F0F' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Index watermark */}
      <div style={s.itemNum} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>

      <img src={item.image} alt={item.name} style={s.itemImg} />

      <div style={s.itemInfo}>
        <div style={s.itemBrand}>{item.category}</div>
        <div style={s.itemName}>{item.name}</div>
        <div style={s.itemSize}>{item.type}</div>
      </div>

      {/* Qty controls */}
      <div style={s.qtyWrap}>
        <button onClick={onDecrease} style={s.qtyBtn}>−</button>
        <span style={s.qtyNum}>{item.qty}</span>
        <button onClick={onIncrease} style={s.qtyBtn}>+</button>
      </div>

      <div style={s.itemPrice}>${item.price.toLocaleString('es-MX')}</div>

      <button onClick={onRemove} style={s.removeBtn} title="Eliminar">✕</button>
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = {
  page: {
    background: '#0A0A0A',
    minHeight: 'calc(100vh - 56px)',
    color: '#F5F5F0',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    padding: '48px 40px 32px',
    borderBottom: '1px solid #1E1E1E',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#F0E040',
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: '-0.04em',
    textTransform: 'uppercase',
    color: '#F5F5F0',
    margin: 0,
    lineHeight: 1,
  },
  count: {
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#444',
    marginTop: 4,
  },
  countNum: {
    color: '#F0E040',
    fontWeight: 900,
    fontSize: 14,
  },

  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: 1,
    background: '#1A1A1A',
    margin: '32px 40px',
  },

  /* Items */
  itemsList: {
    background: '#0A0A0A',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '20px 24px',
    position: 'relative',
    transition: 'background 0.18s',
    borderBottom: '1px solid #1A1A1A',
  },
  itemNum: {
    fontSize: 32,
    fontWeight: 900,
    color: 'rgba(255,255,255,0.04)',
    letterSpacing: '-0.04em',
    lineHeight: 1,
    minWidth: 36,
    userSelect: 'none',
  },
  itemImg: {
    width: 72,
    height: 72,
    objectFit: 'cover',
    flexShrink: 0,
    filter: 'grayscale(15%)',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemBrand: {
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#F0E040',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    color: '#F5F5F0',
    marginBottom: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemSize: {
    fontSize: 10,
    color: '#444',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },

  /* Qty */
  qtyWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    border: '1px solid #2A2A2A',
  },
  qtyBtn: {
    background: 'transparent',
    border: 'none',
    color: '#888',
    width: 30,
    height: 30,
    cursor: 'pointer',
    fontSize: 16,
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s',
  },
  qtyNum: {
    fontSize: 13,
    fontWeight: 800,
    color: '#F5F5F0',
    minWidth: 28,
    textAlign: 'center',
    letterSpacing: '0.04em',
  },

  itemPrice: {
    fontSize: 18,
    fontWeight: 900,
    color: '#F5F5F0',
    letterSpacing: '-0.02em',
    minWidth: 80,
    textAlign: 'right',
  },
  removeBtn: {
    background: 'none',
    border: '1px solid #222',
    color: '#444',
    width: 28,
    height: 28,
    cursor: 'pointer',
    fontSize: 10,
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'color 0.15s, border-color 0.15s',
  },

  freeShip: {
    padding: '12px 24px',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#3a9a5c',
    background: 'rgba(58,154,92,0.06)',
    borderTop: '1px solid rgba(58,154,92,0.15)',
  },
  shipNote: {
    padding: '12px 24px',
    fontSize: 10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#555',
    borderTop: '1px solid #1A1A1A',
  },

  /* Summary */
  summary: {
    background: '#0F0F0F',
    padding: '28px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    borderLeft: '1px solid #1A1A1A',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#444',
    marginBottom: 20,
  },
  summaryRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingBottom: 20,
    borderBottom: '1px solid #1A1A1A',
    marginBottom: 20,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryKey: {
    fontSize: 11,
    color: '#555',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: 700,
    color: '#F5F5F0',
    letterSpacing: '-0.01em',
  },
  summaryFree: {
    fontSize: 11,
    fontWeight: 800,
    color: '#3a9a5c',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 24,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#888',
  },
  summaryTotalNum: {
    fontSize: 28,
    fontWeight: 900,
    color: '#F5F5F0',
    letterSpacing: '-0.03em',
  },
  checkoutBtn: {
    width: '100%',
    background: '#F0E040',
    border: 'none',
    color: '#0A0A0A',
    padding: '14px',
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginBottom: 10,
    transition: 'background 0.15s',
  },
  continueBtn: {
    width: '100%',
    background: 'transparent',
    border: '1px solid #2A2A2A',
    color: '#555',
    padding: '12px',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },

  /* Empty */
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 48,
    color: '#222',
    fontWeight: 900,
  },
  emptyText: {
    fontSize: 12,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#333',
  },
  emptyBtn: {
    marginTop: 8,
    background: 'transparent',
    border: '1px solid #2A2A2A',
    color: '#888',
    padding: '10px 20px',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};