import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastProvider';
import ContactForm from '../components/ContactForm';
import LocationMap from '../components/LocationMap';
import s, { GLOBAL_CSS } from './Home.styles';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const BANNER_MSGS = [
  '10% de descuento en tu primer café',
  'Nuevos granos de origen colombiano',
  'Acompaña tu bebida con nuestro pan artesanal recién horneado',
];

const CATEGORIES = ['Todos', 'Caliente', 'Frío', 'Postres', 'Té', 'Promociones'];
const noImageSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23231C1A'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13px' font-weight='bold' fill='%23B0A39C'%3ESin Foto%3C/text%3E%3C/svg%3E";

export default function Home() {
  const navigate = useNavigate();
  const { isAutenticado, token } = useAuth();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [promosActivas, setPromosActivas] = useState([]);

  const [emailInput, setEmailInput] = useState('');
  const [isSubmittingNl, setIsSubmittingNl] = useState(false);

  useEffect(() => {
    let cancelado = false;
    async function cargarDatos() {
      try {
        const [resProd, resPromo] = await Promise.all([
          fetch(`${API_URL}/productos/destacados`),
          fetch(`${API_URL}/promociones/activas`)
        ]);

        if (!resProd.ok) throw new Error('Error al cargar destacados');
        const dataProd = await resProd.json();
        const dataPromo = await resPromo.json();
        
        const normalizado = dataProd.map((p) => ({ 
          ...p, 
          price: Number(p.price),
          brand: 'De la casa',
          badge: 'Destacado'
        }));
        
        if (!cancelado) {
          setFeaturedProducts(normalizado);
          setPromosActivas(dataPromo);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    cargarDatos();
    return () => { cancelado = true; };
  }, []);

  useEffect(() => {
    if (isAutenticado && token) {
      fetch(`${API_URL}/favoritos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => { setFavorites(data.map(p => p.id)); })
      .catch(console.error);
    }
  }, [isAutenticado, token]);

  const [bannerIdx, setBannerIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBannerIdx((p) => (p + 1) % BANNER_MSGS.length), 3000);
    return () => clearInterval(id);
  }, []);

  const [notification, setNotification] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => setNotification(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const [newsletter, setNewsletter] = useState(false);
  const [nlDismissed, setNlDismissed] = useState(false);
  useEffect(() => {
    if (nlDismissed) return;
    const t = setTimeout(() => setNewsletter(true), 8000);
    return () => clearTimeout(t);
  }, [nlDismissed]);
  
  const handleSubscribe = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      showToast({ icon: '⚠️', title: 'Email inválido', sub: 'Por favor ingresa un correo válido.' });
      return;
    }

    setIsSubmittingNl(true);

    try {
      const res = await fetch(`${API_URL}/contacto/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      
      const data = await res.json();

      if (res.ok) {
        setNewsletter(false);
        setNlDismissed(true);
        showToast({ icon: '✓', title: '¡Suscrito!', sub: 'Te enviaremos promociones pronto.' });
        setEmailInput('');
      } else {
        showToast({ icon: '⚠️', title: 'Atención', sub: data.message });
      }
    } catch (err) {
      showToast({ icon: '✕', title: 'Error', sub: 'No pudimos conectar con el servidor.' });
    } finally {
      setIsSubmittingNl(false);
    }
  };

  const toggleFav = async (item) => {
    if (!isAutenticado) {
      showToast({ icon: '⚠️', title: 'Inicia sesión', sub: 'Para guardar tus favoritos' });
      return navigate('/login');
    }

    const isFav = favorites.includes(item.id);
    setFavorites((prev) => isFav ? prev.filter((f) => f !== item.id) : [...prev, item.id]);
    showToast({ icon: isFav ? '♡' : '♥', title: isFav ? 'Eliminado de favoritos' : 'Guardado en favoritos', sub: item.name });

    try {
      await fetch(`${API_URL}/favoritos/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ producto_id: item.id })
      });
    } catch (error) { console.error("Error al actualizar favorito", error); }
  };
  
  const addToCart = async (item) => {
    if (!isAutenticado) {
      showToast({ icon: '⚠️', title: 'Inicia sesión', sub: 'Para agregar al pedido' });
      return navigate('/login');
    }

    try {
      const res = await fetch(`${API_URL}/carrito/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ producto_id: item.id, cantidad: 1 })
      });

      if (res.ok) showToast({ icon: '✓', title: 'Agregado al pedido', sub: item.name });
      else showToast({ icon: '✕', title: 'Error', sub: 'No se pudo agregar al carrito' });
    } catch (err) {
      console.error(err);
      showToast({ icon: '✕', title: 'Error de red', sub: 'Intenta de nuevo' });
    }
  };

  const [activeCategory, setActiveCategory] = useState('Todos');
  const filtered = activeCategory === 'Todos'
    ? featuredProducts
    : featuredProducts.filter((s) => s.category === activeCategory);

  const promoPrincipal = promosActivas.length > 0 ? promosActivas[0] : null;
  const promosSecundarias = promosActivas.length > 1 ? promosActivas.slice(1) : [];

  return (
    <div style={s.root}>
      <style>{GLOBAL_CSS}</style>

      <div style={s.ticker}>
        <span style={s.tickerDot} />
        <span key={bannerIdx} style={{ animation: 'fadeIn 0.4s ease' }}>{BANNER_MSGS[bannerIdx]}</span>
      </div>

      <div style={s.catBar}>
        <div className="sd-cat-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...s.catBtn,
                background: activeCategory === cat ? '#D4A373' : 'transparent',
                color: activeCategory === cat ? '#16110F' : '#B0A39C',
                borderColor: activeCategory === cat ? '#D4A373' : '#3A2E2A',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="sd-hero">
        <div style={s.heroLeft}>
          <div style={s.heroEyebrow}>— Recién hecho</div>
          <h1 style={s.heroTitle}>El mejor inicio<br />para tu <span style={s.heroAccent}>día</span></h1>
          <p style={s.heroSub}>Granos seleccionados y tostados a la perfección.<br />Pide en línea y recoge sin filas.</p>
          <div style={s.heroCtas}>
            <button onClick={() => navigate('/catalog')} style={s.ctaPrimary}>Ver Menú →</button>
            <button onClick={() => navigate('/catalog')} style={s.ctaSecondary}>Especiales</button>
          </div>
        </div>
        <div className="sd-hero-img" style={s.heroRight}>
          <img src="https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600" alt="Café destacado" style={s.heroImg} />
          <div style={s.heroBadge}>★ Favorito de la casa</div>
          <div style={s.heroWatermark} aria-hidden="true">01</div>
        </div>
      </section>

      {promoPrincipal && (
        <div style={s.promoStrip}>
          <div>
            <div style={s.promoTitle}>{promoPrincipal.titulo}</div>
            <div style={s.promoSub}>{promoPrincipal.descripcion}</div>
          </div>
          <button onClick={() => navigate('/catalog')} style={s.ctaPromo}>Aprovechar →</button>
        </div>
      )}

      <section style={s.featured}>
        <div style={s.sectionHeader}>
          <div style={s.sectionEyebrow}>— Nuestras bebidas</div>
          <h2 style={s.sectionTitle}>Menú Destacado</h2>
          <p style={s.sectionSub}>Lo más pedido por nuestros clientes</p>
        </div>

        <div className="sd-content">
          <div>
            <div className="sd-grid">
              {loading ? (
                <div style={{ color: '#B0A39C', padding: '40px 0', fontSize: '15px' }}>Cargando destacados...</div>
              ) : filtered.length === 0 ? (
                <div style={{ color: '#B0A39C', padding: '40px 0', fontSize: '15px' }}>Aún no hay productos destacados en esta categoría.</div>
              ) : (
                filtered.map((item, idx) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    index={idx}
                    isFav={favorites.includes(item.id)}
                    onToggleFav={() => toggleFav(item)}
                    onAddCart={() => addToCart(item)}
                    onView={() => navigate(`/product/${item.id}`)}
                  />
                ))
              )}
            </div>
          </div>

          <aside className="sd-sidebar" aria-label="Espacio publicitario">
            <div style={s.adLabel}>Promociones Activas</div>
            
            {promosSecundarias.length === 0 && !promoPrincipal ? (
              <div style={{ color: '#B0A39C', fontSize: 13, padding: '10px 0' }}>No hay más promociones por ahora.</div>
            ) : null}

            {promosSecundarias.map((promo, i) => {
              const servidorBase = API_URL.replace('/api', '');
              const promoImg = promo.imagen ? `${servidorBase}${promo.imagen}` : "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=728&h=90&fit=crop";

              return (
                <div key={promo.id} style={{ ...s.halfpage, marginBottom: i < promosSecundarias.length - 1 ? 20 : 0 }}>
                  <img src={promoImg} alt={promo.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={s.halfpageOverlay}>
                    <div style={s.halfpageTitle}>{promo.titulo}</div>
                    <div style={s.halfpageSub}>{promo.descripcion}</div>
                    <button onClick={() => navigate('/catalog')} style={s.mrectCta}>Ver Menú →</button>
                  </div>
                </div>
              );
            })}
          </aside>
        </div>
      </section>

      <section style={s.contactSection}>
        <div style={s.sectionHeader}>
          <div style={s.sectionEyebrow}>— Visítanos</div>
          <h2 style={s.sectionTitle}>Contáctanos</h2>
          <p style={s.sectionSub}>Haz tu pedido o cuéntanos tu experiencia</p>
        </div>
        <div className="sd-contact-grid"><ContactForm /><LocationMap /></div>
      </section>

      {notification && (
        <div style={s.notif} role="dialog" aria-label="Drop inminente">
          <div style={s.notifHeader}>
            <span style={s.notifLabel}>⚡ Pan recién horneado</span>
            <button onClick={() => setNotification(null)} style={s.notifClose} aria-label="Cerrar">✕</button>
          </div>
          <p style={s.notifMsg}>Acaban de salir nuestros croissants de mantequilla. ¡Pide el tuyo antes de que se acaben!</p>
          <button onClick={() => { setNotification(null); navigate('/catalog'); }} style={s.notifCta}>Ir al Menú →</button>
        </div>
      )}

      {newsletter && (
        <div style={s.nlOverlay} role="dialog" aria-modal="true" aria-label="Suscríbete al newsletter">
          <div style={s.nlModal}>
            <button onClick={() => { setNewsletter(false); setNlDismissed(true); }} style={s.nlClose} aria-label="Cerrar">✕</button>
            <div style={s.nlEyebrow}>Beneficios exclusivos</div>
            <h2 style={s.nlTitle}>Sé el primero<br />en probarlos</h2>
            <p style={s.nlSub}>Suscríbete y recibe descuentos y promociones antes que nadie.</p>
            <div style={s.nlForm}>
              <input 
                type="email" 
                placeholder="tu@email.com" 
                style={s.nlInput} 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button 
                onClick={handleSubscribe} 
                style={s.ctaPrimary}
                disabled={isSubmittingNl}
              >
                {isSubmittingNl ? 'Enviando...' : 'Suscribirse →'}
              </button>
            </div>
            <button onClick={() => { setNewsletter(false); setNlDismissed(true); }} style={s.nlSkip}>No, gracias</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, index, isFav, onToggleFav, onAddCart, onView }) {
  const [hovered, setHovered] = useState(false);
  const servidorBase = API_URL.replace('/api', '');
  const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${servidorBase}${item.image}`) : noImageSvg;

  return (
    <div
      style={{ ...s.card, background: hovered ? '#2C2321' : '#231C1A', transform: hovered ? 'translateY(-4px)' : 'none', boxShadow: hovered ? '0 10px 20px rgba(0,0,0,0.3)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.cardImgWrap}>
        <img
          src={imageUrl}
          alt={item.name}
          style={{ ...s.cardImg, transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          onError={(e) => { if (e.target.src !== noImageSvg) e.target.src = noImageSvg; }}
        />
        <span style={s.cardBadge}>{item.badge}</span>
        <button onClick={onToggleFav} style={{ ...s.favBtn, color: isFav ? '#D4A373' : '#B0A39C', borderColor: isFav ? '#D4A373' : '#3A2E2A' }}>
          {isFav ? '♥' : '♡'}
        </button>
        <span style={s.cardNum} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div style={s.cardBody}>
        <div style={s.cardMeta}>{item.category} · {item.brand}</div>
        <div style={s.cardName}>{item.name}</div>
        <div style={s.cardPrice}>{'$' + item.price.toLocaleString('es-MX')}</div>
        <div style={s.cardActions}>
          <button
            onClick={onAddCart}
            style={{ ...s.cardBtnPrimary, background: hovered ? '#D4A373' : 'transparent', color: hovered ? '#16110F' : '#D4A373' }}
          >
            + Agregar
          </button>
          <button onClick={onView} style={{ ...s.cardBtnSecondary, borderColor: hovered ? '#4A3D36' : '#3A2E2A' }}>Ver →</button>
        </div>
      </div>
    </div>
  );
}