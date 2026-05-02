import { useState, useMemo } from 'react';
import { X, Utensils } from 'lucide-react';
import { menuData } from '../../data/data';

/**
 * HungerBanner — Shows between 20:00 and 21:00 over the menu section.
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
    <div className="relative flex items-center justify-between gap-4 bg-gradient-to-r from-[#7C5228] to-brand-700 backdrop-blur-sm text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl mb-8 border border-[#7C5228]/20 animate-[fadeInDown_0.5s_ease-out]">
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
        className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
      >
        <div className="bg-white/10 p-1.5 rounded-full">
          <X className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
