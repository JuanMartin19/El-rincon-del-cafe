import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'admin' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarUsuarios = () => {
    const token = localStorage.getItem('rdc_token');
    
    // ⚡ SEGURO ANTI-NULL
    if (!token || token === 'null' || token === 'undefined') {
      setError('Tu sesión expiró o no tienes acceso. Por favor cierra sesión y vuelve a entrar.');
      return;
    }
    
    fetch(`${API_URL}/auth/usuarios`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('No autorizado');
        return res.json();
      })
      .then(data => { if (Array.isArray(data)) setUsuarios(data); })
      .catch(err => {
         console.error(err);
         setError('No autorizado. Cierra sesión y vuelve a entrar.');
      });
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('rdc_token');
    
    if (!token || token === 'null' || token === 'undefined') {
      setError('Error de sesión. Vuelve a iniciar sesión.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/crear-usuario`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No se pudo crear el usuario');
        setLoading(false);
        return;
      }

      setForm({ nombre: '', email: '', password: '', rol: 'admin' });
      setShowModal(false);
      setLoading(false);
      cargarUsuarios();
    } catch (err) {
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <div style={s.content}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Gestión de Usuarios</h2>
          <p style={s.subtitle}>Administra las cuentas con acceso al sistema y clientes.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={s.btnPrimary}>
          + Nuevo Usuario / Admin
        </button>
      </div>

      {error && <div style={s.errorBoxGlobal}>{error}</div>}

      <div style={s.tableContainer}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ID</th>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Rol</th>
              <th style={s.th}>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? usuarios.map((u) => (
              <tr key={u.id} style={s.tr}>
                <td style={s.td}>#{u.id}</td>
                <td style={{ ...s.td, fontWeight: 600, color: '#F9F6F0' }}>{u.nombre}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}>
                  <span style={{ 
                    ...s.badge, 
                    background: u.rol === 'admin' ? '#E24B4A' : '#231C1A', 
                    color: u.rol === 'admin' ? '#FFF' : '#D4A373' 
                  }}>
                    {(u.rol || 'cliente').toUpperCase()}
                  </span>
                </td>
                <td style={s.td}>{u.creado_en ? new Date(u.creado_en).toLocaleDateString() : 'N/A'}</td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ ...s.td, textAlign: 'center', padding: 40 }}>{error ? 'Bloqueado' : 'Cargando usuarios...'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <h3 style={s.modalTitle}>Crear Nuevo Usuario</h3>
            <p style={s.modalSub}>Registra un nuevo administrador o cliente en el sistema.</p>

            {error && <div style={s.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Nombre Completo</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required style={s.input} placeholder="Ej. Gerente Juan" />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Correo Electrónico</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required style={s.input} placeholder="admin@rincondelcafe.com" />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Contraseña (Mín. 6 caracteres)</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required style={s.input} placeholder="••••••••" />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Rol en el Sistema</label>
                <select name="rol" value={form.rol} onChange={handleChange} style={s.select}>
                  <option value="admin">Administrador (Acceso al KDS y Panel)</option>
                  <option value="cliente">Cliente (Acceso a la Tienda)</option>
                </select>
              </div>

              <div style={s.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={s.btnSecondary}>Cancelar</button>
                <button type="submit" style={s.btnPrimary} disabled={loading}>{loading ? 'Guardando...' : 'Crear Usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  content: { padding: '40px 48px', overflowY: 'auto', flex: 1, background: '#0A0A0A' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 700, fontFamily: '"Playfair Display", serif', margin: 0, color: '#D4A373' },
  subtitle: { fontSize: 13, color: '#B0A39C', marginTop: 4 },
  tableContainer: { background: '#16110F', border: '1px solid #3A2E2A', borderRadius: '8px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px 24px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B0A39C', borderBottom: '1px solid #3A2E2A', background: '#110D0C' },
  td: { padding: '16px 24px', fontSize: 13, color: '#B0A39C', borderBottom: '1px solid #231C1A' },
  tr: { transition: 'background 0.2s' },
  badge: { fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.05em' },
  btnPrimary: { background: '#D4A373', color: '#16110F', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' },
  btnSecondary: { background: 'transparent', color: '#B0A39C', border: '1px solid #3A2E2A', padding: '10px 20px', borderRadius: '6px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: '#16110F', border: '1px solid #3A2E2A', borderRadius: '12px', padding: '36px', width: '100%', maxWidth: 450 },
  modalTitle: { fontSize: 24, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: '#F9F6F0', margin: 0 },
  modalSub: { fontSize: 13, color: '#B0A39C', marginTop: 6, marginBottom: 24 },
  errorBox: { background: '#2a1212', border: '1px solid #5a1e1e', color: '#ff6b6b', padding: '10px 14px', fontSize: 12, marginBottom: 16 },
  errorBoxGlobal: { background: '#2a1212', border: '1px solid #5a1e1e', color: '#ff6b6b', padding: '16px', fontSize: 14, marginBottom: 24, borderRadius: 6, textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B0A39C' },
  input: { background: '#111', border: '1px solid #3A2E2A', borderRadius: 6, padding: '11px 14px', color: '#F9F6F0', fontSize: 14, outline: 'none' },
  select: { background: '#111', border: '1px solid #3A2E2A', borderRadius: 6, padding: '11px 14px', color: '#F9F6F0', fontSize: 14, outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }
};