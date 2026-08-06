import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ToastProvider } from './components/ToastProvider';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
import Catalog from './views/Catalog';
import ProductDetail from './views/ProductDetail';
import Cart from './views/Cart';
import Checkout from './views/Checkout';
import Favorites from './views/Favorites';
import Login from './views/Login';
import Register from './views/Register';
import LoadingView from './views/LoadingView';
import Privacy from './views/Privacy';
import Terms from './views/Terms';
import Nosotros from './views/Nosotros';
import Granos from './views/Granos';
import Ubicacion from './views/Ubicacion';
import Ayuda from './views/Ayuda';
import Faq from './views/Faq';
import WearableSync from './views/WearableSync';

// Vistas del Admin y Layout
import AdminLayout from './components/AdminLayout';
import AdminOrders from './views/AdminOrders';
import AdminInventory from './views/AdminInventory';
import AdminUsers from './views/AdminUsers';
import AdminReports from './views/AdminReports';
import AdminPromos from './views/AdminPromos';

export default function App() {
  return (
    <Router>
      <AuthProvider>
      <CartProvider>
      <SocketProvider>
      <ToastProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          
          {/* El main necesita flex: 1 y display: flex para que el AdminLayout abarque toda la pantalla */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* === RUTAS DE CLIENTES === */}
              <Route path="/"            element={<Home />} />
              <Route path="/catalog"     element={<Catalog />} />
              <Route path="/nosotros"    element={<Nosotros />} />
              <Route path="/granos"      element={<Granos />} />
              <Route path="/ubicacion"   element={<Ubicacion />} />
              <Route path="/ayuda"       element={<Ayuda />} />
              <Route path="/faq"         element={<Faq />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart"        element={<Cart />} />
              <Route path="/checkout"    element={<Checkout />} />
              <Route path="/favorites"   element={<Favorites />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />
              <Route path="/loading"     element={<LoadingView />} />
              <Route path="/privacy"     element={<Privacy />} />
              <Route path="/terms"       element={<Terms />} />

              {/* === RUTAS DEL ADMINISTRADOR (ANIDADAS EN EL LAYOUT) === */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOrders />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="promos" element={<AdminPromos />} />
                <Route path="wearable" element={<WearableSync />} />
              </Route>
            </Routes>
          </main>

          <Footer />
        </div>
      </ToastProvider>
      </SocketProvider>
      </CartProvider>
      </AuthProvider>
    </Router>
  );
}