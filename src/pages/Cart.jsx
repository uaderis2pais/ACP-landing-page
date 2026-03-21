import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function Cart() {
  const { cartItems, getCartTotal, setIsCartOpen } = useCart();

  // If we wanted a standalone Cart page instead of just the drawer
  return (
    <div className="pt-32 pb-24 bg-sushi-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Tu Carrito</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-sm border border-white/10">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
            <p className="text-xl text-gray-400 mb-6">Aún no has agregado nada a tu pedido.</p>
            <Link to="/menu">
              <Button>Ir al Menú</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white/5 rounded-sm border border-white/10 p-6 md:p-10">
            <p className="text-gray-400 mb-6">Tus productos se pueden visualizar y modificar desde el menú lateral.</p>
            <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-6">
              <span className="text-lg">Total estimado:</span>
              <span className="text-3xl font-bold text-sushi-gold">
                ${getCartTotal().toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link to="/menu" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  Seguir comprando
                </Button>
              </Link>
              <Button 
                className="w-full sm:w-auto flex gap-2 items-center"
                onClick={() => setIsCartOpen(true)}
              >
                Abrir resumen <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
