import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Plus, Flame, Sparkles } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useIsOpen } from '../hooks/useIsOpen';

/* ─── Tag Badge ──────────────────────────────────────────────────────────── */
function TagBadge({ tag }) {
  if (!tag) return null;

  const styles = {
    popular: {
      label: '🔥 Más pedido',
      className: 'bg-sushi-gold/20 text-sushi-black border border-sushi-gold/40',
    },
    nuevo: {
      label: '✨ Nuevo',
      className: 'bg-purple-500/20 text-white border border-purple-500/40',
    },
  };

  const s = styles[tag];
  if (!s) return null;

  return (
    <span className={`absolute top-3 left-3 z-20 text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-sm backdrop-blur-sm ${s.className}`}>
      {s.label}
    </span>
  );
}

/* ─── Open/Closed status bar ─────────────────────────────────────────────── */
function OpenStatusBar() {
  const { isOpen, isMonday, message } = useIsOpen();

  if (isOpen) {
    return (
      <div className="flex items-center gap-2 justify-center mb-8 py-2 px-4 rounded-full text-sm font-medium w-fit mx-auto border bg-green-500/10 border-green-500/30 text-green-400">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Abierto ahora — ¡Pedí tu sushi!
      </div>
    );
  }

  // Closed state — show the correct next open time prominently
  const displayMessage = isMonday
    ? 'Hoy estamos cerrados — Abrimos mañana a las 19:30 🕖'
    : message;

  return (
    <div className={`flex items-center gap-2 justify-center mb-8 py-2.5 px-5 rounded-full text-sm font-medium w-fit mx-auto border ${isMonday
      ? 'bg-red-500/10 border-red-500/30 text-red-400'
      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      }`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isMonday ? 'bg-red-400' : 'bg-amber-400'}`} />
      {displayMessage}
    </div>
  );
}

/* ─── Individual product card ────────────────────────────────────────────── */
function ProductCard({ product, onAddToCart, isOpen }) {
  const [ref, visible] = useInView({ threshold: 0.1 });
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div ref={ref} className={`anim-fade-up ${visible ? 'in-view' : ''}`}>
      <Card className="group hover:-translate-y-2 transition-transform duration-300 border-white/5 bg-black/40 hover:bg-black/60 hover:shadow-2xl hover:shadow-sushi-red/10 flex flex-col h-full">
        <div className="relative overflow-hidden h-64 bg-black/20 rounded-t-lg flex items-center justify-center p-2">
          {/* Tag badge */}
          <TagBadge tag={product.tag} />

          {/* Skeleton shimmer */}
          {!imgLoaded && <div className="absolute inset-0 skeleton rounded-t-lg" />}

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width="400"
            height="256"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover drop-shadow-xl group-hover:scale-110 transition-all duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <span className="absolute bottom-4 right-4 text-sushi-gold font-bold text-xl drop-shadow-md">
            ${product.price.toLocaleString('es-AR')}
          </span>
        </div>

        <CardContent className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-sushi-red transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed flex-1">{product.description}</p>
          <Button
            variant="outline"
            disabled={!isOpen}
            title={!isOpen ? 'El local está cerrado' : undefined}
            className={`w-full mt-6 flex gap-2 items-center transition-colors ${isOpen
              ? 'group-hover:bg-sushi-red group-hover:border-sushi-red group-hover:text-white'
              : 'opacity-50 cursor-not-allowed'
              }`}
            onClick={() => isOpen && onAddToCart(product)}
          >
            <Plus className="w-4 h-4" />
            {isOpen ? 'Agregar al carrito' : 'Cerrado ahora'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Menu section ───────────────────────────────────────────────────────── */
export function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isOpen } = useIsOpen();
  const [headerRef, headerVisible] = useInView({ threshold: 0.2 });

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="menu" className="py-24 bg-sushi-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          ref={headerRef}
          className={`text-center mb-6 anim-fade-up ${headerVisible ? 'in-view' : ''}`}
        >
          <span className="text-sushi-gold text-sm tracking-[0.2em] uppercase font-medium">
            Nuestra Selección
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">Menú Principal</h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Explora las delicias frescas y de calidad premium que preparamos diariamente.
          </p>
        </div>

        {/* Real-time open/closed indicator */}
        <OpenStatusBar />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(s => (
              <Card key={s} className="border-transparent h-96">
                <div className="h-64 skeleton w-full rounded-t-lg" />
                <CardContent className="mt-6 flex flex-col gap-3 px-6">
                  <div className="h-6 skeleton w-3/4 rounded-sm" />
                  <div className="h-4 skeleton w-full rounded-sm" />
                  <div className="h-4 skeleton w-5/6 rounded-sm" />
                  <div className="h-10 skeleton w-full mt-auto rounded-sm" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isOpen={isOpen}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
