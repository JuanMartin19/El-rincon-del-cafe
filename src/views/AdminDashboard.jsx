import React from 'react';

// Componente para dibujar los anillos de puntuación estilo Lighthouse
const LighthouseScore = ({ label, score }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  // Colores oficiales de Lighthouse
  let color = "#0cce6b"; // Verde (90-100)
  if (score < 90) color = "#ffa400"; // Naranja (50-89)
  if (score < 50) color = "#ff4e42"; // Rojo (0-49)

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-24 h-24 mb-3">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle cx="48" cy="48" r={radius} stroke="#e5e7eb" strokeWidth="6" fill="transparent" />
          <circle 
            cx="48" cy="48" r={radius} 
            stroke={color} strokeWidth="6" fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={offset} 
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-2xl font-bold" style={{ color }}>{score}</span>
      </div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </div>
  );
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-950">Panel de Control - El Rincón del Café</h1>
        <p className="text-gray-500">Métricas analíticas avanzadas de pedidos y rendimiento.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Acciones Críticas */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Acciones Críticas</h3>
          <button className="w-full bg-black text-white py-3 rounded-xl font-medium mb-3 hover:bg-gray-800 transition">Agregar al Menú</button>
          <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-200 transition">Inventario de Insumos</button>
        </div>

        {/* Embebido seguro de modulo compilado en Flutter Web mediante Iframe */}
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-2 px-2">Estadísticas de Pedidos (`Statswidget.dart`)</h3>
          <iframe 
            src="/flutter_web_build/index.html" 
            title="Flutter Stats Engine" 
            className="w-full flex-1 border-none rounded-xl"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>

        {/* Nueva sección: Rendimiento Lighthouse */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Rendimiento Web (Google Lighthouse)</h3>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Actualizado hace 2h</span>
          </div>
          
          <div className="flex flex-wrap justify-around items-center gap-6 py-4">
            <LighthouseScore label="Performance" score={92} />
            <LighthouseScore label="Accessibility" score={100} />
            <LighthouseScore label="Best Practices" score={95} />
            <LighthouseScore label="SEO" score={88} />
          </div>
        </div>
      </div>
    </div>
  );
}