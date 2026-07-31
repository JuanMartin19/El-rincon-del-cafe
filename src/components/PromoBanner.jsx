import React, { useState, useEffect } from 'react';

export default function PromoBanner() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('promo_popup_seen')) {
        setShowPopup(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    localStorage.setItem('promo_popup_seen', 'true');
    setShowPopup(false);
  };

  return (
    <div className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 px-6 rounded-xl flex justify-between items-center shadow-lg">
      <div>
        <span className="bg-white text-red-600 text-xs font-black px-2.5 py-1 rounded-full uppercase mr-3">HOT DROP</span>
        <span className="font-medium">¡Nuevos tenis de edición limitada agregados al catálogo!</span>
      </div>

      {showPopup && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white text-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-100">
          <h4 className="text-lg font-bold text-gray-900">🔥 ¡Descuento de Bienvenida!</h4>
          <p className="text-sm text-gray-600 mt-1">Regístrate ahora y obtén un 10% de descuento en tu primer par de tenis.</p>
          <div className="mt-4 flex gap-2">
            <button onClick={closePopup} className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">Obtener Código</button>
            <button onClick={closePopup} className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Luego</button>
          </div>
        </div>
      )}
    </div>
  );
}