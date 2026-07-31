import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <input
        type="text" placeholder="Buscar tenis por modelo, marca o estilo..."
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-gray-800 placeholder-gray-400 shadow-sm transition"
        data-testid="search-input"
      />
    </div>
  );
}