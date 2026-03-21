import { useState, useMemo } from 'react';
import { X, Utensils } from 'lucide-react';
import { menuData } from '../../data/data';

/**
 * HungerBanner — Shows between 19:30 and 21:00 over the menu section.
 * Recommends a real 'popular' product from the menu. Dismissable per session.
 */
export function HungerBanner({ visible }) {
  const [dismissed, setDismissed] = useState(false);

  // Pick a random popular product — stable per render (useMemo with no deps)
  const recommended = useMemo(() => {
    const popular = menuData.filter(p => p.tag === 'popular');
    if (!popular.length) return null;
    return popular[Math.floor(Math.random() * popular.length)];
  }, []);

  if (!visible || dismissed || !recommended) return null;

  return (
    <div className="relative flex items-center justify-between gap-4 bg-gradient-to-r from-sushi-red/90 to-orange-600/90 backdrop-blur-sm text-white text-sm font-medium px-5 py-3 rounded-lg shadow-xl mb-8 border border-white/10 animate-[fadeInDown_0.5s_ease-out]">
      <div className="flex items-center gap-3">
        <Utensils className="w-5 h-5 flex-shrink-0 opacity-80" />
        <span>
          <strong>¿Mucha hambre?</strong> Te recomendamos{' '}
          <span className="underline decoration-dotted font-semibold">
            {recommended.name}
          </span>{' '}
          — ${recommended.price.toLocaleString('es-AR')} 🍣
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Cerrar sugerencia"
        className="p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
