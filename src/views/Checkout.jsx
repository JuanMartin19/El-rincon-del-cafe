import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastProvider';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { API_URL } from '../config';
import { PayPalButtons } from '@paypal/react-paypal-js';

const STEPS = ['Entrega', 'Pago', 'Confirmación'];
const noImageSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23231C1A'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13px' font-weight='bold' fill='%23B0A39C'%3ESin Foto%3C/text%3E%3C/svg%3E";

export default function Checkout() {
  const navigate = useNavigate();
  const { isAutenticado, token, usuario } = useAuth();
  const { socket } = useSocket();

  const [step, setStep] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [promociones, setPromociones] = useState([]);
  const [promosAplicadas, setPromosAplicadas] = useState([]);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);

  const [shipping, setShipping] = useState({ name: usuario?.nombre || '', address: '', city: '', zip: '' });
  const [shipMethod, setShipMethod] = useState('std'); 
  const [paymentMethod, setPaymentMethod] = useState('card'); 
  
  const [payment, setPayment] = useState({ card: '', name: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!isAutenticado) {
      showToast({ icon: '⚠️', title: 'Inicia sesión', sub: 'Para proceder al pago' });
      navigate('/login');
      return;
    }

    async function fetchCheckoutData() {
      try {
        const [resCart, resPromo] = await Promise.all([
          fetch(`${API_URL}/carrito`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/promociones/activas`)
        ]);

        if (resCart.ok) {
          const dataCart = await resCart.json();
          if (dataCart.length === 0) {
            showToast({ icon: '∅', title: 'Carrito vacío', sub: 'Agrega productos para continuar' });
            navigate('/cart');
            return;
          }
          setOrderItems(dataCart.map(i => ({ ...i, price: Number(i.price) })));
        }
        if (resPromo.ok) {
          const dataPromo = await resPromo.json();
          setPromociones(dataPromo);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCart(false);
      }
    }
    fetchCheckoutData();
  }, [isAutenticado, token, navigate]);

  useEffect(() => {
    if (!orderItems || orderItems.length === 0) {
      setDescuentoAplicado(0);
      setPromosAplicadas([]);
      return;
    }
    
    let ahorroTotal = 0;
    let aplicadasList = [];

    promociones.forEach(promo => {
      let itemsAplica = [];
      const idsEspecificos = promo.productos_ids ? promo.productos_ids.split(',').map(Number) : [];

      orderItems.forEach(item => {
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
  }, [orderItems, promociones]);

  const subtotal = orderItems.reduce((a, i) => a + i.price * i.qty, 0);
  
  // ⚡ Envío gratis evaluado sobre el subtotal ($150)
  const shippingCost = shipMethod === 'exp' ? 65 : (subtotal >= 150 ? 0 : 45);
  const total = Math.max(0, subtotal - descuentoAplicado + shippingCost);
  
  const fmt = (n) => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 });

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
    if (!shipping.address.trim()) e.address = 'Requerido';
    if (!shipping.city.trim()) e.city = 'Requerido';
    if (!shipping.zip.trim()) e.zip = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    if (paymentMethod === 'paypal') return true; 
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

  const finalizeOrder = async () => {
    // ⚡ Registramos cada producto en la Base de Datos (lo que disparará el Socket automáticamente)
    if (orderItems.length > 0) {
      orderItems.forEach((item, index) => {
        setTimeout(async () => {
          try {
            await fetch(`${API_URL}/pedidos`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                producto: item.name,
                preparacion: item.category || 'Estándar',
                precio: item.price * item.qty
              })
            });
          } catch (err) {
            console.error('Error al enviar pedido al servidor:', err);
          }
        }, index * 200); 
      });
    }

    // Vaciar el carrito en la base de datos tras la compra exitosa
    try {
      await fetch(`${API_URL}/carrito/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error al vaciar carrito:', err);
    }

    setStep(2);
    showToast({ icon: '✓', title: '¡Pedido confirmado!', sub: 'Revisa tu correo para el detalle' });
  };

  const placeOrderCard = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      finalizeOrder();
    }, 1500);
  };

  if (loadingCart) {
    return <div style={{ ...s.root, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando checkout...</div>;
  }

  const servidorBase = API_URL.replace('/api', '');

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.eyebrow}>— Finalizar compra</div>
        <h1 style={s.title}>Checkout</h1>
      </div>

      <div style={s.stepper}>
        {STEPS.map((label, idx) => (
          <React.Fragment key={label}>
            <div style={s.stepItem}>
              <div style={{
                ...s.stepDot,
                background: idx <= step ? '#D4A373' : 'transparent',
                borderColor: idx <= step ? '#D4A373' : '#3A2E2A',
                color: idx <= step ? '#16110F' : '#B0A39C',
              }}>
                {idx < step ? '✓' : idx + 1}
              </div>
              <span style={{ ...s.stepLabel, color: idx <= step ? '#D4A373' : '#B0A39C' }}>{label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{ ...s.stepLine, background: idx < step ? '#D4A373' : '#3A2E2A' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={s.layout}>
        <div style={s.formArea}>

          {step === 0 && (
            <div style={s.formCard}>
              <div style={s.formTitle}>Datos de entrega</div>
              <Field label="Nombre de quien recibe" error={errors.name}>
                <input style={inp(errors.name)} value={shipping.name} onChange={setS('name')} placeholder="Juan García" />
              </Field>
              
              <Field label="Dirección de entrega" error={errors.address}>
                <input style={inp(errors.address)} value={shipping.address} onChange={setS('address')} placeholder="Av. Universidad 123, Centro" />
              </Field>
              
              <div style={s.formGrid2}>
                <Field label="Ciudad" error={errors.city}>
                  <input style={inp(errors.city)} value={shipping.city} onChange={setS('city')} placeholder="Querétaro" />
                </Field>
                <Field label="Código Postal" error={errors.zip}>
                  <input style={inp(errors.zip)} value={shipping.zip} onChange={setS('zip')} placeholder="76000" />
                </Field>
              </div>

              <div style={s.formTitle2}>Método de entrega</div>
              <div style={s.shipMethods}>
                {[
                  { id: 'std', label: 'Normal', sub: '35–50 min', price: subtotal >= 150 ? 'Gratis' : fmt(45) },
                  { id: 'exp', label: 'Prioritario', sub: '15–25 min', price: fmt(65) },
                ].map((m) => (
                  <div 
                    key={m.id} 
                    onClick={() => setShipMethod(m.id)} 
                    style={{ ...s.shipMethod, borderColor: shipMethod === m.id ? '#D4A373' : '#3A2E2A' }}
                  >
                    <div style={s.shipRadio}>
                      <div style={{ ...s.radioDot, background: shipMethod === m.id ? '#D4A373' : 'transparent', borderColor: shipMethod === m.id ? '#D4A373' : '#B0A39C' }} />
                      <div>
                        <div style={s.shipLabel}>{m.label}</div>
                        <div style={s.shipSub}>{m.sub}</div>
                      </div>
                    </div>
                    <span style={{ ...s.shipPrice, color: m.price === 'Gratis' ? '#3a9a5c' : '#F9F6F0' }}>{m.price}</span>
                  </div>
                ))}
              </div>

              <button onClick={nextStep} style={s.btnPrimary}>Continuar al pago →</button>
            </div>
          )}

          {step === 1 && (
            <div style={s.formCard}>
              <div style={s.formTitle}>Método de Pago</div>

              <div style={s.payTabs}>
                <button 
                  onClick={() => setPaymentMethod('card')} 
                  style={{ ...s.payTab, background: paymentMethod === 'card' ? '#D4A373' : '#231C1A', color: paymentMethod === 'card' ? '#16110F' : '#B0A39C' }}
                >
                  Tarjeta 
                </button>
                <button 
                  onClick={() => setPaymentMethod('paypal')} 
                  style={{ ...s.payTab, background: paymentMethod === 'paypal' ? '#D4A373' : '#231C1A', color: paymentMethod === 'paypal' ? '#16110F' : '#B0A39C' }}
                >
                  PayPal (Simulación)
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <>
                  <div style={s.cardIcons}>
                    {['VISA', 'MC', 'AMEX'].map((b) => (
                      <div key={b} style={s.cardIcon}>{b}</div>
                    ))}
                  </div>

                  <Field label="Número de tarjeta (Simulado)" error={errors.card}>
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

                  <div style={s.secNote}>🔒 Pago Universitario Simulado</div>

                  <div style={s.btnRow}>
                    <button onClick={() => { setStep(0); setErrors({}); }} style={s.btnSecondary}>← Volver</button>
                    <button onClick={placeOrderCard} style={{ ...s.btnPrimary, flex: 1 }} disabled={placing}>
                      {placing ? 'Procesando...' : `Pagar ${fmt(total)} →`}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontSize: 13, color: '#B0A39C', marginBottom: 20 }}>
                    Haz clic en el botón de abajo para aprobar la compra simulada usando la pasarela de PayPal.
                  </p>
                  
                  <PayPalButtons 
                    style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{ amount: { value: total.toFixed(2) } }],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        showToast({ icon: '✓', title: '¡Pago Exitoso!', sub: 'Transacción simulada completada' });
                        finalizeOrder();
                      });
                    }}
                    onError={() => {
                      showToast({ icon: '✕', title: 'Aviso', sub: 'Transacción cancelada o fallida' });
                    }}
                  />

                  <div style={{ marginTop: 20 }}>
                    <button onClick={() => setStep(0)} style={s.btnSecondary}>← Volver a entrega</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div style={s.confirm}>
              <div style={s.confirmIcon}>✓</div>
              <div style={s.confirmTitle}>¡Pedido confirmado!</div>
              <div style={s.confirmSub}>Orden #RC-{Math.floor(Math.random() * 90000) + 10000}</div>
              <p style={s.confirmMsg}>
                Te enviamos un correo a <span style={{ color: '#D4A373' }}>{usuario?.email}</span> con el detalle de tu compra y tiempo de entrega estimado.
              </p>
              <div style={s.confirmItems}>
                {orderItems.map((item) => {
                  const itemImg = item.image ? (item.image.startsWith('http') ? item.image : `${servidorBase}${item.image}`) : noImageSvg;
                  return (
                    <div key={item.id} style={s.confirmItem}>
                      <img src={itemImg} alt={item.name} style={s.confirmItemImg} onError={(e)=>{if(e.target.src!==noImageSvg)e.target.src=noImageSvg;}} />
                      <div>
                        <div style={s.confirmItemName}>{item.name}</div>
                        <div style={s.confirmItemMeta}>{item.type} · x{item.qty}</div>
                      </div>
                      <div style={s.confirmItemPrice}>{fmt(item.price * item.qty)}</div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => navigate('/')} style={s.btnPrimary}>Volver al inicio →</button>
            </div>
          )}
        </div>

        {step < 2 && (
          <div style={s.summary}>
            <div style={s.summaryTitle}>Tu pedido</div>

            {orderItems.map((item) => {
              const itemImg = item.image ? (item.image.startsWith('http') ? item.image : `${servidorBase}${item.image}`) : noImageSvg;
              return (
                <div key={item.id} style={s.summaryItem}>
                  <img src={itemImg} alt={item.name} style={s.summaryItemImg} onError={(e)=>{if(e.target.src!==noImageSvg)e.target.src=noImageSvg;}} />
                  <div style={{ flex: 1 }}>
                    <div style={s.summaryItemBrand}>{item.category}</div>
                    <div style={s.summaryItemName}>{item.name}</div>
                    <div style={s.summaryItemMeta}>{item.type} · x{item.qty}</div>
                  </div>
                  <div style={s.summaryItemPrice}>{fmt(item.price * item.qty)}</div>
                </div>
              );
            })}

            <div style={s.summaryDivider} />

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
              <span style={s.summaryKey}>Envío {shipMethod === 'exp' ? '(Prioritario)' : '(Normal)'}</span>
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

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={s.fieldLabel}>{label}</div>
      {React.cloneElement(children, {
        onFocus: (e) => { e.target.style.borderColor = '#D4A373'; },
        onBlur: (e) => { e.target.style.borderColor = error ? '#8B2020' : '#3A2E2A'; },
      })}
      {error && <div style={s.fieldError}>{error}</div>}
    </div>
  );
}

const inp = (err) => ({
  width: '100%',
  background: '#231C1A',
  border: `1px solid ${err ? '#8B2020' : '#3A2E2A'}`,
  borderRadius: '6px',
  padding: '12px 14px',
  color: '#F9F6F0',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
});

const s = {
  root: { background: '#16110F', minHeight: 'calc(100vh - 56px)', color: '#F9F6F0', fontFamily: '"Inter", sans-serif' },
  header: { padding: '48px 5% 28px', borderBottom: '1px solid #3A2E2A' },
  eyebrow: { fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4A373', fontWeight: 600, marginBottom: 8 },
  title: { fontFamily: '"Playfair Display", serif', fontSize: 48, fontWeight: 700, textTransform: 'uppercase', color: '#F9F6F0', margin: 0, lineHeight: 1 },

  stepper: { display: 'flex', alignItems: 'center', padding: '24px 5%', borderBottom: '1px solid #3A2E2A', gap: 0 },
  stepItem: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  stepDot: { width: 28, height: 28, borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, transition: 'all 0.2s' },
  stepLabel: { fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'color 0.2s' },
  stepLine: { flex: 1, height: 1, margin: '0 16px', transition: 'background 0.2s' },

  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 1, background: '#3A2E2A', margin: '32px 5%' },

  formArea: { background: '#16110F', padding: '32px' },
  formCard: { maxWidth: 560 },
  formTitle: { fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B0A39C', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #3A2E2A' },
  formTitle2: { fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B0A39C', margin: '24px 0 14px', paddingBottom: 12, borderBottom: '1px solid #3A2E2A' },
  formGrid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },

  payTabs: { display: 'flex', gap: 10, marginBottom: 24 },
  payTab: { flex: 1, padding: '12px', border: '1px solid #3A2E2A', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer', borderRadius: '6px', fontFamily: 'inherit', transition: 'all 0.2s' },

  fieldLabel: { fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B0A39C', marginBottom: 6 },
  fieldError: { fontSize: 10, color: '#E24B4A', letterSpacing: '0.06em', marginTop: 4 },

  shipMethods: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 },
  shipMethod: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid', borderRadius: '8px', background: '#231C1A', cursor: 'pointer', transition: 'border-color 0.15s' },
  shipRadio: { display: 'flex', alignItems: 'center', gap: 12 },
  radioDot: { width: 16, height: 16, borderRadius: '50%', border: '2px solid', transition: 'all 0.15s', flexShrink: 0 },
  shipLabel: { fontSize: 13, fontWeight: 600, color: '#F9F6F0', textTransform: 'uppercase', letterSpacing: '0.04em' },
  shipSub: { fontSize: 10, color: '#B0A39C', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 },
  shipPrice: { fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' },

  cardIcons: { display: 'flex', gap: 8, marginBottom: 20 },
  cardIcon: { background: '#231C1A', border: '1px solid #3A2E2A', padding: '5px 10px', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#B0A39C', borderRadius: '4px' },

  secNote: { fontSize: 11, color: '#B0A39C', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px 0', borderTop: '1px solid #3A2E2A', marginTop: 8, marginBottom: 20 },

  btnRow: { display: 'flex', gap: 10 },
  btnPrimary: { background: '#D4A373', border: 'none', color: '#16110F', padding: '14px 24px', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: '6px', transition: 'background 0.15s', width: '100%' },
  btnSecondary: { background: 'transparent', border: '1px solid #3A2E2A', color: '#B0A39C', padding: '14px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: '6px', flexShrink: 0 },

  confirm: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 32px', gap: 12 },
  confirmIcon: { width: 64, height: 64, borderRadius: '50%', background: '#D4A373', color: '#16110F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, marginBottom: 8 },
  confirmTitle: { fontFamily: '"Playfair Display", serif', fontSize: 32, fontWeight: 700, textTransform: 'uppercase', color: '#F9F6F0' },
  confirmSub: { fontSize: 11, color: '#D4A373', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 },
  confirmMsg: { fontSize: 13, color: '#B0A39C', lineHeight: 1.7, maxWidth: 400, margin: '8px 0 20px' },
  confirmItems: { width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 1, background: '#3A2E2A', marginBottom: 24, borderRadius: '8px', overflow: 'hidden' },
  confirmItem: { display: 'flex', alignItems: 'center', gap: 12, background: '#231C1A', padding: '14px 16px' },
  confirmItemImg: { width: 48, height: 48, objectFit: 'cover', borderRadius: '4px' },
  confirmItemName: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#F9F6F0', letterSpacing: '-0.01em' },
  confirmItemMeta: { fontSize: 10, color: '#B0A39C', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 },
  confirmItemPrice: { fontSize: 14, fontWeight: 700, color: '#F9F6F0', marginLeft: 'auto', letterSpacing: '-0.02em' },

  summary: { background: '#231C1A', padding: '28px 24px', borderLeft: '1px solid #3A2E2A', display: 'flex', flexDirection: 'column', gap: 0 },
  summaryTitle: { fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B0A39C', marginBottom: 20 },
  summaryItem: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  summaryItemImg: { width: 52, height: 52, objectFit: 'cover', borderRadius: '6px', flexShrink: 0 },
  summaryItemBrand: { fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4A373', marginBottom: 3 },
  summaryItemName: { fontFamily: '"Playfair Display", serif', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', color: '#F9F6F0', lineHeight: 1.2 },
  summaryItemMeta: { fontSize: 10, color: '#B0A39C', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 },
  summaryItemPrice: { fontSize: 13, fontWeight: 700, color: '#F9F6F0', flexShrink: 0 },
  summaryDivider: { height: 1, background: '#3A2E2A', margin: '16px 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  summaryKey: { fontSize: 11, color: '#B0A39C', letterSpacing: '0.08em', textTransform: 'uppercase' },
  summaryVal: { fontSize: 13, fontWeight: 600, color: '#F9F6F0' },
  summaryFree: { fontSize: 11, fontWeight: 700, color: '#3a9a5c', letterSpacing: '0.08em', textTransform: 'uppercase' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 },
  summaryTotalLabel: { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0A39C' },
  summaryTotalNum: { fontSize: 28, fontWeight: 700, color: '#D4A373' },
};