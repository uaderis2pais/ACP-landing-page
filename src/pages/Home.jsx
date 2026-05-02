import React, { Suspense } from 'react';
import { Button } from '../components/ui/Button';
import { HungerBanner } from '../components/common/HungerBanner';
import { useInView } from '../hooks/useInView';
import { useIsOpen } from '../hooks/useIsOpen';
import { MessageCircle, Calendar } from 'lucide-react';
import { openWhatsAppWithMessage } from '../utils/whatsappGuard';
import { config } from '../config';

const Menu = React.lazy(() => import('./Menu').then(mod => ({ default: mod.Menu })));
const Contact = React.lazy(() => import('./Contact').then(mod => ({ default: mod.Contact })));
const FAQ = React.lazy(() => import('../components/common/FAQ').then(mod => ({ default: mod.FAQ })));

/* ─── Monday closed Hero ──────────────────────────────────────────────────── */
function MondayHero({ heroRef, heroVisible }) {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=70&w=640&auto=format&fit=crop" 
          />
          <source 
            media="(max-width: 1024px)" 
            srcSet="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=75&w=1024&auto=format&fit=crop" 
          />
          <img
            src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1280&auto=format&fit=crop"
            alt={`${config.nombreDelNegocio} - Sushi de alta calidad`}
            width="1280"
            height="800"
            fetchPriority="high"
            decoding="sync"
            className="w-full h-full object-cover opacity-20 grayscale"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-sushi-black via-sushi-black/90 to-transparent" />
      </div>

      <div
        ref={heroRef}
        className={`relative z-10 text-center px-4 max-w-3xl mx-auto mt-16 anim-fade-up ${heroVisible ? 'in-view' : ''}`}
      >
        {/* Closed badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white shadow-md backdrop-blur-md text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-sushi-red" />
          Cerrado hoy — Lunes
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-md">
          Volvemos mañana<br />
          <span className="text-brand-400">¡Con todo!</span>
        </h1>

        <p className="text-lg text-gray-300 mb-3 max-w-xl mx-auto font-light leading-relaxed">
          Los lunes descansamos para preparar el mejor sushi de la semana.
          Reabrimos el <strong className="text-white">martes a las 20:00</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-10">
          Mientras tanto, podés adelantar tu pedido por WhatsApp y lo tenemos listo para mañana 🍣
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={() => openWhatsAppWithMessage('Hola! Quiero hacer una reserva anticipada para mañana:')}
            className="w-full sm:w-auto bg-[#7C5228] hover:bg-[#5C3A1A] text-white flex items-center gap-2 justify-center"
          >
            <MessageCircle className="w-4 h-4" />
            Reservar para mañana
          </Button>
          <a href="#menu" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 justify-center">
              <Calendar className="w-4 h-4" />
              Ver el menú
            </Button>
          </a>
        </div>

        {/* Schedule reminder */}
        <div className="mt-12 flex justify-center">
          <div className="bg-black/30 rounded-2xl shadow-sm px-6 py-3 border border-white/10 text-xs text-gray-400">
            <p className="font-bold text-gray-200 mb-1">{config.horarios.todos.label}</p>
            <p>{config.horarios.todos.value}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Normal Hero ─────────────────────────────────────────────────────────── */
function NormalHero({ heroRef, heroVisible }) {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=70&w=640&auto=format&fit=crop" 
          />
          <source 
            media="(max-width: 1024px)" 
            srcSet="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=75&w=1024&auto=format&fit=crop" 
          />
          <img
            src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1280&auto=format&fit=crop"
            alt={`${config.nombreDelNegocio} - ${config.eslogan}`}
            width="1280"
            height="800"
            fetchPriority="high"
            decoding="sync"
            className="w-full h-full object-cover opacity-20 grayscale"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-sushi-black via-sushi-black/80 to-transparent" />
      </div>

      <div
        ref={heroRef}
        className={`relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 anim-fade-up ${heroVisible ? 'in-view' : ''}`}
      >
        <span className="text-brand-400 text-sm tracking-[0.3em] uppercase mb-4 block font-bold">
          {config.eslogan}
        </span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-lg">
          {config.nombreDelNegocio}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          {config.descripcion}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#menu" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Ver menú</Button>
          </a>
          <a href="#contact" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">Pedir ahora</Button>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export function Home() {
  const [heroRef, heroVisible]           = useInView({ threshold: 0.1 });
  const [aboutImgRef, aboutImgVisible]   = useInView();
  const [aboutTextRef, aboutTextVisible] = useInView();
  const [ctaRef, ctaVisible]             = useInView({ threshold: 0.2 });

  const { isMonday, isHungryHour } = useIsOpen();

  return (
    <>
      {/* ── Hero (context-aware) ──────────────────────────── */}
      {isMonday
        ? <MondayHero heroRef={heroRef} heroVisible={heroVisible} />
        : <NormalHero heroRef={heroRef} heroVisible={heroVisible} />
      }

      {/* ── About ────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-sushi-darkGray relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            <div
              ref={aboutImgRef}
              className={`order-2 md:order-1 relative group anim-fade-left ${aboutImgVisible ? 'in-view' : ''}`}
            >
              <div className="absolute -inset-4 border border-[#7C5228]/20 transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 rounded-2xl" />
              <img
                src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop"
                alt="Maestro sushero preparando piezas frescas"
                loading="lazy"
                width="800"
                height="500"
                className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            <div
              ref={aboutTextRef}
              className={`order-1 md:order-2 anim-fade-right ${aboutTextVisible ? 'in-view' : ''}`}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white tracking-tight">El Arte del Sushi</h2>
              <p className="text-gray-300 mb-8 leading-relaxed font-light text-lg">
                {config.descripcion}
              </p>

              <div className={`space-y-4 anim-stagger ${aboutTextVisible ? 'in-view' : ''}`}>
                {[
                  { title: 'Ingredientes Frescos', desc: 'Seleccionamos la mejor pesca del día y vegetales de temporada.', borderCol: 'border-l-[#7C5228]' },
                  { title: 'Variedad Exquisita', desc: 'Desde clásicos hasta creaciones de autor únicas en la zona.', borderCol: 'border-l-amber-400' },
                  { title: 'Experiencia Gastronómica', desc: 'No es solo comida, es un viaje de sabores en cada pieza.', borderCol: 'border-l-rose-400' }
                ].map((item, i) => (
                  <div key={i} className={`flex items-start border-l-4 ${item.borderCol} pl-5 bg-black/30 shadow-sm border border-white/5 py-5 rounded-r-2xl hover:bg-black/50 hover:shadow-md transition-all`}>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                      <p className="text-gray-400 mt-1 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Suspense wrapping below-the-fold content ───────── */}
      <Suspense fallback={<div className="min-h-screen bg-sushi-black flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full animate-spin"></div></div>}>
        {/* ── Menú (with hunger banner) ─────────────────────── */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 -mb-16">
            <HungerBanner visible={isHungryHour && !isMonday} />
          </div>
          <Menu />
        </div>

        {/* ── Contacto ─────────────────────────────────────── */}
        <Contact />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <FAQ />
      </Suspense>

      {/* ── CTA final ────────────────────────────────────── */}
      <section className="py-32 bg-[#7C5228] relative overflow-hidden text-center mt-24">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <div
          ref={ctaRef}
          className={`relative z-10 max-w-3xl mx-auto px-4 anim-scale-in ${ctaVisible ? 'in-view' : ''}`}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-white drop-shadow-md">¿Listo para probar el mejor sushi?</h2>
          <a href="#menu">
            <Button className="bg-sushi-black text-white hover:bg-gray-900 border border-white/10 px-10 py-5 text-lg shadow-xl hover:-translate-y-1 transition-transform">
              Hacer pedido
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
