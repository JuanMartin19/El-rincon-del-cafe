import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

export default function Navbar() {
  // ⚡ 1. TODOS LOS HOOKS ARRIBA (Obligatorio en React para que no crashee)
  const [menuOpen, setMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation(); 
  const { isAutenticado, usuario, logout, token } = useAuth();

  useEffect(() => {
    // Si es administrador, no necesitamos consultar carrito ni favoritos
    if (location.pathname.startsWith('/admin')) return;

    if (isAutenticado && token) {
      fetch(`${API_URL}/favoritos`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setFavCount(data.length); })
        .catch(() => setFavCount(0));

      fetch(`${API_URL}/carrito`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCartCount(data.reduce((acc, item) => acc + item.qty, 0));
          }
        })
        .catch(() => setCartCount(0));
    } else {
      setFavCount(0);
      setCartCount(0);
    }
  }, [isAutenticado, token, location.pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalog', label: 'Menú' },
  ];

  // ⚡ 2. EL RETURN TEMPRANO VA DESPUÉS DE LOS HOOKS
  // NAVBAR EXCLUSIVO PARA EL ADMINISTRADOR
  if (location.pathname.startsWith('/admin')) {
    return (
      <nav style={{ ...s.nav, background: '#0A0A0A', borderBottom: '1px solid #1E1E1E' }}>
        <div style={s.logo}>
          RINCÓN DEL<span style={s.logoAccent}>CAFÉ</span>
          <span style={s.adminBadge}>ADMIN</span>
        </div>

        <div style={s.rightActions}>
          <div style={s.liveStatus}>
            <div style={s.pulseDot} />
            Sistema en Línea
          </div>
          <div style={s.divider} />
          <button onClick={() => navigate('/')} style={s.storeBtn}>
            Ir a Tienda ↗
          </button>
        </div>
      </nav>
    );
  }

  // ☕ 3. NAVBAR NORMAL PARA CLIENTES
  return (
    <nav style={s.nav}>
      <button onClick={() => navigate('/')} style={s.logo}>
        RINCÓN DEL<span style={s.logoAccent}>CAFÉ</span>
      </button>

      <div style={s.centerLinks}>
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            style={({ isActive }) => ({
              ...s.navLink,
              color: isActive ? '#D4A373' : '#B0A39C',
              borderBottom: isActive ? '2px solid #D4A373' : '2px solid transparent',
            })}
          >
            {label}
          </NavLink>
        ))}
      </div>

      <div style={s.rightActions}>
        <NavLink to="/favorites" title="Favoritos" style={({ isActive }) => ({ ...s.iconBtn, color: isActive ? '#D4A373' : '#B0A39C' })}>
          <div style={s.iconWrapper}>
            <HeartIcon />
            {favCount > 0 && <span style={s.badge}>{favCount}</span>}
          </div>
        </NavLink>

        <NavLink to="/cart" title="Carrito" style={({ isActive }) => ({ ...s.iconBtn, color: isActive ? '#D4A373' : '#B0A39C' })}>
          <div style={s.iconWrapper}>
            <CartIcon />
            {cartCount > 0 && <span style={s.badge}>{cartCount}</span>}
          </div>
        </NavLink>

        <div style={s.divider} />

        {isAutenticado ? (
          <>
            <span style={s.authLink}>Hola, {usuario?.nombre?.split(' ')[0]}</span>
            <button onClick={handleLogout} style={{ ...s.registerBtn, border: 'none', cursor: 'pointer' }}>Salir</button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={s.authLink}>Entrar</NavLink>
            <NavLink to="/register" style={({ isActive }) => ({ ...s.registerBtn, background: isActive ? '#C59364' : '#D4A373' })}>Registro</NavLink>
          </>
        )}
      </div>

      <button style={s.hamburger} onClick={() => setMenuOpen((o) => !o)}>
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Menú Móvil (Drawer) */}
      {menuOpen && (
        <div style={s.drawer}>
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ ...s.drawerLink, color: isActive ? '#D4A373' : '#F9F6F0' })}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/favorites" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ ...s.drawerLink, color: isActive ? '#D4A373' : '#F9F6F0', display: 'flex', justifyContent: 'space-between' })}>
            <span>Favoritos</span>{favCount > 0 && <span style={s.drawerBadge}>{favCount}</span>}
          </NavLink>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)} style={({ isActive }) => ({ ...s.drawerLink, color: isActive ? '#D4A373' : '#F9F6F0', display: 'flex', justifyContent: 'space-between' })}>
            <span>Carrito</span>{cartCount > 0 && <span style={s.drawerBadge}>{cartCount}</span>}
          </NavLink>
          <div style={s.drawerDivider} />
          {isAutenticado ? (
            <>
              <span style={s.drawerLink}>Hola, {usuario?.nombre?.split(' ')[0]}</span>
              <button onClick={handleLogout} style={{ ...s.drawerLink, color: '#D4A373', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%' }}>Salir</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} style={s.drawerLink}>Entrar</NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)} style={{ ...s.drawerLink, color: '#D4A373' }}>Registro</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// Íconos SVG
const HeartIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
const CartIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>);
const MenuIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
const CloseIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Estilos
const s = {
  nav: { position: 'sticky', top: 0, zIndex: 100, background: '#16110F', borderBottom: '1px solid #3A2E2A', display: 'flex', alignItems: 'center', padding: '0 5%', height: 64, gap: 24, fontFamily: '"Inter", sans-serif' },
  logo: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: '#F9F6F0', flexShrink: 0 },
  logoAccent: { color: '#D4A373', fontStyle: 'italic' },
  adminBadge: { background: '#E24B4A', color: '#FFF', fontSize: 9, fontWeight: 700, padding: '3px 6px', borderRadius: 4, marginLeft: 10, verticalAlign: 'middle', letterSpacing: '0.1em' },
  liveStatus: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#3a9a5c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  pulseDot: { width: 8, height: 8, background: '#3a9a5c', borderRadius: '50%', boxShadow: '0 0 8px #3a9a5c' },
  storeBtn: { background: 'transparent', border: '1px solid #3A2E2A', color: '#D4A373', padding: '6px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s' },
  centerLinks: { display: 'flex', gap: 24, flex: 1, marginLeft: 20 },
  navLink: { textDecoration: 'none', fontSize: 13, fontWeight: 500, color: '#B0A39C', transition: 'color 0.2s', paddingBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },
  rightActions: { display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto' },
  iconBtn: { display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'color 0.2s', position: 'relative' },
  iconWrapper: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 },
  badge: { position: 'absolute', top: -4, right: -8, background: '#D4A373', color: '#16110F', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: '10px', lineHeight: 1 },
  divider: { width: 1, height: 20, background: '#3A2E2A' },
  authLink: { textDecoration: 'none', fontSize: 13, fontWeight: 500, color: '#B0A39C', transition: 'color 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em' },
  registerBtn: { textDecoration: 'none', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#16110F', background: '#D4A373', padding: '8px 16px', borderRadius: '6px', transition: 'background 0.2s' },
  hamburger: { display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#F9F6F0', marginLeft: 'auto', padding: 0 },
  drawer: { position: 'absolute', top: 64, left: 0, right: 0, background: '#16110F', borderBottom: '1px solid #3A2E2A', display: 'flex', flexDirection: 'column', padding: '16px 5% 20px', gap: 0 },
  drawerLink: { textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '12px 0', borderBottom: '1px solid #231C1A', transition: 'color 0.2s', alignItems: 'center' },
  drawerBadge: { background: '#D4A373', color: '#16110F', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: '10px' },
  drawerDivider: { height: 12 },
};