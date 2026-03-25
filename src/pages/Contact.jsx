import { MapPin, Phone, Instagram, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useInView } from '../hooks/useInView';
import { openWhatsAppWithMessage } from '../utils/whatsappGuard';

const TiktokIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Contact() {
  const [headerRef, headerVisible] = useInView({ threshold: 0.2 });
  const [leftRef, leftVisible] = useInView();
  const [mapRef, mapVisible] = useInView({ threshold: 0.1 });

  return (
    <section id="contact" className="py-24 bg-sushi-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-16 anim-fade-up ${headerVisible ? 'in-view' : ''}`}
        >
          <span className="text-emerald-400 text-sm tracking-[0.3em] font-bold uppercase">
            Contactanos
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3 text-white drop-shadow-sm">Visita y Reservas</h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto font-light leading-relaxed">
            Te esperamos para vivir una experiencia gastronómica única, o te lo llevamos a donde estés.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div
            ref={leftRef}
            className={`bg-sushi-darkGray p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl anim-fade-left ${leftVisible ? 'in-view' : ''}`}
          >
            <h2 className="text-3xl font-serif font-bold mb-8 text-white tracking-tight">Información del Local</h2>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-[#155E5D]/20 border border-[#155E5D]/30 flex items-center justify-center flex-shrink-0 group hover:bg-[#155E5D] transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white mb-1">Dirección</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">3 de Febrero 71<br />Concepción del Uruguay, Entre Ríos</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-[#155E5D]/20 border border-[#155E5D]/30 flex items-center justify-center flex-shrink-0 group hover:bg-[#155E5D] transition-colors duration-300">
                  <Phone className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white mb-1">Teléfono</h4>
                  <a href="tel:01158774154" className="text-gray-400 text-sm hover:text-emerald-400 transition-colors underline-offset-4 hover:underline">
                    011 5877-4154
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-[#155E5D]/20 border border-[#155E5D]/30 flex items-center justify-center flex-shrink-0 group hover:bg-[#155E5D] transition-colors duration-300">
                  <Instagram className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white mb-1">Instagram</h4>
                  <a
                    href="https://www.instagram.com/agarramecomopuedassushi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-medium text-sm hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    @agarramecomopuedas <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* TikTok */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-[#155E5D]/20 border border-[#155E5D]/30 flex items-center justify-center flex-shrink-0 group hover:bg-[#155E5D] transition-colors duration-300">
                  <TiktokIcon className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white mb-1">TikTok</h4>
                  <a
                    href="https://www.tiktok.com/@agarramecomopuedas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-medium text-sm hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    @agarramecomopuedas <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <h4 className="text-lg font-bold tracking-tight text-white mb-4">Horarios de Atención</h4>
              <div className="text-sm text-gray-400 space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Martes a Jueves</span>
                  <span className="font-bold text-white">20:00 - 00:30</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 pt-1">
                  <span>Viernes a Domingos</span>
                  <span className="font-bold text-white">20:00 - 00:30</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Lunes</span>
                  <span className="text-gray-500 font-medium tracking-tight">Cerrado</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => openWhatsAppWithMessage('Hola buen día!\nTengo una consulta:')}
              className="w-full mt-8 flex gap-2 items-center bg-[#155E5D] text-white hover:bg-[#0f4645] rounded-2xl shadow-md hover:shadow-lg"
            >
              Contactar por WhatsApp
            </Button>
          </div>

          <div
            ref={mapRef}
            className={`h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group anim-fade-right ${mapVisible ? 'in-view' : ''}`}
          >
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#155E5D]/20 transition-colors z-10 pointer-events-none rounded-2xl" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3365.5085323646435!2d-58.235467888325715!3d-32.48583477367739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95afdb1ee0bcb177%3A0xd321aaae6b8e8763!2sAgarrame%20como%20puedas!5e0!3m2!1ses-419!2sar!4v1774474876873!5m2!1ses-419!2sar"
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