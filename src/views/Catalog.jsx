import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { showToast } from "../components/ToastProvider";
import { API_URL } from "../config";
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ["Todos", "Caliente", "Frío", "Postres"];
const noImageSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23231C1A'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13px' font-weight='bold' fill='%23B0A39C'%3ESin Foto%3C/text%3E%3C/svg%3E";

export default function Catalog() {
  const navigate = useNavigate();
  const { isAutenticado, token } = useAuth();

  const [products, setProducts] = useState([]);
  const [promociones, setPromociones] = useState([]); // ⚡ Promos activas
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState(150);
  const [favorites, setFavorites] = useState([]);

  // Cargar productos y promociones activas
  useEffect(() => {
    let cancelado = false;
    async function cargarDatos() {
      setLoading(true);
      setLoadError(false);
      try {
        const [resProd, resPromo] = await Promise.all([
          fetch(`${API_URL}/productos`),
          fetch(`${API_URL}/promociones/activas`)
        ]);

        if (!resProd.ok) throw new Error("Error al cargar productos");
        const dataProd = await resProd.json();
        const dataPromo = await resPromo.json();

        const normalizado = dataProd.map((p) => ({ ...p, price: Number(p.price) }));
        
        if (!cancelado) {
          setProducts(normalizado);
          setPromociones(dataPromo);
        }
      } catch {
        if (!cancelado) setLoadError(true);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    cargarDatos();
    return () => { cancelado = true; };
  }, []);

  // Cargar favoritos
  useEffect(() => {
    if (isAutenticado && token) {
      fetch(`${API_URL}/favoritos`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setFavorites(data.map(p => p.id)); })
      .catch(console.error);
    }
  }, [isAutenticado, token]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchTerm.trim()) {
      const fuse = new Fuse(products, { keys: ["name", "category", "type"], threshold: 0.4 });
      result = fuse.search(searchTerm).map((res) => res.item);
    }
    return result.filter((p) => (selectedCategory === "Todos" || p.category === selectedCategory) && p.price <= maxPrice);
  }, [products, searchTerm, selectedCategory, maxPrice]);

  const toggleFav = async (product) => {
    if (!isAutenticado) {
      showToast({ icon: '⚠️', title: 'Inicia sesión', sub: 'Para guardar tus favoritos' });
      return navigate('/login');
    }
    const isFav = favorites.includes(product.id);
    setFavorites((prev) => isFav ? prev.filter((f) => f !== product.id) : [...prev, product.id]);
    showToast({ icon: isFav ? "♡" : "♥", title: isFav ? "Eliminado de favoritos" : "Guardado en favoritos", sub: product.name });

    try {
      await fetch(`${API_URL}/favoritos/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ producto_id: product.id })
      });
    } catch (error) { console.error("Error al guardar favorito", error); }
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
      if (res.ok) showToast({ icon: "✓", title: "Agregado al pedido", sub: product.name });
      else showToast({ icon: "✕", title: "Error", sub: "No se pudo agregar al carrito" });
    } catch (err) {
      console.error(err);
      showToast({ icon: "✕", title: "Error de red", sub: "Intenta de nuevo" });
    }
  };

  return (
    <div style={s.root}>
      <div style={s.hero}>
        <div style={s.heroEyebrow}>— Menú</div>
        <h1 style={s.heroTitle}>Nuestras<br /><span style={s.heroAccent}>Opciones</span></h1>
        <p style={s.heroSub}>Encuentra tu bebida y acompañamiento ideal con los mejores precios</p>
      </div>

      <div style={s.layout}>
        <aside style={s.sidebar}>
          <div style={s.sidebarLabel}>Filtros</div>
          <div style={s.filterGroup}>
            <div style={s.filterTitle}>Buscar</div>
            <input type="text" placeholder="Ej. frap, moka, pan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={s.searchInput} />
          </div>
          <div style={s.filterGroup}>
            <div style={s.filterTitle}>Categoría</div>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)} style={{ ...s.brandBtn, color: selectedCategory === c ? "#D4A373" : "#B0A39C", fontWeight: selectedCategory === c ? 600 : 400 }}>{c}</button>
            ))}
          </div>
          <div style={s.filterGroup}>
            <div style={s.filterTitle}>Precio máx.</div>
            <div style={s.priceVal}>${maxPrice.toLocaleString("es-MX")}</div>
            <input type="range" min={20} max={150} step={5} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={s.priceRange} />
            <div style={s.priceRangeLabels}><span>$20</span><span>$150</span></div>
          </div>
        </aside>

        <main style={s.catalogArea}>
          <div style={s.catalogHeader}>
            <span style={s.catalogTitle}>Catálogo</span>
            <span style={s.catalogCount}><span style={s.catalogCountNum}>{filteredProducts.length}</span> opciones</span>
          </div>

          {loading ? (
            <div style={s.empty}>Cargando menú…</div>
          ) : loadError ? (
            <div style={s.empty}>No pudimos cargar el menú. Verifica que el servidor esté corriendo.</div>
          ) : filteredProducts.length === 0 ? (
            <div style={s.empty}>No encontramos opciones que coincidan con tu búsqueda.</div>
          ) : (
            <div style={s.grid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  promociones={promociones}
                  isFav={favorites.includes(product.id)}
                  onToggleFav={() => toggleFav(product)}
                  onAddCart={() => addToCart(product)}
                  onView={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ProductCard({ product, promociones, isFav, onToggleFav, onAddCart, onView }) {
  const [hovered, setHovered] = useState(false);
  const servidorBase = API_URL.replace('/api', '');
  const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `${servidorBase}${product.image}`) : noImageSvg;

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

  return (
    <div
      style={{ ...s.card, background: hovered ? "#2C2321" : "#231C1A", transform: hovered ? "translateY(-4px)" : "none", boxShadow: hovered ? "0 10px 20px rgba(0,0,0,0.3)" : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.imgWrap}>
        <img
          src={imageUrl} alt={product.name}
          style={{ ...s.img, transform: hovered ? "scale(1.05)" : "scale(1)" }}
          onError={(e) => { if (e.target.src !== noImageSvg) e.target.src = noImageSvg; }}
        />
        <span style={s.brandTag}>{product.category}</span>
        
        {/* ⚡ Muestra el distintivo de la promo si existe */}
        {badgePromo && <span style={s.promoBadge}>{badgePromo}</span>}

        <button onClick={onToggleFav} style={{ ...s.favBtn, color: isFav ? "#D4A373" : "#B0A39C", borderColor: isFav ? "#D4A373" : "#3A2E2A" }}>
          {isFav ? "♥" : "♡"}
        </button>
      </div>

      <div style={s.cardBody}>
        <div style={s.cardName}>{product.name}</div>
        <div style={s.cardSize}>{product.type}</div>
        
        {/* ⚡ Precio con descuento tachado si aplica */}
        <div style={s.priceWrapper}>
          {badgePromo && precioFinal < product.price ? (
            <>
              <span style={s.oldPrice}>${product.price.toLocaleString("es-MX")}</span>
              <span style={s.cardPrice}>${precioFinal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
            </>
          ) : (
            <span style={s.cardPrice}>${product.price.toLocaleString("es-MX")}</span>
          )}
        </div>

        <div style={s.cardActions}>
          <button onClick={onAddCart} style={{ ...s.cardBtnPrimary, background: hovered ? "#D4A373" : "transparent", color: hovered ? "#16110F" : "#D4A373", borderColor: hovered ? "#D4A373" : "#3A2E2A" }}>+ Agregar</button>
          <button onClick={onView} style={{ ...s.cardBtnSecondary, borderColor: hovered ? "#4A3D36" : "#3A2E2A" }}>Ver →</button>
        </div>
      </div>
    </div>
  );
}

// Estilos actualizados para incluir badges de promociones y precios tachados
const s = {
  root: { background: "#16110F", minHeight: "100vh", color: "#F9F6F0", fontFamily: '"Inter", sans-serif' },
  hero: { padding: "48px 5% 40px", borderBottom: "1px solid #3A2E2A", position: "relative", overflow: "hidden" },
  heroEyebrow: { fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D4A373", fontWeight: 600, marginBottom: 12 },
  heroTitle: { fontFamily: '"Playfair Display", serif', fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.1, color: "#F9F6F0", margin: 0 },
  heroAccent: { color: "#D4A373", fontStyle: "italic" },
  heroSub: { marginTop: 16, fontSize: 15, color: "#B0A39C" },
  layout: { display: "flex", padding: "0 5%" },
  sidebar: { width: 240, minWidth: 240, borderRight: "1px solid #3A2E2A", padding: "32px 32px 32px 0" },
  sidebarLabel: { fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D4A373", marginBottom: 24, fontWeight: 600 },
  filterGroup: { marginBottom: 32 },
  filterTitle: { fontSize: 13, color: "#F9F6F0", marginBottom: 12, fontWeight: 600 },
  searchInput: { width: "100%", background: "#231C1A", border: "1px solid #3A2E2A", borderRadius: "8px", padding: "12px 16px", color: "#F9F6F0", fontSize: 14, outline: "none", boxSizing: "border-box" },
  brandBtn: { display: "block", width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #231C1A", padding: "10px 0", textAlign: "left", fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  priceVal: { fontSize: 24, fontWeight: 600, color: "#D4A373", marginBottom: 12 },
  priceRange: { width: "100%", accentColor: "#D4A373", cursor: "pointer" },
  priceRangeLabels: { display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "#B0A39C" },
  catalogArea: { flex: 1, padding: "32px 0 32px 40px" },
  catalogHeader: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32, borderBottom: "1px solid #3A2E2A", paddingBottom: 16 },
  catalogTitle: { fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B0A39C", fontWeight: 600 },
  catalogCount: { fontSize: 13, color: "#B0A39C" },
  catalogCountNum: { color: "#D4A373", fontWeight: 600, fontSize: 15 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 },
  card: { borderRadius: "12px", overflow: "hidden", background: "#231C1A", border: "1px solid #3A2E2A", transition: "all 0.3s ease", cursor: "pointer" },
  imgWrap: { position: "relative", height: 220, overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" },
  brandTag: { position: "absolute", top: 12, left: 12, background: "#D4A373", color: "#16110F", fontSize: 11, fontWeight: 600, textTransform: "uppercase", padding: "4px 12px", borderRadius: "4px" },
  promoBadge: { position: "absolute", top: 12, left: 90, background: "#E24B4A", color: "#FFF", fontSize: 11, fontWeight: 700, textTransform: "uppercase", padding: "4px 8px", borderRadius: "4px" },
  favBtn: { position: "absolute", top: 12, right: 12, background: "rgba(22,17,15,0.4)", border: "1px solid #3A2E2A", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" },
  cardBody: { padding: "20px" },
  cardName: { fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 600, color: "#F9F6F0", marginBottom: 4 },
  cardSize: { fontSize: 13, color: "#B0A39C", marginBottom: 12 },
  priceWrapper: { display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 },
  oldPrice: { fontSize: 13, color: '#B0A39C', textDecoration: 'line-through' },
  cardPrice: { fontSize: 18, fontWeight: 600, color: "#D4A373", margin: 0 },
  cardActions: { display: "flex", gap: 10 },
  cardBtnPrimary: { flex: 1, background: "transparent", border: "1px solid #3A2E2A", borderRadius: "6px", padding: "10px 0", fontSize: 13, fontWeight: 600, color: "#D4A373", cursor: "pointer" },
  cardBtnSecondary: { background: "transparent", border: "1px solid #3A2E2A", borderRadius: "6px", color: "#B0A39C", padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  empty: { padding: "80px 0", textAlign: "center", color: "#B0A39C", fontSize: 15 },
};