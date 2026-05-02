import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, UtensilsCrossed } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsappGuard';
import { config } from '../../config';

const smoothScrollTo = (targetY, duration = 800) => {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime = null;
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const step = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const handleFooterLink = (e, id) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    const targetY = el.getBoundingClientRect().top + window.scrollY - 80;
    smoothScrollTo(targetY);
    window.history.pushState(null, '', `/#${id}`);
  }
};

export function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link to="/#hero" className="inline-flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform opacity-70 group-hover:opacity-100">
                <UtensilsCrossed className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-serif font-bold text-white/70 group-hover:text-white transition-colors text-base tracking-tight">
                {config.nombreDelNegocio}
              </span>
            </Link>
            <p className="text-gray-600 text-sm max-w-sm mt-2">
              {config.descripcion}
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm text-gray-400">
            <a
              href="/#menu"
              onClick={(e) => handleFooterLink(e, 'menu')}
              className="hover:text-[#7C5228] transition-colors py-3 px-2 min-h-[48px] flex items-center"
            >
              Menú
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleFooterLink(e, 'contact')}
              className="hover:text-[#7C5228] transition-colors py-3 px-2 min-h-[48px] flex items-center"
            >
              Ubicación
            </a>
            <div className="flex gap-4">
              <button
                onClick={() => openWhatsApp(`https://wa.me/${config.whatsapp.principal}`)}
                aria-label="Contactar por WhatsApp"
                className="hover:text-green-500 transition-colors py-3 px-2 min-h-[48px] flex items-center"
              >
                WhatsApp
              </button>
              <a
                href={config.redesSociales.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Seguinos en Instagram"
                className="hover:text-pink-500 transition-colors py-3 px-2 min-h-[48px] flex items-center"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center flex flex-col items-center">
          <p className="text-gray-600 text-xs uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} {config.nombreDelNegocio}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
