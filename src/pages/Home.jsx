import { Button } from '../components/ui/Button';
import { Menu } from './Menu';
import { Contact } from './Contact';
import { FAQ } from '../components/common/FAQ';
import { HungerBanner } from '../components/common/HungerBanner';
import { useInView } from '../hooks/useInView';
import { useIsOpen } from '../hooks/useIsOpen';
import { MessageCircle, Calendar } from 'lucide-react';
import { openWhatsAppWithMessage } from '../utils/whatsappGuard';

/* ─── Monday closed Hero ──────────────────────────────────────────────────── */
function MondayHero({ heroRef, heroVisible }) {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcset="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=70&w=640&auto=format&fit=crop" 
          />
          <source 
            media="(max-width: 1024px)" 
            srcset="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=75&w=1024&auto=format&fit=crop" 
          />
          <img
            src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1280&auto=format&fit=crop"
            alt="Sushi de alta calidad"
            width="1280"
            height="800"
            decoding="sync"
            className="w-full h-full object-cover opacity-20 grayscale"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-sushi-black via-sushi-black/70 to-sushi-black/40" />
      </div>

      <div
        ref={heroRef}
        className={`relative z-10 text-center px-4 max-w-3xl mx-auto mt-16 anim-fade-up ${heroVisible ? 'in-view' : ''}`}
      >
        {/* Closed badge */}
        <div className="inline-flex items-center gap-2 bg-gray-800/80 border border-gray-600/40 text-gray-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-gray-500" />
          Cerrado hoy — Lunes
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-lg">
          Volvemos mañana<br />
          <span className="text-sushi-gold">¡Con todo!</span>
        </h1>

        <p className="text-lg text-gray-400 mb-3 max-w-xl mx-auto font-light">
          Los lunes descansamos para preparar el mejor sushi de la semana.
          Reabrimos el <strong className="text-white">martes a las 19:30</strong>.
        </p>
        <p className="text-sm text-gray-500 mb-10">
          Mientras tanto, podés adelantar tu pedido por WhatsApp y lo tenemos listo para mañana 🍣
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={() => openWhatsAppWithMessage('Hola! Quiero hacer una reserva anticipada para mañana:')}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 flex items-center gap-2 justify-center"
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
        <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm mx-auto text-xs text-gray-500">
          <div className="bg-white/5 rounded-sm px-4 py-3 border border-white/5">
            <p className="font-semibold text-gray-400 mb-1">Mar – Jue</p>
            <p>19:30 → 00:00</p>
          </div>
          <div className="bg-white/5 rounded-sm px-4 py-3 border border-white/5">
            <p className="font-semibold text-gray-400 mb-1">Vie – Dom</p>
            <p>19:30 → 01:00</p>
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
            srcset="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=70&w=640&auto=format&fit=crop" 
          />
          <source 
            media="(max-width: 1024px)" 
            srcset="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=75&w=1024&auto=format&fit=crop" 
          />
          <img
            src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1280&auto=format&fit=crop"
            alt="Agarrame como puedas - Sushi Premium"
            width="1280"
            height="800"
            fetchpriority="high"
            decoding="sync"
            className="w-full h-full object-cover opacity-40"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-sushi-black via-sushi-black/50 to-transparent" />
      </div>

      <div
        ref={heroRef}
        className={`relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 anim-fade-up ${heroVisible ? 'in-view' : ''}`}
      >
        <span className="text-sushi-gold text-sm tracking-[0.3em] uppercase mb-4 block font-medium">
          Sushi Premium
        </span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-lg">
          Agarrame<br/>como puedas
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
          El sushi más fresco de Concepción del Uruguay. Una experiencia gastronómica inigualable.
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
  const [heroRef, heroVisible]         = useInView({ threshold: 0.1 });
  const [aboutImgRef, aboutImgVisible] = useInView();
  const [aboutTextRef, aboutTextVisible] = useInView();
  const [ctaRef, ctaVisible]           = useInView({ threshold: 0.2 });

  const { isMonday, isHungryHour } = useIsOpen();

  return (
    <>
      {/* ── Hero (context-aware) ──────────────────────────── */}
      {isMonday
        ? <MondayHero heroRef={heroRef} heroVisible={heroVisible} />
        : <NormalHero heroRef={heroRef} heroVisible={heroVisible} />
      }

      {/* ── About ────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-sushi-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            <div
              ref={aboutImgRef}
              className={`order-2 md:order-1 relative group anim-fade-left ${aboutImgVisible ? 'in-view' : ''}`}
            >
              <div className="absolute -inset-4 border border-sushi-gold/20 transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 rounded-sm" />
              <img
                src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop"
                alt="Maestro sushero preparando piezas frescas"
                loading="lazy"
                width="800"
                height="500"
                className="relative z-10 w-full h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-sm shadow-2xl"
              />
            </div>

            <div
              ref={aboutTextRef}
              className={`order-1 md:order-2 anim-fade-right ${aboutTextVisible ? 'in-view' : ''}`}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">El Arte del Sushi</h2>
              <p className="text-gray-400 mb-8 leading-relaxed font-light text-lg">
                Restaurante asiático especializado en sushi fresco, con ingredientes de calidad y gran variedad de opciones. Nos dedicamos a perfeccionar cada bocado para brindarte una experiencia auténtica.
              </p>

              <div className={`space-y-6 anim-stagger ${aboutTextVisible ? 'in-view' : ''}`}>
                {[
                  { title: 'Ingredientes Frescos', desc: 'Seleccionamos la mejor pesca del día y vegetales de temporada.', borderCol: 'border-l-green-500' },
                  { title: 'Variedad Exquisita', desc: 'Desde clásicos hasta creaciones de autor únicas en la zona.', borderCol: 'border-l-sushi-red' },
                  { title: 'Experiencia Gastronómica', desc: 'No es solo comida, es un viaje de sabores en cada pieza.', borderCol: 'border-l-sushi-gold' }
                ].map((item, i) => (
                  <div key={i} className={`flex items-start border-l-4 ${item.borderCol} pl-4 bg-white/5 py-4 rounded-r-md hover:bg-white/10 transition-colors`}>
                    <div>
                      <h3 className="text-lg font-medium text-white">{item.title}</h3>
                      <p className="text-gray-500 mt-1 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Menú (with hunger banner) ─────────────────────── */}
      <div className="relative">
        {/* Banner sits right above the menu grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 -mb-16">
          <HungerBanner visible={isHungryHour && !isMonday} />
        </div>
        <Menu />
      </div>

      {/* ── Contacto ─────────────────────────────────────── */}
      <Contact />

      {/* ── FAQ ──────────────────────────────────────────── */}
      <FAQ />

      {/* ── CTA final ────────────────────────────────────── */}
      <section className="py-32 bg-sushi-red relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <div
          ref={ctaRef}
          className={`relative z-10 max-w-3xl mx-auto px-4 anim-scale-in ${ctaVisible ? 'in-view' : ''}`}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-white drop-shadow-xl">¿Listo para probar el mejor sushi?</h2>
          <a href="#menu">
            <Button variant="outline" className="bg-black text-white hover:bg-gray-900 border-none px-10 py-5 text-lg shadow-2xl">
              Hacer pedido
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
