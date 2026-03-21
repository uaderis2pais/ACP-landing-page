import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/#hero', isHash: true },
    { name: 'Nosotros', path: '/#about', isHash: true },
    { name: 'Menú', path: '/#menu', isHash: true },
    { name: 'Contacto', path: '/#contact', isHash: true },
    { name: 'FAQ', path: '/#faq', isHash: true },
  ];

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

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#') || path.startsWith('#')) {
      const id = path.replace('/#', '').replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        const navbarHeight = 80;
        const targetY = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
        smoothScrollTo(targetY);
        window.history.pushState(null, '', `/#${id}`);
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-sushi-black/95 backdrop-blur-md border-b border-white/10 shadow-lg py-4'
          : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="/#hero" className="flex items-center group">
            <img src="/logoinvisible.png" alt="Agarrame como puedas Logo" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-sm font-medium transition-colors hover:text-sushi-gold text-gray-300"
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver carrito de compras"
              className="relative p-2 text-gray-300 hover:text-sushi-gold transition-colors group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-sushi-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-in zoom-in">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver carrito"
              className="relative p-2 text-sushi-white"
            >
              <ShoppingBag className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-sushi-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="p-2 text-sushi-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-sushi-darkGray border-b border-white/10 shadow-xl transition-all duration-300 origin-top ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
          }`}
      >
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => handleNavClick(e, link.path)}
              className="block px-4 py-3 text-lg font-medium rounded-sm border border-transparent text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
