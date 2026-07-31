import React from 'react';
import s from './../views/Home.styles';

// Reemplaza ADDRESS por la dirección real de tu tienda.
// El iframe de Google Maps con output=embed NO requiere API key.
const ADDRESS = 'Av. Insurgentes Sur 1234, Ciudad de México, México';
const MAPS_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=15&output=embed`;
const MAPS_LINK = `https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`;

export default function LocationMap() {
  return (
    <div>
      <div style={s.mapWrap}>
        <iframe
          title="Ubicación de la tienda"
          src={MAPS_EMBED_SRC}
          style={s.mapIframe}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div style={s.mapCaption}>
        <span style={s.mapAddress}>{ADDRESS}</span>
        <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={s.mapLink}>
          Ver en Google Maps →
        </a>
      </div>
    </div>
  );
}