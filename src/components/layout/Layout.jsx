import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../common/CartDrawer';
import { FloatingWhatsApp } from '../common/FloatingWhatsApp';
import { FloatingCallButton } from '../common/FloatingCallButton';
import { SEO } from '../common/SEO';
import { InstallPWA } from '../common/InstallPWA';
import { setHoneypot } from '../../utils/whatsappGuard';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-sushi-black font-sans text-sushi-white selection:bg-sushi-red/30 overflow-x-hidden w-full relative">
      <SEO />
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
      <FloatingCallButton />
      <InstallPWA />

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
