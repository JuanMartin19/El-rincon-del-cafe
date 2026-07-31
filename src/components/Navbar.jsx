import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAutenticado, usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/',        label: 'Inicio' },
    { to: '/catalog', label: 'Menú' },
  ];

  const iconLinks = [
    { to: '/favorites', label: 'Favoritos', icon: HeartIcon },
    { to: '/cart',      label: 'Carrito',   icon: CartIcon },
  ];

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
        {iconLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            style={({ isActive }) => ({
              ...s.iconBtn,
              color: isActive ? '#D4A373' : '#B0A39C',
            })}
          >
            <Icon />
          </NavLink>
        ))}

        <div style={s.divider} />

        {isAutenticado ? (
          <>
            <span style={s.authLink}>Hola, {usuario?.nombre?.split(' ')[0]}</span>
            <button onClick={handleLogout} style={{ ...s.registerBtn, border: 'none', cursor: 'pointer' }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={s.authLink}>Entrar</NavLink>
            <NavLink
              to="/register"
              style={({ isActive }) => ({
                ...s.registerBtn,
                background: isActive ? '#C59364' : '#D4A373',
              })}
            >
              Registro
            </NavLink>
          </>
        )}
      </div>

      <button
        style={s.hamburger}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Menú"
      >
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {menuOpen && (
        <div style={s.drawer}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                ...s.drawerLink,
                color: isActive ? '#D4A373' : '#F9F6F0',
              })}
            >
              {label}
            </NavLink>
          ))}
          {iconLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                ...s.drawerLink,
                color: isActive ? '#D4A373' : '#F9F6F0',
              })}
            >
              {label}
            </NavLink>
          ))}
          <div style={s.drawerDivider} />
          {isAutenticado ? (
            <>
              <span style={s.drawerLink}>Hola, {usuario?.nombre?.split(' ')[0]}</span>
              <button onClick={handleLogout} style={{ ...s.drawerLink, color: '#D4A373', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    onClick={() => setMenuOpen(false)} style={s.drawerLink}>Entrar</NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)} style={{ ...s.drawerLink, color: '#D4A373' }}>Registro</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6"  x2="6"  y2="18"/>
    <line x1="6"  y1="6"  x2="18" y2="18"/>
  </svg>
);

const s = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: '#16110F',
    borderBottom: '1px solid #3A2E2A',
    display: 'flex',
    alignItems: 'center',
    padding: '0 5%',
    height: 64,
    gap: 24,
    fontFamily: '"Inter", sans-serif'
  },
  logo: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 700,
    fontFamily: '"Playfair Display", serif',
    color: '#F9F6F0',
    flexShrink: 0,
  },
  logoAccent: { color: '#D4A373', fontStyle: 'italic' },
  centerLinks: { display: 'flex', gap: 24, flex: 1, marginLeft: 20 },
  navLink: {
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    color: '#B0A39C',
    transition: 'color 0.2s',
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  rightActions: { display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' },
  iconBtn: { display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'color 0.2s' },
  divider: { width: 1, height: 20, background: '#3A2E2A' },
  authLink: { textDecoration: 'none', fontSize: 13, fontWeight: 500, color: '#B0A39C', transition: 'color 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em' },
  registerBtn: {
    textDecoration: 'none',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#16110F',
    background: '#D4A373',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'background 0.2s',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#F9F6F0',
    marginLeft: 'auto',
    padding: 0,
    '@media(maxWidth:640px)': { display: 'flex' },
  },
  drawer: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    background: '#16110F',
    borderBottom: '1px solid #3A2E2A',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 5% 20px',
    gap: 0,
  },
  drawerLink: { textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '12px 0', borderBottom: '1px solid #231C1A', transition: 'color 0.2s' },
  drawerDivider: { height: 12 },
};