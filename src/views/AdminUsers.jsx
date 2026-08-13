import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { API_URL } from '../config';

export default function AdminReports() {
  const [metricas, setMetricas] = useState({
    ingresos: 0,
    total_pedidos: 0,
    grafica: [],
    categorias: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/reportes`)
      .then(res => res.json())
      .then(data => {
        setMetricas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando reportes:", err);
        setLoading(false);
      });
  }, []);

  const fmt = (n) => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 });

  if (loading) {
    return <div style={{ ...s.content, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando analíticas...</div>;
  }

  // Personalización del recuadro emergente (Tooltip) al pasar el mouse por la gráfica
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={s.tooltip}>
          <p style={s.tooltipLabel}>{label.toUpperCase()}</p>
          <p style={s.tooltipValue}>{fmt(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={s.content}>
      <h2 style={s.title}>Reportes Financieros y Métricas</h2>
      
      {/* Tarjetas de Resumen */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Ventas Totales (Histórico)</div>
          <div style={{ ...s.statValue, color: '#3a9a5c' }}>{fmt(metricas.ingresos)}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Pedidos Completados</div>
          <div style={s.statValue}>{metricas.total_pedidos}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Ticket Promedio</div>
          <div style={{ ...s.statValue, color: '#D4A373' }}>
            {metricas.total_pedidos > 0 ? fmt(metricas.ingresos / metricas.total_pedidos) : '$0.00'}
          </div>
        </div>
      </div>

      <div style={s.chartsGrid}>
        {/* Gráfica de Ingresos (Línea/Área) */}
        <div style={s.chartBox}>
          <h3 style={s.chartTitle}>Ingresos de los Últimos 7 Días</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={metricas.grafica} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A373" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4A373" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A2E2A" vertical={false} />
                <XAxis dataKey="fecha" stroke="#B0A39C" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#B0A39C" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#D4A373" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica de Categorías de Inventario (Barras) */}
        <div style={s.chartBox}>
          <h3 style={s.chartTitle}>Distribución del Menú</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={metricas.categorias} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A2E2A" vertical={false} />
                <XAxis dataKey="name" stroke="#B0A39C" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#B0A39C" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#231C1A'}} contentStyle={{ background: '#16110F', border: '1px solid #3A2E2A', color: '#F9F6F0' }} />
                <Bar dataKey="total" fill="#3a9a5c" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REPORTE DE LIGHTHOUSE INCRUSTADO */}git add .
        <div style={{ ...s.chartBox, gridColumn: '1 / -1' }}>
          <h3 style={s.chartTitle}>Auditoría de Rendimiento (Lighthouse)</h3>
          
          <div style={{ width: '100%', height: '600px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #3A2E2A', background: '#fff' }}>
            <iframe 
              src="/reporte-lighthouse.html" 
              width="100%" 
              height="100%" 
              frameBorder="0"
              title="Reporte Lighthouse"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}

const s = {
  content: { padding: '40px 48px', overflowY: 'auto', flex: 1, background: '#0A0A0A' },
  title: { fontSize: 32, fontWeight: 700, fontFamily: '"Playfair Display", serif', margin: 0, color: '#D4A373', marginBottom: 32 },
  
  statsRow: { display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' },
  statCard: { background: '#16110F', border: '1px solid #3A2E2A', borderRadius: '10px', padding: '24px', flex: 1, minWidth: 200 },
  statLabel: { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B0A39C', marginBottom: 12 },
  statValue: { fontSize: 32, fontWeight: 700, color: '#F9F6F0' },
  
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 },
  chartBox: { background: '#16110F', border: '1px solid #3A2E2A', borderRadius: '10px', padding: '24px' },
  chartTitle: { fontSize: 16, fontWeight: 600, color: '#F9F6F0', margin: '0 0 24px 0' },
  
  tooltip: { background: '#110D0C', border: '1px solid #3A2E2A', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' },
  tooltipLabel: { margin: 0, fontSize: 11, color: '#B0A39C', fontWeight: 600, letterSpacing: '0.05em' },
  tooltipValue: { margin: '4px 0 0', fontSize: 18, color: '#D4A373', fontWeight: 700 },

  btnEnlace: { display: 'inline-block', background: '#D4A373', color: '#16110F', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' }
};