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
      className: 'bg-sushi-black text-sushi-gold border border-sushi-gold/30',
    },
    nuevo: {
      label: '✨ Nuevo',
      className: 'bg-sushi-black text-sushi-red border border-sushi-red/30',
    },
  };

  const s = styles[tag];
  if (!s) return null;

  return (
    <span className={`absolute top-3 left-3 z-20 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-sm shadow-sm ${s.className}`}>
      {s.label}
    </span>
  );
}

/* ─── Open/Closed status bar ─────────────────────────────────────────────── */
function OpenStatusBar() {
  const { isOpen, isMonday, message } = useIsOpen();

  if (isOpen && !isMonday) {
    return (
      <div className="flex items-center gap-2 justify-center mb-8 py-2 px-4 rounded-full text-sm font-bold w-fit mx-auto border bg-[#7C5228]/10 border-[#7C5228]/30 text-brand-400 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        Abierto ahora — ¡Pedí tu sushi!
      </div>
    );
  }

  // Closed state — show the correct next open time prominently
  const displayMessage = isMonday
    ? 'Hoy estamos cerrados — Abrimos mañana a las 20:00 🕖'
    : message;

  return (
    <div className={`flex items-center gap-2 justify-center mb-8 py-2.5 px-5 rounded-full text-sm font-bold w-fit mx-auto border shadow-sm ${isMonday
      ? 'bg-red-900/20 border-red-500/30 text-red-400'
      : 'bg-amber-900/20 border-amber-500/30 text-amber-400'
      }`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isMonday ? 'bg-red-500' : 'bg-amber-500'}`} />
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
      <Card className="group hover:-translate-y-2 transition-all duration-300 border border-white/10 bg-black/30 hover:shadow-2xl hover:border-white/20 flex flex-col h-full rounded-2xl overflow-hidden">
        <div className="relative overflow-hidden h-64 bg-sushi-black flex items-center justify-center">
          {/* Tag badge */}
          <TagBadge tag={product.tag} />

          {/* Skeleton shimmer */}
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width="400"
            height="256"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <span className="absolute bottom-4 right-4 bg-sushi-black/95 backdrop-blur-sm text-brand-400 font-black text-lg px-4 py-1.5 rounded-full shadow-md border border-white/10">
            ${product.price.toLocaleString('es-AR')}
          </span>
        </div>

        <CardContent className="p-6 flex flex-col flex-1 bg-black/30">
          <h3 className="text-xl font-serif font-bold tracking-tight mb-2 text-white group-hover:text-brand-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed flex-1">{product.description}</p>
          <Button
            variant="outline"
            className="w-full mt-6 flex gap-2 items-center transition-all group-hover:bg-brand-600 group-hover:border-brand-600 group-hover:text-white"
            onClick={() => onAddToCart(product)}
          >
            <Plus className="w-4 h-4" />
            Agregar al carrito
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
          <span className="text-brand-400 text-sm tracking-[0.3em] font-bold uppercase">
            Nuestra Selección
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3 text-white drop-shadow-sm">Menú Principal</h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto font-light leading-relaxed">
            Explora las delicias frescas y de calidad premium que preparamos diariamente.
          </p>
        </div>

        {/* Real-time open/closed indicator */}
        <OpenStatusBar />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(s => (
              <Card key={s} className="border-white/10 bg-black/30 shadow-sm rounded-2xl h-96 overflow-hidden">
                <div className="h-64 skeleton w-full" />
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
