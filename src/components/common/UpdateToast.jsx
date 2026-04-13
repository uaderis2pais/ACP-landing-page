import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export function UpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Chequear actualizaciones cada 60 segundos mientras la app está abierta
      if (r) {
        setInterval(() => r.update(), 60 * 1000);
      }
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true); // true = recargar inmediatamente
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[92%] max-w-sm animate-in slide-in-from-bottom-4 duration-500"
    >
      <div className="bg-[#0c1a10]/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.15)] p-4 flex items-center gap-4">
        
        {/* Icono */}
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
          <RefreshCw size={18} className="text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white uppercase tracking-widest">Nueva versión disponible</p>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
            Hay precios o productos actualizados. Tocá para cargar la última versión.
          </p>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleUpdate}
            className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all whitespace-nowrap"
          >
            Actualizar
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Descartar"
            className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
