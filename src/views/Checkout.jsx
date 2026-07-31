import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastProvider';

const orderItems = [
  { id: 1, name: 'Espresso Doble', category: 'Caliente', price: 45, type: 'Bebida', qty: 1, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200' },
  { id: 2, name: 'Frappé Caramelo', category: 'Frío', price: 85, type: 'Bebida', qty: 2, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=200' },
];

const STEPS = ['Entrega', 'Pago', 'Confirmación'];

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({ name: '', email: '', address: '', city: '', zip: '', country: 'México' });
  const [payment, setPayment] = useState({ card: '', name: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const subtotal = orderItems.reduce((a, i) => a + i.price * i.qty, 0);
  const shippingCost = subtotal >= 300 ? 0 : 45;
  const total = subtotal + shippingCost;
  const fmt = (n) => '$' + n.toLocaleString('es-MX');

  const setS = (field) => (e) => setShipping((f) => ({ ...f, [field]: e.target.value }));
  const setP = (field) => (e) => {
    let v = e.target.value;
    if (field === 'card') v = v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    if (field === 'expiry') v = v.replace(/\D/g, '').slice(0, 4).replace(/^(.{2})(.+)/, '$1/$2');
    if (field === 'cvv') v = v.replace(/\D/g, '').slice(0, 4);
    setPayment((f) => ({ ...f, [field]: v }));
  };

  const validateShipping = () => {
    const e = {};
    if (!shipping.name.trim()) e.name = 'Requerido';
    if (!shipping.email.includes('@')) e.email = 'Email inválido';
    if (!shipping.address.trim()) e.address = 'Requerido';
    if (!shipping.city.trim()) e.city = 'Requerido';
    if (!shipping.zip.trim()) e.zip = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (payment.card.replace(/\s/g, '').length < 16) e.card = 'Número inválido';
    if (!payment.name.trim()) e.name = 'Requerido';
    if (payment.expiry.length < 5) e.expiry = 'Fecha inválida';
    if (payment.cvv.length < 3) e.cvv = 'CVV inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment()) return;
    setErrors({});
    setStep((s) => s + 1);
  };

  const placeOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setStep(2);
      showToast({ icon: '✓', title: '¡Pedido confirmado!', sub: 'Revisa tu email para el detalle' });
    }, 1800);
  };

  return (
    <div style={s.root}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.eyebrow}>— Finalizar compra</div>
        <h1 style={s.title}>Checkout</h1>
      </div>

      {/* Stepper */}
      <div style={s.stepper}>
        {STEPS.map((label, idx) => (
          <React.Fragment key={label}>
            <div style={s.stepItem}>
              <div style={{
                ...s.stepDot,
                background: idx <= step ? '#F0E040' : 'transparent',
                borderColor: idx <= step ? '#F0E040' : '#333',
                color: idx <= step ? '#0A0A0A' : '#444',
              }}>
                {idx < step ? '✓' : idx + 1}
              </div>
              <span style={{ ...s.stepLabel, color: idx <= step ? '#F0E040' : '#444' }}>{label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{ ...s.stepLine, background: idx < step ? '#F0E040' : '#1E1E1E' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={s.layout}>

        {/* Left — form area */}
        <div style={s.formArea}>

          {/* STEP 0 — Entrega */}
          {step === 0 && (
            <div style={s.formCard}>
              <div style={s.formTitle}>Datos de entrega</div>
              <div style={s.formGrid2}>
                <Field label="Nombre completo" error={errors.name}>
                  <input style={inp(errors.name)} value={shipping.name} onChange={setS('name')} placeholder="Juan García" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input style={inp(errors.email)} type="email" value={shipping.email} onChange={setS('email')} placeholder="juan@email.com" />
                </Field>
              </div>
              <Field label="Dirección de entrega" error={errors.address}>
                <input style={inp(errors.address)} value={shipping.address} onChange={setS('address')} placeholder="Av. Universidad 123, Centro" />
              </Field>
              <div style={s.formGrid3}>
                <Field label="Ciudad" error={errors.city}>
                  <input style={inp(errors.city)} value={shipping.city} onChange={setS('city')} placeholder="Querétaro" />
                </Field>
                <Field label="C.P." error={errors.zip}>
                  <input style={inp(errors.zip)} value={shipping.zip} onChange={setS('zip')} placeholder="76000" />
                </Field>
                <Field label="País">
                  <select style={inp()} value={shipping.country} onChange={setS('country')}>
                    <option>México</option>
                  </select>
                </Field>
              </div>

              {/* Shipping method */}
              <div style={s.formTitle2}>Método de entrega</div>
              <div style={s.shipMethods}>
                {[
                  { id: 'std', label: 'Normal', sub: '35–50 min', price: shippingCost === 0 ? 'Gratis' : fmt(45) },
                  { id: 'exp', label: 'Prioritario', sub: '15–25 min', price: fmt(65) },
                ].map((m) => (
                  <div key={m.id} style={{ ...s.shipMethod, borderColor: m.id === 'std' ? '#F0E040' : '#1E1E1E' }}>
                    <div style={s.shipRadio}>
                      <div style={{ ...s.radioDot, background: m.id === 'std' ? '#F0E040' : 'transparent', borderColor: m.id === 'std' ? '#F0E040' : '#444' }} />
                      <div>
                        <div style={s.shipLabel}>{m.label}</div>
                        <div style={s.shipSub}>{m.sub}</div>
                      </div>
                    </div>
                    <span style={{ ...s.shipPrice, color: m.price === 'Gratis' ? '#3a9a5c' : '#F5F5F0' }}>{m.price}</span>
                  </div>
                ))}
              </div>

              <button onClick={nextStep} style={s.btnPrimary}>Continuar al pago →</button>
            </div>
          )}

          {/* STEP 1 — Pago */}
          {step === 1 && (
            <div style={s.formCard}>
              <div style={s.formTitle}>Datos de pago</div>

              {/* Card type icons */}
              <div style={s.cardIcons}>
                {['VISA', 'MC', 'AMEX'].map((b) => (
                  <div key={b} style={s.cardIcon}>{b}</div>
                ))}
              </div>

              <Field label="Número de tarjeta" error={errors.card}>
                <input style={inp(errors.card)} value={payment.card} onChange={setP('card')} placeholder="0000 0000 0000 0000" maxLength={19} />
              </Field>
              <Field label="Nombre en la tarjeta" error={errors.name}>
                <input style={inp(errors.name)} value={payment.name} onChange={setP('name')} placeholder="JUAN GARCIA" />
              </Field>
              <div style={s.formGrid2}>
                <Field label="Vencimiento" error={errors.expiry}>
                  <input style={inp(errors.expiry)} value={payment.expiry} onChange={setP('expiry')} placeholder="MM/AA" maxLength={5} />
                </Field>
                <Field label="CVV" error={errors.cvv}>
                  <input style={inp(errors.cvv)} value={payment.cvv} onChange={setP('cvv')} placeholder="123" maxLength={4} type="password" />
                </Field>
              </div>

              <div style={s.secNote}>
                🔒 Pago 100% seguro con encriptación SSL
              </div>

              <div style={s.btnRow}>
                <button onClick={() => { setStep(0); setErrors({}); }} style={s.btnSecondary}>← Volver</button>
                <button onClick={placeOrder} style={{ ...s.btnPrimary, flex: 1 }} disabled={placing}>
                  {placing ? 'Procesando...' : `Pagar ${fmt(total)} →`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Confirmación */}
          {step === 2 && (
            <div style={s.confirm}>
              <div style={s.confirmIcon}>✓</div>
              <div style={s.confirmTitle}>¡Pedido confirmado!</div>
              <div style={s.confirmSub}>Orden #RC-{Math.floor(Math.random() * 90000) + 10000}</div>
              <p style={s.confirmMsg}>
                Te enviamos un correo a <span style={{ color: '#F0E040' }}>{shipping.email || 'tu email'}</span> con el detalle de tu compra y tiempo de entrega.
              </p>
              <div style={s.confirmItems}>
                {orderItems.map((item) => (
                  <div key={item.id} style={s.confirmItem}>
                    <img src={item.image} alt={item.name} style={s.confirmItemImg} />
                    <div>
                      <div style={s.confirmItemName}>{item.name}</div>
                      <div style={s.confirmItemMeta}>{item.type} · x{item.qty}</div>
                    </div>
                    <div style={s.confirmItemPrice}>{fmt(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/')} style={s.btnPrimary}>Volver al inicio →</button>
            </div>
          )}
        </div>

        {/* Right — order summary */}
        {step < 2 && (
          <div style={s.summary}>
            <div style={s.summaryTitle}>Tu pedido</div>

            {orderItems.map((item) => (
              <div key={item.id} style={s.summaryItem}>
                <img src={item.image} alt={item.name} style={s.summaryItemImg} />
                <div style={{ flex: 1 }}>
                  <div style={s.summaryItemBrand}>{item.category}</div>
                  <div style={s.summaryItemName}>{item.name}</div>
                  <div style={s.summaryItemMeta}>{item.type} · x{item.qty}</div>
                </div>
                <div style={s.summaryItemPrice}>{fmt(item.price * item.qty)}</div>
              </div>
            ))}

            <div style={s.summaryDivider} />

            <div style={s.summaryRow}>
              <span style={s.summaryKey}>Subtotal</span>
              <span style={s.summaryVal}>{fmt(subtotal)}</span>
            </div>
            <div style={s.summaryRow}>
              <span style={s.summaryKey}>Envío</span>
              <span style={shippingCost === 0 ? s.summaryFree : s.summaryVal}>
                {shippingCost === 0 ? 'Gratis' : fmt(shippingCost)}
              </span>
            </div>

            <div style={s.summaryDivider} />

            <div style={s.summaryTotal}>
              <span style={s.summaryTotalLabel}>Total</span>
              <span style={s.summaryTotalNum}>{fmt(total)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Field wrapper ─────────────────────────────────────── */
function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={s.fieldLabel}>{label}</div>
      {React.cloneElement(children, {
        onFocus: (e) => { e.target.style.borderColor = '#F0E040'; },
        onBlur: (e) => { e.target.style.borderColor = error ? '#8B2020' : '#1E1E1E'; },
      })}
      {error && <div style={s.fieldError}>{error}</div>}
    </div>
  );
}

const inp = (err) => ({
  width: '100%',
  background: '#111',
  border: `1px solid ${err ? '#8B2020' : '#1E1E1E'}`,
  borderRadius: 0,
  padding: '11px 14px',
  color: '#F5F5F0',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
});

/* ── Styles ─────────────────────────────────────────────── */
const s = {
  root: { background: '#0A0A0A', minHeight: 'calc(100vh - 56px)', color: '#F5F5F0', fontFamily: 'system-ui, sans-serif' },
  header: { padding: '48px 40px 28px', borderBottom: '1px solid #1E1E1E' },
  eyebrow: { fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F0E040', fontWeight: 500, marginBottom: 8 },
  title: { fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#F5F5F0', margin: 0, lineHeight: 1 },

  stepper: { display: 'flex', alignItems: 'center', padding: '24px 40px', borderBottom: '1px solid #1E1E1E', gap: 0 },
  stepItem: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  stepDot: { width: 28, height: 28, borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, transition: 'all 0.2s' },
  stepLabel: { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'color 0.2s' },
  stepLine: { flex: 1, height: 1, margin: '0 16px', transition: 'background 0.2s' },

  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 1, background: '#1A1A1A', margin: '32px 40px' },

  formArea: { background: '#0A0A0A', padding: '32px' },
  formCard: { maxWidth: 560 },
  formTitle: { fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #1E1E1E' },
  formTitle2: { fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', margin: '24px 0 14px', paddingBottom: 12, borderBottom: '1px solid #1E1E1E' },
  formGrid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  formGrid3: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 },

  fieldLabel: { fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666', marginBottom: 6 },
  fieldError: { fontSize: 10, color: '#E05050', letterSpacing: '0.06em', marginTop: 4 },

  shipMethods: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 },
  shipMethod: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid', cursor: 'pointer', transition: 'border-color 0.15s' },
  shipRadio: { display: 'flex', alignItems: 'center', gap: 12 },
  radioDot: { width: 16, height: 16, borderRadius: '50%', border: '2px solid', transition: 'all 0.15s', flexShrink: 0 },
  shipLabel: { fontSize: 13, fontWeight: 700, color: '#F5F5F0', textTransform: 'uppercase', letterSpacing: '0.04em' },
  shipSub: { fontSize: 10, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 },
  shipPrice: { fontSize: 14, fontWeight: 900, letterSpacing: '-0.01em' },

  cardIcons: { display: 'flex', gap: 8, marginBottom: 20 },
  cardIcon: { background: '#111', border: '1px solid #2A2A2A', padding: '5px 10px', fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', color: '#666' },

  secNote: { fontSize: 11, color: '#444', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px 0', borderTop: '1px solid #1A1A1A', marginTop: 8, marginBottom: 20 },

  btnRow: { display: 'flex', gap: 10 },
  btnPrimary: { background: '#F0E040', border: 'none', color: '#0A0A0A', padding: '14px 24px', fontSize: 11, fontWeight: 900, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', width: '100%' },
  btnSecondary: { background: 'transparent', border: '1px solid #2A2A2A', color: '#666', padding: '14px 20px', fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 },

  /* Confirmation */
  confirm: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 32px', gap: 12 },
  confirmIcon: { width: 64, height: 64, borderRadius: '50%', background: '#F0E040', color: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, marginBottom: 8 },
  confirmTitle: { fontSize: 32, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: '#F5F5F0' },
  confirmSub: { fontSize: 11, color: '#F0E040', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 },
  confirmMsg: { fontSize: 13, color: '#666', lineHeight: 1.7, maxWidth: 400, margin: '8px 0 20px' },
  confirmItems: { width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 1, background: '#1A1A1A', marginBottom: 24 },
  confirmItem: { display: 'flex', alignItems: 'center', gap: 12, background: '#0F0F0F', padding: '14px 16px' },
  confirmItemImg: { width: 48, height: 48, objectFit: 'cover', filter: 'grayscale(15%)' },
  confirmItemName: { fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#F5F5F0', letterSpacing: '-0.01em' },
  confirmItemMeta: { fontSize: 10, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 },
  confirmItemPrice: { fontSize: 14, fontWeight: 900, color: '#F5F5F0', marginLeft: 'auto', letterSpacing: '-0.02em' },

  /* Summary panel */
  summary: { background: '#0F0F0F', padding: '28px 24px', borderLeft: '1px solid #1A1A1A', display: 'flex', flexDirection: 'column', gap: 0 },
  summaryTitle: { fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#444', marginBottom: 20 },
  summaryItem: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  summaryItemImg: { width: 52, height: 52, objectFit: 'cover', filter: 'grayscale(15%)', flexShrink: 0 },
  summaryItemBrand: { fontSize: 9, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F0E040', marginBottom: 3 },
  summaryItemName: { fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#F5F5F0', letterSpacing: '-0.01em', lineHeight: 1.2 },
  summaryItemMeta: { fontSize: 10, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 },
  summaryItemPrice: { fontSize: 13, fontWeight: 900, color: '#F5F5F0', letterSpacing: '-0.01em', flexShrink: 0 },
  summaryDivider: { height: 1, background: '#1A1A1A', margin: '16px 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  summaryKey: { fontSize: 11, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' },
  summaryVal: { fontSize: 13, fontWeight: 700, color: '#F5F5F0' },
  summaryFree: { fontSize: 11, fontWeight: 800, color: '#3a9a5c', letterSpacing: '0.08em', textTransform: 'uppercase' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 },
  summaryTotalLabel: { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' },
  summaryTotalNum: { fontSize: 28, fontWeight: 900, color: '#F5F5F0', letterSpacing: '-0.03em' },
};