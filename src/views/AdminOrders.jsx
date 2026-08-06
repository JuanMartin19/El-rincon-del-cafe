import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { API_URL } from '../config';

export default function AdminOrders() {
  const { socket } = useSocket();

  const [liveOrders, setLiveOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, ingresos: 0 });

  // 1. Cargar pedidos pendientes desde la Base de Datos al abrir
  useEffect(() => {
    fetch(`${API_URL}/pedidos`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const pedidosFormateados = data.map(p => ({
            id: p.id,
            producto: p.producto,
            preparacion: p.preparacion,
            precio: Number(p.precio),
            hora: new Date(p.creado_en).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
          }));
          setLiveOrders(pedidosFormateados);
          
          const ingresosTotales = pedidosFormateados.reduce((acc, curr) => acc + curr.precio, 0);
          setStats({ total: pedidosFormateados.length, ingresos: ingresosTotales });
        }
      })
      .catch(err => console.error("Error al cargar pedidos iniciales:", err));
  }, []);

  // 2. Escuchar nuevos pedidos en tiempo real por WebSockets
  useEffect(() => {
    if (socket) {
      socket.on('actualizacion_tv', (data) => {
        if (!data) return;
        
        const nuevoPedido = {
          ...data,
          precio: Number(data.precio || 0),
          hora: data.hora || new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        };
        
        setLiveOrders((prev) => [nuevoPedido, ...prev]);
        setStats((prev) => ({
          total: prev.total + 1,
          ingresos: prev.ingresos + Number(data.precio || 0)
        }));
      });
    }

    return () => {
      if (socket) {
        socket.off('actualizacion_tv');
      }
    };
  }, [socket]);

  // 3. Marcar pedido como completado
  const marcarCompletado = async (id) => {
    try {
      await fetch(`${API_URL}/pedidos/${id}/completar`, { method: 'PUT' });
      setLiveOrders((prev) => prev.filter(order => order.id !== id));
    } catch (err) {
      console.error("Error al completar orden:", err);
    }
  };

  const fmt = (n) => '$' + Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });

  return (
    <div style={s.content}>
      <header style={s.header}>
        <div>
          <h1 style={s.title}>Monitor de Preparación</h1>
          <p style={s.subtitle}>Las órdenes de los clientes aparecerán aquí en tiempo real.</p>
        </div>
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statLabel}>Órdenes Hoy</div>
            <div style={s.statValue}>{stats.total}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>Ingresos</div>
            <div style={{ ...s.statValue, color: '#3a9a5c' }}>{fmt(stats.ingresos)}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>En Cola</div>
            <div style={{ ...s.statValue, color: '#E24B4A' }}>{liveOrders.length}</div>
          </div>
        </div>
      </header>
      <div style={s.board}>
        {liveOrders.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>☕</div>
            <div>No hay órdenes pendientes.</div>
            <div style={s.emptySub}>Esperando a que los clientes realicen pedidos...</div>
          </div>
        ) : (
          <div style={s.grid}>
            {liveOrders.map((order) => (
              <div key={order.id} style={s.ticket}>
                <div style={s.ticketHeader}>
                  <span style={s.ticketTime}>{order.hora}</span>
                  <span style={s.ticketNew}>¡NUEVO!</span>
                </div>
                <div style={s.ticketBody}>
                  <div style={s.productName}>{order.producto || 'Pedido Especial'}</div>
                  <div style={s.prepOption}>
                    <span style={s.prepBullet}>•</span> Opción / Detalle: {order.preparacion || 'Estándar'}
                  </div>
                </div>
                <div style={s.ticketFooter}>
                  <div style={s.ticketPrice}>{fmt(order.precio)}</div>
                  <button onClick={() => marcarCompletado(order.id)} style={s.completeBtn}>✓ Completar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  content: { display: 'flex', flexDirection: 'column', height: '100%', background: '#0A0A0A', flex: 1 },
  header: { padding: '40px 48px', borderBottom: '1px solid #1E1E1E', background: '#110D0C', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 },
  title: { fontSize: 32, fontWeight: 700, fontFamily: '"Playfair Display", serif', margin: 0, color: '#D4A373' },
  subtitle: { fontSize: 14, color: '#B0A39C', marginTop: 8 },
  statsRow: { display: 'flex', gap: 16 },
  statCard: { background: '#16110F', border: '1px solid #3A2E2A', borderRadius: '8px', padding: '16px 24px', minWidth: 140, flex: 1 },
  statLabel: { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0A39C', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 700, color: '#F9F6F0' },
  board: { flex: 1, padding: '40px 48px', overflowY: 'auto', background: '#0A0A0A' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, alignContent: 'start' },
  ticket: { background: '#16110F', border: '1px solid #3A2E2A', borderRadius: '12px', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s ease-out' },
  ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px dashed #3A2E2A', background: '#1A1412', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' },
  ticketTime: { fontSize: 12, fontWeight: 600, color: '#B0A39C' },
  ticketNew: { background: '#E24B4A', color: '#FFF', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: '12px', letterSpacing: '0.1em' },
  ticketBody: { padding: '24px 20px', flex: 1 },
  productName: { fontSize: 20, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: '#F9F6F0', marginBottom: 12, lineHeight: 1.2 },
  prepOption: { fontSize: 14, color: '#D4A373', display: 'flex', alignItems: 'center', gap: 8 },
  prepBullet: { fontSize: 18 },
  ticketFooter: { padding: '16px 20px', borderTop: '1px solid #231C1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ticketPrice: { fontSize: 16, fontWeight: 700, color: '#F9F6F0' },
  completeBtn: { background: '#3a9a5c', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'opacity 0.2s' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#B0A39C', fontSize: 16, fontWeight: 500 },
  emptyIcon: { fontSize: 64, marginBottom: 16, opacity: 0.5 },
  emptySub: { fontSize: 13, marginTop: 8, opacity: 0.7 }
};