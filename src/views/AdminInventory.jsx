import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

// ⚡ IMAGEN LOCAL SVG: No hace peticiones a internet, es imposible que Opera GX la bloquee
const noImageSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23231C1A'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13px' font-weight='bold' fill='%23B0A39C'%3ESin Foto%3C/text%3E%3C/svg%3E";

export default function AdminInventory() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [form, setForm] = useState({ name: '', category: 'Caliente', price: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarInventario = () => {
    fetch(`${API_URL}/productos`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProductos(data); })
      .catch(err => console.error("Error al cargar inventario:", err));
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const abrirModalCrear = () => {
    setIsEditing(false);
    setForm({ name: '', category: 'Caliente', price: '', description: '' });
    setSelectedFile(null);
    setError('');
    setShowModal(true);
  };

  const abrirModalEditar = (prod) => {
    setIsEditing(true);
    setCurrentId(prod.id);
    setForm({ 
      name: prod.name, 
      category: prod.category || 'Caliente', 
      price: prod.price, 
      description: prod.description || '' 
    });
    setSelectedFile(null);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('price', form.price);
    formData.append('description', form.description);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    const endpoint = isEditing ? `${API_URL}/productos/${currentId}` : `${API_URL}/productos`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        body: formData
      });

      if (!res.ok) throw new Error('No se pudo guardar el producto');

      setShowModal(false);
      setLoading(false);
      cargarInventario();
    } catch (err) {
      setError('Error al conectar con la base de datos');
      setLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto del inventario?')) return;

    try {
      const res = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
      if (res.ok) cargarInventario();
      else alert('No se pudo eliminar el producto');
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const fmt = (n) => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 });

  return (
    <div style={s.content}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Inventario y Menú</h2>
          <p style={s.subtitle}>Gestión con carga de imágenes locales y MySQL.</p>
        </div>
        <button onClick={abrirModalCrear} style={s.btnPrimary}>
          + Nuevo Producto
        </button>
      </div>

      <div style={s.tableContainer}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Imagen</th>
              <th style={s.th}>ID</th>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Categoría</th>
              <th style={s.th}>Precio</th>
              <th style={s.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? productos.map((p) => {
              const servidorBase = API_URL.replace('/api', '');
              
              // ⚡ Si no hay imagen, usamos el SVG nativo (noImageSvg)
              const imageUrl = p.image 
                ? (p.image.startsWith('http') ? p.image : `${servidorBase}${p.image}`)
                : noImageSvg;

              return (
                <tr key={p.id} style={s.tr}>
                  <td style={s.td}>
                    <img 
                      src={imageUrl} 
                      alt={p.name} 
                      style={s.thumb} 
                      onError={(e) => { 
                        // ⚡ Si la imagen falla al cargar, la reemplazamos con el SVG nativo
                        if (e.target.src !== noImageSvg) {
                          e.target.src = noImageSvg; 
                        }
                      }}
                    />
                  </td>
                  <td style={s.td}>#{p.id}</td>
                  <td style={{ ...s.td, fontWeight: 600, color: '#F9F6F0' }}>{p.name}</td>
                  <td style={s.td}>
                    <span style={s.categoryBadge}>{p.category}</span>
                  </td>
                  <td style={{ ...s.td, color: '#3a9a5c', fontWeight: 600 }}>{fmt(p.price)}</td>
                  <td style={s.td}>
                    <div style={s.actionRow}>
                      <button onClick={() => abrirModalEditar(p)} style={s.btnEdit}>Editar</button>
                      <button onClick={() => eliminarProducto(p.id)} style={s.btnDelete}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan="6" style={{ ...s.td, textAlign: 'center', padding: 40 }}>Cargando inventario...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear / Editar Producto */}
      {showModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <h3 style={s.modalTitle}>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <p style={s.modalSub}>Completa la información y selecciona una foto de tu equipo.</p>

            {error && <div style={s.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Nombre del Platillo o Bebida</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  style={s.input} 
                  placeholder="Ej. Latte Vainilla"
                />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Categoría</label>
                <select name="category" value={form.category} onChange={handleChange} style={s.select}>
                  <option value="Caliente">Caliente</option>
                  <option value="Frío">Frío</option>
                  <option value="Postres">Postres</option>
                </select>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Precio ($ MXN)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="price" 
                  value={form.price} 
                  onChange={handleChange} 
                  required 
                  style={s.input} 
                  placeholder="45.00"
                />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Imagen desde la Computadora</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ ...s.input, padding: '8px', cursor: 'pointer' }} 
                />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Descripción Breve</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  style={{ ...s.input, height: 70, resize: 'none' }} 
                  placeholder="Ingredientes o detalles..."
                />
              </div>

              <div style={s.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={s.btnSecondary}>
                  Cancelar
                </button>
                <button type="submit" style={s.btnPrimary} disabled={loading}>
                  {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Producto')}
                </button>
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
  thumb: { width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid #3A2E2A' },
  categoryBadge: { background: '#231C1A', color: '#D4A373', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 4 },
  actionRow: { display: 'flex', gap: 8 },
  btnPrimary: { background: '#D4A373', color: '#16110F', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' },
  btnSecondary: { background: 'transparent', color: '#B0A39C', border: '1px solid #3A2E2A', padding: '10px 20px', borderRadius: '6px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' },
  btnEdit: { background: '#231C1A', color: '#D4A373', border: '1px solid #3A2E2A', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  btnDelete: { background: '#2a1212', color: '#ff6b6b', border: '1px solid #5a1e1e', padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: '#16110F', border: '1px solid #3A2E2A', borderRadius: '12px', padding: '36px', width: '100%', maxWidth: 450, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: 24, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: '#F9F6F0', margin: 0 },
  modalSub: { fontSize: 13, color: '#B0A39C', marginTop: 6, marginBottom: 20 },
  errorBox: { background: '#2a1212', border: '1px solid #5a1e1e', color: '#ff6b6b', padding: '10px 14px', fontSize: 12, marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B0A39C' },
  input: { background: '#111', border: '1px solid #3A2E2A', borderRadius: 6, padding: '10px 14px', color: '#F9F6F0', fontSize: 14, outline: 'none' },
  select: { background: '#111', border: '1px solid #3A2E2A', borderRadius: 6, padding: '10px 14px', color: '#F9F6F0', fontSize: 14, outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }
};