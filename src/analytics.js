// Herramienta de estadísticas (Google Analytics 4).
//
// No requiere ninguna cuenta para que el proyecto siga funcionando:
// si no defines VITE_GA_MEASUREMENT_ID, este módulo simplemente no hace nada.
//
// Para activarlo de verdad:
//   1. Crea una propiedad GA4 en https://analytics.google.com (es gratis)
//   2. Copia tu "ID de medición" (formato G-XXXXXXXXXX)
//   3. Crea un archivo .env en la raíz del proyecto con:
//        VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
//   4. Reinicia `npm run dev`

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID);

  console.info('[Analytics] Google Analytics activo:', GA_ID);
} else {
  console.info('[Analytics] Desactivado — define VITE_GA_MEASUREMENT_ID en tu .env para activarlo.');
}
