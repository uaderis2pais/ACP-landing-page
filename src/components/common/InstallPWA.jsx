import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If currently in standalone mode, don't show the prompt
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsVisible(false);
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] bg-sushi-black border border-sushi-gold/30 rounded-lg p-4 shadow-2xl z-50 flex flex-col items-start gap-4 anim-fade-up in-view">

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 min-w-[48px] min-h-[48px] flex items-center justify-center text-gray-400 hover:text-white rounded-full z-10"
        aria-label="Cerrar banner de instalación"
      >
        <div className="bg-white/5 p-1.5 rounded-full">
          <X className="w-4 h-4" />
        </div>
      </button>

      <div className="flex items-center gap-4 w-full px-2 pt-1">
        <div className="w-14 h-14 flex-shrink-0 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 p-2 shadow-inner">
          <img src="/logoinvisible.webp" alt="App Icon" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 pr-6">
          <p className="font-bold text-white leading-tight mb-1 text-lg">Agarrame App</p>
          <p className="text-xs text-gray-400 leading-snug">Instalá la web-app para pedir más rápido, revisar el menú offline y sin ocupar espacio.</p>
        </div>
      </div>

      <Button
        onClick={handleInstallClick}
        className="w-full bg-sushi-gold text-sushi-black hover:bg-yellow-400 gap-2 font-bold transform hover:scale-[1.02] transition-all shadow-lg shadow-sushi-gold/20"
      >
        <Download className="w-4 h-4" />
        Instalar Ahora
      </Button>

    </div>
  );
}
