import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ToastProvider';
import ContactForm from '../components/ContactForm';
import LocationMap from '../components/LocationMap';
import s, { GLOBAL_CSS } from './Home.styles';

const featuredCoffee = [
  { id: 1, name: 'Espresso Doble', brand: 'Clásico', category: 'Caliente', price: 45, badge: 'Popular', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { id: 2, name: 'Frappé Caramelo', brand: 'Especial', category: 'Frío', price: 85, badge: 'Top', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400' },
  { id: 3, name: 'Latte Vainilla', brand: 'Favorito', category: 'Caliente', price: 65, badge: 'Oferta', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400' },
];

const BANNER_MSGS = [
  '10% de descuento en tu primer café',
  'Nuevos granos de origen colombiano',
  'Acompaña tu bebida con nuestro pan artesanal recién horneado',
];

const CATEGORIES = ['Todos', 'Caliente', 'Frío', 'Postres', 'Té', 'Promociones'];

export default function Home() {
  const navigate = useNavigate();

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

  const [favorites, setFavorites] = useState([]);
  const toggleFav = (item) => {
    const isFav = favorites.includes(item.id);
    setFavorites((prev) => isFav ? prev.filter((f) => f !== item.id) : [...prev, item.id]);
    showToast({ icon: isFav ? '♡' : '♥', title: isFav ? 'Eliminado de favoritos' : 'Guardado en favoritos', sub: item.name });
  };
  const addToCart = (item) => {
    showToast({ icon: '✓', title: 'Agregado al pedido', sub: item.name });
  };

  const [activeCategory, setActiveCategory] = useState('Todos');
  const filtered = activeCategory === 'Todos'
    ? featuredCoffee
    : featuredCoffee.filter((s) => s.category === activeCategory);

  return (
    <div style={s.root}>
      <style>{GLOBAL_CSS}</style>

      <div style={s.ticker}>
        <span style={s.tickerDot} />
        <span key={bannerIdx} style={{ animation: 'fadeIn 0.4s ease' }}>
          {BANNER_MSGS[bannerIdx]}
        </span>
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
          <h1 style={s.heroTitle}>
            El mejor inicio<br />para tu <span style={s.heroAccent}>día</span>
          </h1>
          <p style={s.heroSub}>
            Granos seleccionados y tostados a la perfección.<br />
            Pide en línea y recoge sin filas.
          </p>
          <div style={s.heroCtas}>
            <button onClick={() => navigate('/catalog')} style={s.ctaPrimary}>Ver Menú →</button>
            <button onClick={() => navigate('/catalog')} style={s.ctaSecondary}>Especiales</button>
          </div>
        </div>
        <div className="sd-hero-img" style={s.heroRight}>
          <img
            src="https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600"
            alt="Café destacado"
            style={s.heroImg}
          />
          <div style={s.heroBadge}>★ Favorito de la casa</div>
          <div style={s.heroWatermark} aria-hidden="true">01</div>
        </div>
      </section>

      <div style={s.promoStrip}>
        <div>
          <div style={s.promoTitle}>2x1 en Frappés los Martes</div>
          <div style={s.promoSub}>Promoción válida en tienda y pedidos web</div>
        </div>
        <button onClick={() => navigate('/catalog')} style={s.ctaPrimary}>Pedir ahora →</button>
      </div>

      <section style={s.featured}>
        <div style={s.sectionHeader}>
          <div style={s.sectionEyebrow}>— Nuestras bebidas</div>
          <h2 style={s.sectionTitle}>Menú Destacado</h2>
          <p style={s.sectionSub}>Lo más pedido por nuestros clientes</p>
        </div>

        <div className="sd-content">
          <div>
            <div className="sd-grid">
              {filtered.map((item, idx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={idx}
                  isFav={favorites.includes(item.id)}
                  onToggleFav={() => toggleFav(item)}
                  onAddCart={() => addToCart(item)}
                  onView={() => navigate(`/product/${item.id}`)}
                />
              ))}
            </div>
          </div>

          <aside className="sd-sidebar" aria-label="Espacio publicitario">
            <div style={s.adLabel}>Acompañamiento</div>
            <div style={s.mrect}>
              <img
                src="https://images.unsplash.com/photo-1509365465994-3e8f29f4bce1?w=728&h=90&fit=crop"
                alt="Postres"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={s.mrectOverlay}>
                <div style={s.mrectTitle}>Galletas Artesanales</div>
                <button style={s.mrectCta}>Agregar →</button>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={s.adLabel}>Promoción</div>
              <div style={s.halfpage}>
                <img
                src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=728&h=90&fit=crop"
                  alt="Combo café"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={s.halfpageOverlay}>
                  <div style={s.halfpageTitle}>Combo Mañana</div>
                  <div style={s.halfpageSub}>Café + Pan $85</div>
                  <button style={s.mrectCta}>Pedir combo →</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section style={s.contactSection}>
        <div style={s.sectionHeader}>
          <div style={s.sectionEyebrow}>— Visítanos</div>
          <h2 style={s.sectionTitle}>Contáctanos</h2>
          <p style={s.sectionSub}>Haz tu pedido o cuéntanos tu experiencia</p>
        </div>

        <div className="sd-contact-grid">
          <ContactForm />
          <LocationMap />
        </div>
      </section>

      {notification && (
        <div style={s.notif} role="dialog" aria-label="Drop inminente">
          <div style={s.notifHeader}>
            <span style={s.notifLabel}>⚡ Pan recién horneado</span>
            <button onClick={() => setNotification(null)} style={s.notifClose} aria-label="Cerrar">✕</button>
          </div>
          <p style={s.notifMsg}>
            Acaban de salir nuestros croissants de mantequilla. ¡Pide el tuyo antes de que se acaben!
          </p>
          <button
            onClick={() => { setNotification(null); navigate('/catalog'); }}
            style={s.notifCta}
          >
            Ir al Menú →
          </button>
        </div>
      )}

      {newsletter && (
        <div style={s.nlOverlay} role="dialog" aria-modal="true" aria-label="Suscríbete al newsletter">
          <div style={s.nlModal}>
            <button
              onClick={() => { setNewsletter(false); setNlDismissed(true); }}
              style={s.nlClose}
              aria-label="Cerrar"
            >
              ✕
            </button>
            <div style={s.nlEyebrow}>Beneficios exclusivos</div>
            <h2 style={s.nlTitle}>Sé el primero<br />en probarlos</h2>
            <p style={s.nlSub}>Suscríbete y recibe descuentos y promociones antes que nadie.</p>
            <div style={s.nlForm}>
              <input
                type="email"
                placeholder="tu@email.com"
                style={s.nlInput}
              />
              <button
                onClick={() => { setNewsletter(false); setNlDismissed(true); showToast({ icon: '✓', title: 'Suscrito', sub: 'Te enviaremos promociones pronto' }); }}
                style={s.ctaPrimary}
              >
                Suscribirse →
              </button>
            </div>
            <button
              onClick={() => { setNewsletter(false); setNlDismissed(true); }}
              style={s.nlSkip}
            >
              No, gracias
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, index, isFav, onToggleFav, onAddCart, onView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...s.card, background: hovered ? '#2C2321' : '#231C1A', transform: hovered ? 'translateY(-4px)' : 'none', boxShadow: hovered ? '0 10px 20px rgba(0,0,0,0.3)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.cardImgWrap}>
        <img
          src={item.image}
          alt={item.name}
          style={{ ...s.cardImg, transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
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
            style={{
              ...s.cardBtnPrimary,
              background: hovered ? '#D4A373' : 'transparent',
              color: hovered ? '#16110F' : '#D4A373',
            }}
          >
            + Agregar
          </button>
          <button onClick={onView} style={{ ...s.cardBtnSecondary, borderColor: hovered ? '#4A3D36' : '#3A2E2A' }}>Ver →</button>
        </div>
      </div>
    </div>
  );
}