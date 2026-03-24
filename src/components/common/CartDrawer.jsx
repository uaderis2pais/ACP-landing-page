import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { openWhatsApp } from '../../utils/whatsappGuard';
import { useIsOpen } from '../../hooks/useIsOpen';

// Minimum ms that must pass after cart opens before allowing checkout
const MIN_OPEN_MS = 3000;

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const { isOpen } = useIsOpen();

  // Honeypot: a hidden field that humans won't see or fill
  const honeypotRef = useRef('');

  // Track the timestamp when the cart was opened
  const openedAtRef = useRef(null);

  useEffect(() => {
    if (isCartOpen) {
      openedAtRef.current = Date.now();
      setBlocked(false);
    }
  }, [isCartOpen]);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // 🍯 Honeypot check — if anything is in this field, it's a bot
    if (honeypotRef.current.length > 0) {
      console.warn('[Bot Protection] Honeypot triggered.');
      setBlocked(true);
      return;
    }

    // ⏱ Time check — bots submit too fast
    const elapsed = Date.now() - (openedAtRef.current || 0);
    if (elapsed < MIN_OPEN_MS) {
      console.warn(`[Bot Protection] Too fast: ${elapsed}ms`);
      setBlocked(true);
      return;
    }

    setIsRedirecting(true);

    setTimeout(() => {
      let message = "Hola! Quiero hacer un pedido:\n\n";
      cartItems.forEach(item => {
        message += `- ${item.quantity}x ${item.name} ($${item.price.toLocaleString('es-AR')} c/u)\n`;
      });

      message += `\nTotal: $${getCartTotal().toLocaleString('es-AR')}\n\n`;
      message += "Nombre: \n";
      message += "Dirección (si es delivery): \n";
      message += "Forma de pago: transferencia / efectivo";

      const encodedMessage = encodeURIComponent(message);
      //const whatsappUrl = `https://wa.me/5493442668753?text=${encodedMessage}`;
      const whatsappUrl = `https://wa.me/5491158774154?text=${encodedMessage}`;

      const success = openWhatsApp(whatsappUrl);

      if (!success) {
        setBlocked(true);
        setIsRedirecting(false);
        return;
      }

      clearCart();
      setIsCartOpen(false);
      setIsRedirecting(false);
    }, 800);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-sushi-darkGray border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-[60] flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-sushi-black">
          <h3 className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" /> Tu Pedido
          </h3>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
            className="text-gray-400 hover:text-white min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 🍯 Honeypot — invisible to real users, visible to bots */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
          <label htmlFor="cart_confirm">Confirmar</label>
          <input
            id="cart_confirm"
            name="cart_confirm"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            onChange={(e) => { honeypotRef.current = e.target.value; }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-20 flex flex-col items-center">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Tu carrito está vacío</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm border-b border-transparent hover:border-emerald-400 transition-all font-bold tracking-tight"
              >
                Volver al menú
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-sushi-black shadow-lg p-4 rounded-2xl border border-white/5 relative group">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight pr-6">{item.name}</h4>
                    <span className="text-emerald-400 bg-emerald-400/20 px-2 py-0.5 rounded-full font-black text-xs inline-block mt-2">
                      ${item.price.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Disminuir cantidad"
                      className="text-gray-400 hover:text-white bg-white/5 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-md transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Aumentar cantidad"
                      className="text-gray-400 hover:text-white bg-white/5 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-md transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Eliminar producto"
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 bg-black/50 border border-white/5 shadow-sm opacity-0 group-hover:opacity-100 transition-all min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-sushi-black">
          {blocked && (
            <div className="flex items-center gap-2 text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>Acción bloqueada. Por favor esperá un momento, revisá tu carrito e intentá de nuevo.</span>
            </div>
          )}
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-400 text-sm font-semibold">Total estimado</span>
            <span className="font-black text-2xl text-white tracking-tight">
              ${getCartTotal().toLocaleString('es-AR')}
            </span>
          </div>
          <Button
            className={`w-full text-lg py-6 transition-all shadow-md rounded-2xl ${!isOpen ? 'bg-gray-800/50 text-gray-500 hover:bg-gray-800/50 cursor-not-allowed shadow-none' : ''
              }`}
            disabled={cartItems.length === 0 || isRedirecting || !isOpen}
            onClick={handleCheckout}
          >
            {!isOpen
              ? 'Local cerrado, abrimos a las 20hs'
              : isRedirecting ? 'Redirigiendo a WhatsApp...' : 'Realizar pedido por WhatsApp'}
          </Button>
        </div>
      </div>
    </>
  );
}
