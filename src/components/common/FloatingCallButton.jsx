import { Phone } from 'lucide-react';

/**
 * FloatingCallButton — visible only on mobile (md:hidden)
 * Appears in the bottom-left to not conflict with the WhatsApp FAB on the right.
 */
export function FloatingCallButton() {
  return (
    <a
      href="tel:01158774154"
      aria-label="Llamar al restaurante"
      className="md:hidden fixed bottom-6 left-6 w-14 h-14 bg-sushi-gold rounded-full flex items-center justify-center text-sushi-black shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-50 hover:shadow-[0_0_24px_rgba(212,175,55,0.5)]"
    >
      <Phone className="w-6 h-6" strokeWidth={2.5} />
    </a>
  );
}
