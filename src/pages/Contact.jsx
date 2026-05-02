import { MapPin, Phone, Instagram, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useInView } from '../hooks/useInView';
import { openWhatsAppWithMessage } from '../utils/whatsappGuard';
import { config } from '../config';

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

/** Mapa embed o placeholder visual si config.googleMapsEmbedUrl es null */
function MapSection() {
  if (config.googleMapsEmbedUrl) {
    return (
      <iframe
        src={config.googleMapsEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Ubicación de ${config.nombreDelNegocio}`}
      />
    );
  }

  /* ── Placeholder visual: simula un mapa con calles ─── */
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1a1510] flex items-center justify-center">

      {/* ── Fondo: grilla de "calles" estilo mapa ── */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-streets" width="60" height="60" patternUnits="userSpaceOnUse">
            {/* calles horizontales */}
            <line x1="0" y1="20" x2="60" y2="20" stroke="#7C5228" strokeWidth="1"/>
            <line x1="0" y1="50" x2="60" y2="50" stroke="#7C5228" strokeWidth="2.5"/>
            {/* calles verticales */}
            <line x1="15" y1="0" x2="15" y2="60" stroke="#7C5228" strokeWidth="1"/>
            <line x1="45" y1="0" x2="45" y2="60" stroke="#7C5228" strokeWidth="2.5"/>
          </pattern>
          <pattern id="grid-blocks" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* manzanas */}
            <rect x="6" y="6" width="48" height="48" rx="3" fill="#7C5228" fillOpacity="0.06"/>
            <rect x="66" y="6" width="48" height="48" rx="3" fill="#7C5228" fillOpacity="0.06"/>
            <rect x="6" y="66" width="48" height="48" rx="3" fill="#7C5228" fillOpacity="0.06"/>
            <rect x="66" y="66" width="48" height="48" rx="3" fill="#7C5228" fillOpacity="0.06"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-blocks)"/>
        <rect width="100%" height="100%" fill="url(#grid-streets)"/>
      </svg>

      {/* ── Viñeta oscura en los bordes ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#1a1510_100%)] pointer-events-none" />

      {/* ── Contenido central ── */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">

        {/* Pin animado */}
        <div className="relative">
          {/* Aro de pulso */}
          <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#7C5228]/30 animate-ping" />
          {/* Pin */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#A87A56] to-[#7C5228] flex items-center justify-center shadow-[0_0_30px_rgba(124,82,40,0.6)] border-2 border-[#C08550]/40">
            <MapPin className="w-7 h-7 text-white drop-shadow" />
          </div>
        </div>

        {/* Tarjeta de dirección */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 shadow-xl max-w-xs">
          <p className="text-white font-bold text-base mb-1 tracking-tight">{config.nombreDelNegocio}</p>
          <p className="text-gray-400 text-sm">{config.direccion.calle}</p>
          <p className="text-gray-500 text-xs mt-0.5">{config.direccion.ciudad}, {config.direccion.provincia}</p>
        </div>

        {/* Badge instructivo para el cliente */}
        <div className="bg-[#7C5228]/15 border border-[#7C5228]/40 rounded-xl px-4 py-2.5 flex items-center gap-2.5 max-w-sm">
          <div className="w-6 h-6 rounded-full bg-[#7C5228]/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-brand-400 text-xs leading-snug text-left">
            <span className="font-bold text-brand-300 block">Acá irá tu mapa de Google Maps</span>
            Pegá tu link de embed en <code className="bg-black/40 px-1 rounded text-[10px]">config.googleMapsEmbedUrl</code>
          </p>
        </div>

      </div>
    </div>
  );
}


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
          <span className="text-brand-400 text-sm tracking-[0.3em] font-bold uppercase">
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
                <div className="w-12 h-12 rounded-full bg-[#7C5228]/20 border border-[#7C5228]/30 flex items-center justify-center flex-shrink-0 group hover:bg-[#7C5228] transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-brand-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white mb-1">Dirección</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {config.direccion.calle}<br />
                    {config.direccion.ciudad}, {config.direccion.provincia}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-[#7C5228]/20 border border-[#7C5228]/30 flex items-center justify-center flex-shrink-0 group hover:bg-[#7C5228] transition-colors duration-300">
                  <Phone className="w-5 h-5 text-brand-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white mb-1">Teléfono</h4>
                  <a href={`tel:${config.telefonoHref}`} className="text-gray-400 text-sm hover:text-brand-400 transition-colors underline-offset-4 hover:underline">
                    {config.telefono}
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-[#7C5228]/20 border border-[#7C5228]/30 flex items-center justify-center flex-shrink-0 group hover:bg-[#7C5228] transition-colors duration-300">
                  <Instagram className="w-5 h-5 text-brand-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white mb-1">Instagram</h4>
                  <a
                    href={config.redesSociales.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 font-medium text-sm hover:text-brand-300 transition-colors flex items-center gap-1"
                  >
                    {config.redesSociales.instagram.handle} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* TikTok */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-[#7C5228]/20 border border-[#7C5228]/30 flex items-center justify-center flex-shrink-0 group hover:bg-[#7C5228] transition-colors duration-300">
                  <TiktokIcon className="w-5 h-5 text-brand-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white mb-1">TikTok</h4>
                  <a
                    href={config.redesSociales.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 font-medium text-sm hover:text-brand-300 transition-colors flex items-center gap-1"
                  >
                    {config.redesSociales.tiktok.handle} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <h4 className="text-lg font-bold tracking-tight text-white mb-4">Horarios de Atención</h4>
              <div className="text-sm text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>{config.horarios.todos.label}</span>
                  <span className="font-bold text-white">{config.horarios.todos.value}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => openWhatsAppWithMessage('Hola buen día!\nTengo una consulta:')}
              className="w-full mt-8 flex gap-2 items-center bg-[#7C5228] text-white hover:bg-[#5C3A1A] rounded-2xl shadow-md hover:shadow-lg"
            >
              Contactar por WhatsApp
            </Button>
          </div>

          <div
            ref={mapRef}
            className={`h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group anim-fade-right ${mapVisible ? 'in-view' : ''}`}
          >
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#7C5228]/20 transition-colors z-10 pointer-events-none rounded-2xl" />
            <MapSection visible={mapVisible} />
          </div>
        </div>
      </div>
    </section>
  );
}