import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [productos, setProductos] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  
  const [form, setForm] = useState({ 
    titulo: '', descripcion: '', tipo: 'COMBO', 
    modo_aplica: 'categoria', 
    categoria_aplica: 'Todos', valor: '', productos_ids: [] 
  });
  const [selectedFile, setSelectedFile] = useState(null); // ⚡ Archivo local

  const cargarDatos = () => {
    fetch(`${API_URL}/promociones`).then(res => res.json()).then(data => setPromos(data));
    fetch(`${API_URL}/productos`).then(res => res.json()).then(data => setProductos(data));
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const toggleProducto = (id) => {
    setForm(prev => {
      const existe = prev.productos_ids.includes(id);
      return { 
        ...prev, 
        productos_ids: existe ? prev.productos_ids.filter(pId => pId !== id) : [...prev.productos_ids, id]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⚡ Usamos FormData para enviar textos e imágenes juntos
    const formData = new FormData();
    formData.append('titulo', form.titulo);
    formData.append('descripcion', form.descripcion);
    formData.append('tipo', form.tipo);
    formData.append('categoria_aplica', form.modo_aplica === 'categoria' ? form.categoria_aplica : 'Específicos');
    formData.append('valor', form.valor || 0);
    
    const idsString = form.modo_aplica === 'especifico' ? form.productos_ids.join(',') : '';
    formData.append('productos_ids', idsString);

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    await fetch(`${API_URL}/promociones`, {
      method: 'POST',
      body: formData // Nota: No se incluye Content-Type para FormData
    });
    
    setShowModal(false);
    setSelectedFile(null);
    cargarDatos();
  };

  const toggleEstado = async (id, estadoActual) => {
    await fetch(`${API_URL}/promociones/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !estadoActual })
    });
    cargarDatos();
  };

  const eliminar = async (id) => {
    if(!window.confirm('¿Eliminar promoción?')) return;
    await fetch(`${API_URL}/promociones/${id}`, { method: 'DELETE' });
    cargarDatos();
  };

  return (
    <div style={s.content}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Promociones Inteligentes</h2>
          <p style={s.subtitle}>Sube imágenes personalizadas y define reglas de descuento automáticas.</p>
        </div>
        <button onClick={() => {
          setForm({ titulo: '', descripcion: '', tipo: 'COMBO', modo_aplica: 'categoria', categoria_aplica: 'Todos', valor: '', productos_ids: [] });
          setSelectedFile(null);
          setShowModal(true);
        }} style={s.btnPrimary}>+ Nueva Promoción</button>
      </div>

      <div style={s.tableContainer}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Imagen</th>
              <th style={s.th}>Campaña</th>
              <th style={s.th}>Tipo</th>
              <th style={s.th}>Aplica a</th>
              <th style={s.th}>Estado</th>
              <th style={s.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promos.map(p => {
              const servidorBase = API_URL.replace('/api', '');
              const imgUrl = p.imagen ? `${servidorBase}${p.imagen}` : 'https://via.placeholder.com/150?text=Promo';
              return (
                <tr key={p.id} style={{...s.tr, opacity: p.activo ? 1 : 0.5}}>
                  <td style={s.td}><img src={imgUrl} alt="" style={{width: 44, height: 44, objectFit: 'cover', borderRadius: 6}} /></td>
                  <td style={{ ...s.td, fontWeight: 600, color: '#F9F6F0' }}>{p.titulo}<br/><span style={{fontSize: 11, color: '#B0A39C', fontWeight: 400}}>{p.descripcion}</span></td>
                  <td style={s.td}><span style={s.badge}>{p.tipo}</span></td>
                  <td style={s.td}>{p.productos_ids ? <span style={{color: '#D4A373'}}>Específicos</span> : p.categoria_aplica}</td>
                  <td style={s.td}>
                    <button onClick={() => toggleEstado(p.id, p.activo)} style={{...s.badge, background: p.activo ? '#3a9a5c' : '#231C1A', color: p.activo ? '#FFF' : '#B0A39C', border: 'none', cursor: 'pointer'}}>
                      {p.activo ? 'ACTIVO' : 'INACTIVO'}
                    </button>
                  </td>
                  <td style={s.td}><button onClick={() => eliminar(p.id)} style={s.btnDelete}>Eliminar</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <h3 style={s.modalTitle}>Crear Promoción</h3>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Título Comercial</label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required style={s.input} placeholder="Ej. Combo Mañana" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Descripción Breve</label>
                <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} style={s.input} />
              </div>
              
              {/* ⚡ Selector de Imagen desde la Computadora */}
              <div style={s.fieldGroup}>
                <label style={s.label}>Imagen Publicitaria de la Promo</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{...s.input, padding: 8, cursor: 'pointer'}} />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Tipo de Regla</label>
                <select name="tipo" value={form.tipo} onChange={handleChange} style={s.select}>
                  <option value="COMBO">Combo (Precio Fijo $)</option>
                  <option value="2X1">2x1 (Se descuenta el más barato)</option>
                  <option value="DESCUENTO">Descuento Directo (%)</option>
                </select>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>¿A qué aplica la promoción?</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <label style={{ color: '#F9F6F0', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="radio" name="modo_aplica" value="categoria" checked={form.modo_aplica === 'categoria'} onChange={handleChange} />
                    Categoría Completa
                  </label>
                  <label style={{ color: '#F9F6F0', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="radio" name="modo_aplica" value="especifico" checked={form.modo_aplica === 'especifico'} onChange={handleChange} />
                    Productos Específicos
                  </label>
                </div>
              </div>

              {form.modo_aplica === 'categoria' ? (
                <div style={s.fieldGroup}>
                  <label style={s.label}>Selecciona la Categoría</label>
                  <select name="categoria_aplica" value={form.categoria_aplica} onChange={handleChange} style={s.select}>
                    <option value="Todos">Todo el Menú</option>
                    <option value="Caliente">Solo Calientes</option>
                    <option value="Frío">Solo Fríos</option>
                    <option value="Postres">Solo Postres</option>
                  </select>
                </div>
              ) : (
                <div style={s.fieldGroup}>
                  <label style={s.label}>Selecciona los Productos</label>
                  <div style={s.checkboxList}>
                    {productos.map(p => (
                      <label key={p.id} style={s.checkboxItem}>
                        <input type="checkbox" checked={form.productos_ids.includes(p.id)} onChange={() => toggleProducto(p.id)} />
                        {p.name} <span style={{ color: '#D4A373' }}>(${p.price})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {form.tipo !== '2X1' && (
                <div style={s.fieldGroup}>
                  <label style={s.label}>{form.tipo === 'DESCUENTO' ? 'Porcentaje de Descuento (%)' : 'Precio Final del Combo ($)'}</label>
                  <input type="number" name="valor" value={form.valor} onChange={handleChange} required style={s.input} />
                </div>
              )}
              <div style={s.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={s.btnSecondary}>Cancelar</button>
                <button type="submit" style={s.btnPrimary}>Guardar</button>
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
  td: { padding: '16px 24px', fontSize: 13, color: '#B0A39C', borderBottom: '1px solid #231C1A', verticalAlign: 'middle' },
  tr: { transition: 'background 0.2s' },
  badge: { background: '#231C1A', color: '#D4A373', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 4 },
  btnPrimary: { background: '#D4A373', color: '#16110F', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' },
  btnSecondary: { background: 'transparent', color: '#B0A39C', border: '1px solid #3A2E2A', padding: '10px 20px', borderRadius: '6px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  btnDelete: { background: '#2a1212', color: '#ff6b6b', border: '1px solid #5a1e1e', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: '#16110F', border: '1px solid #3A2E2A', borderRadius: '12px', padding: '36px', width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: 24, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: '#F9F6F0', margin: '0 0 24px' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B0A39C' },
  input: { background: '#111', border: '1px solid #3A2E2A', borderRadius: 6, padding: '10px 14px', color: '#F9F6F0', fontSize: 14, outline: 'none' },
  select: { background: '#111', border: '1px solid #3A2E2A', borderRadius: 6, padding: '10px 14px', color: '#F9F6F0', fontSize: 14, outline: 'none' },
  checkboxList: { background: '#111', border: '1px solid #3A2E2A', borderRadius: 6, padding: '10px 14px', maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 },
  checkboxItem: { color: '#F9F6F0', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }
};