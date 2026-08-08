import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Leemos el Client ID de las variables de entorno
const paypalOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, 
  currency: "MXN",
  intent: "capture"
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PayPalScriptProvider options={paypalOptions}>
      <App />
      <SpeedInsights />
    </PayPalScriptProvider>
  </StrictMode>,
)