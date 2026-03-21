import { MapPin, Phone, Instagram, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useInView } from '../hooks/useInView';
import { openWhatsAppWithMessage } from '../utils/whatsappGuard';

export function Contact() {
  const [headerRef, headerVisible] = useInView({ threshold: 0.2 });
  const [leftRef, leftVisible] = useInView();
  const [mapRef, mapVisible] = useInView({ threshold: 0.1 });

  return (
    <section id="contact" className="py-24 bg-sushi-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-16 anim-fade-up ${headerVisible ? 'in-view' : ''}`}
        >
          <span className="text-sushi-gold text-sm tracking-[0.2em] uppercase font-medium">
            Contactanos
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">Visita y Reservas</h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Te esperamos para vivir una experiencia gastronómica única, o te lo llevamos a donde estés.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div
            ref={leftRef}
            className={`bg-white/5 p-8 md:p-12 rounded-sm border border-white/10 shadow-lg anim-fade-left ${leftVisible ? 'in-view' : ''}`}
          >
            <h2 className="text-3xl font-serif font-bold mb-8">Información del Local</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-sushi-darkGray border border-white/10 flex items-center justify-center flex-shrink-0 group hover:border-sushi-gold transition-colors">
                  <MapPin className="w-5 h-5 text-sushi-gold" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Dirección</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">3 de Febrero 71<br />Concepción del Uruguay, Entre Ríos</p>

                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-sushi-darkGray border border-white/10 flex items-center justify-center flex-shrink-0 group hover:border-sushi-gold transition-colors">
                  <Phone className="w-5 h-5 text-sushi-gold" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Teléfono</h4>
                  <a href="tel:01158774154" className="text-gray-400 text-sm hover:text-white transition-colors underline-offset-4 hover:underline">
                    011 5877-4154
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-sushi-darkGray border border-white/10 flex items-center justify-center flex-shrink-0 group hover:border-sushi-gold transition-colors">
                  <Instagram className="w-5 h-5 text-sushi-gold" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Redes Sociales</h4>
                  <a 
                    href="https://www.instagram.com/agarramecomopuedas" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sushi-red text-sm hover:text-white transition-colors flex items-center gap-1"
                  >
                    @agarramecomopuedas <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <h4 className="text-lg font-medium mb-4">Horarios de Atención</h4>
              <div className="text-sm text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Martes a Jueves</span>
                  <span className="text-white font-medium">19:30 - 00:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Viernes a Domingos</span>
                  <span className="text-white font-medium">19:30 - 01:00</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Lunes</span>
                  <span>Cerrado</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => openWhatsAppWithMessage('Hola buen día!\nTengo una consulta:')}
              className="w-full mt-8 flex gap-2 items-center bg-green-600 hover:bg-green-700 shadow-[0_0_20px_rgba(22,163,74,0.2)]"
            >
              Contactar por WhatsApp
            </Button>
          </div>

          <div
            ref={mapRef}
            className={`h-[600px] w-full rounded-sm overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl relative group anim-fade-right ${mapVisible ? 'in-view' : ''}`}
          >
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-sushi-gold/30 transition-colors z-10 pointer-events-none" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.675001234567!2d-58.2323!3d-32.4822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDI4JzU1LjkiUyA1OMKwMTMnNTYuMyJX!5e0!3m2!1sen!2sar!4v1612345678901!5m2!1sen!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Agarrame como puedas"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
