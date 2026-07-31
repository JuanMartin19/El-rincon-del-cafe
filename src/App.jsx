import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ToastProvider } from './components/ToastProvider';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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
import AdminDashboard from './views/AdminDashboard';
import LoadingView from './views/LoadingView';
import Privacy from './views/Privacy';
import Terms from './views/Terms';

export default function App() {
  return (
    <Router>
      <AuthProvider>
      <CartProvider>
      <ToastProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/catalog"     element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart"        element={<Cart />} />
              <Route path="/checkout"    element={<Checkout />} />
              <Route path="/favorites"   element={<Favorites />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />
              <Route path="/admin"       element={<AdminDashboard />} />
              <Route path="/loading"     element={<LoadingView />} />
              <Route path="/privacy"     element={<Privacy />} />
              <Route path="/terms"       element={<Terms />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
      </CartProvider>
      </AuthProvider>
    </Router>
  );
}