import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Layout } from './components/layout/Layout';
import { CartProvider } from './context/CartContext';

// Lazy loading pages
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Cart = React.lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Admin = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const Login = React.lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));

function Fallback() {
  return (
    <div className="min-h-screen bg-sushi-black flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sushi-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Suspense fallback={<Fallback />}>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="cart" element={<Cart />} />
            </Route>
            
            {/* Login Independiente */}
            <Route path="/login" element={<Login />} />

            {/* Rutas Privadas / Admin (sin layout público) */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </CartProvider>
  );
}

export default App;
