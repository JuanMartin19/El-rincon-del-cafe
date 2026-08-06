import React from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { usuario, isAutenticado, logout } = useAuth();

  // 1. Si no está autenticado o el usuario aún no carga en memoria, bloqueamos el acceso
  if (!isAutenticado || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // 2. Validación de rol ultra segura (evita el error que te sacaba)
  const rol = usuario?.rol ? String(usuario.rol).toLowerCase().trim() : '';
  const esAdmin = rol === 'admin' || rol.includes('administrador');

  // 3. Si no es admin, lo mandamos a la tienda principal, NUNCA al carrito
  if (!esAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={s.layout}>
      {/* === MENÚ LATERAL FIJO (SIDEBAR) === */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          RINCÓN DEL<span style={s.logoAccent}>CAFÉ</span>
        </div>
        <div style={s.badgeAdmin}>Panel de Control</div>

        <nav style={s.nav}>
          <NavLink 
            to="/admin" 
            end
            style={({ isActive }) => ({ ...s.navBtn, ...(isActive ? s.navBtnActive : {}) })}
          >
            Órdenes en Vivo
          </NavLink>
          <NavLink 
            to="/admin/inventory" 
            style={({ isActive }) => ({ ...s.navBtn, ...(isActive ? s.navBtnActive : {}) })}
          >
            Inventario
          </NavLink>
          <NavLink 
            to="/admin/users" 
            style={({ isActive }) => ({ ...s.navBtn, ...(isActive ? s.navBtnActive : {}) })}
          >
            Usuarios
          </NavLink>
          <NavLink 
            to="/admin/promos"
            style={({ isActive }) => ({ ...s.navBtn, ...(isActive ? s.navBtnActive : {}) })}
          >
            Promociones
          </NavLink>
          <NavLink 
            to="/admin/wearable" 
            style={({ isActive }) => ({ ...s.navBtn, ...(isActive ? s.navBtnActive : {}) })}
          >
            Vincular Reloj
          </NavLink>
          <NavLink 
            to="/admin/reports" 
            style={({ isActive }) => ({ ...s.navBtn, ...(isActive ? s.navBtnActive : {}) })}
          >
            Reportes
          </NavLink>
        </nav>

        <div style={s.userSection}>
          <div style={s.userInfo}>
            <div style={s.userName}>{usuario.nombre}</div>
            <div style={s.userRole}>Gerente de Turno</div>
          </div>
          <button onClick={handleLogout} style={s.logoutBtn}>Cerrar Sesión</button>
        </div>
      </aside>

      {/* === AQUÍ SE INYECTAN LAS PESTAÑAS (AdminOrders, AdminUsers, etc) === */}
      <main style={s.main}>
        <Outlet /> 
      </main>
    </div>
  );
}

const s = {
  layout: { display: 'flex', height: 'calc(100vh - 64px)', background: '#0A0A0A', color: '#F9F6F0', fontFamily: '"Inter", sans-serif' },
  sidebar: { width: 280, background: '#16110F', borderRight: '1px solid #3A2E2A', display: 'flex', flexDirection: 'column', padding: '32px 24px', flexShrink: 0 },
  logo: { fontSize: 20, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: '#F9F6F0' },
  logoAccent: { color: '#D4A373', fontStyle: 'italic' },
  badgeAdmin: { display: 'inline-block', background: '#3A2E2A', color: '#D4A373', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '4px', marginTop: 12, alignSelf: 'flex-start' },
  nav: { marginTop: 48, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  navBtn: { background: 'transparent', border: 'none', borderLeft: '4px solid transparent', color: '#B0A39C', padding: '14px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'block', textDecoration: 'none' },
  navBtnActive: { background: '#231C1A', color: '#D4A373', borderLeft: '4px solid #D4A373' },
  userSection: { borderTop: '1px solid #3A2E2A', paddingTop: 24, marginTop: 'auto' },
  userInfo: { marginBottom: 16 },
  userName: { fontSize: 14, fontWeight: 700, color: '#F9F6F0', textTransform: 'capitalize' },
  userRole: { fontSize: 11, color: '#B0A39C', marginTop: 4 },
  logoutBtn: { width: '100%', background: 'transparent', border: '1px solid #3A2E2A', color: '#E24B4A', padding: '10px', borderRadius: '6px', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#0A0A0A' }
};