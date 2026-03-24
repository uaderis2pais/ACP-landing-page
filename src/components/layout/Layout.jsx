import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { SEO } from '../common/SEO';
import { setHoneypot } from '../../utils/whatsappGuard';

// Lazy loaded components (not needed for CLS/LCP)
const Footer = React.lazy(() => import('./Footer').then(mod => ({ default: mod.Footer })));
const CartDrawer = React.lazy(() => import('../common/CartDrawer').then(mod => ({ default: mod.CartDrawer })));
const FloatingWhatsApp = React.lazy(() => import('../common/FloatingWhatsApp').then(mod => ({ default: mod.FloatingWhatsApp })));
const FloatingCallButton = React.lazy(() => import('../common/FloatingCallButton').then(mod => ({ default: mod.FloatingCallButton })));
const InstallPWA = React.lazy(() => import('../common/InstallPWA').then(mod => ({ default: mod.InstallPWA })));

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-sushi-black font-sans text-sushi-white selection:bg-sushi-red/30 overflow-x-hidden w-full relative">
      <SEO />
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <Footer />
        <CartDrawer />
        <FloatingWhatsApp />
        <FloatingCallButton />
        <InstallPWA />
      </Suspense>

      {/* 🍯 Global Honeypot — helps prevent automated spam */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <input
          type="text"
          name="website_confirm_field"
          tabIndex={-1}
          autoComplete="off"
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
    </div>
  );
}
