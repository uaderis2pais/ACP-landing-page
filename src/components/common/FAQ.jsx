import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import { config } from '../../config';

/* ─── FAQ Data — structured for voice search & SGE ──────────────────────── */
const FAQ_DATA = [
  {
    q: `¿Hacen envíos a domicilio en ${config.direccion.ciudad}?`,
    a: `Sí, hacemos delivery a toda la ciudad de ${config.direccion.ciudad}. Coordinás el envío directamente por WhatsApp al momento de hacer tu pedido.`,
  },
  {
    q: '¿A qué hora abren?',
    a: 'Abrimos de martes a domingo a partir de las 20:00. Los lunes estamos cerrados para descansar y preparar los mejores ingredientes del día siguiente.',
  },
  {
    q: '¿Hasta qué hora atienden los pedidos?',
    a: 'Atendemos de martes a domingo desde las 20:00 hasta las 00:30.',
  },
  {
    q: '¿Cómo se hace un pedido?',
    a: 'Es muy simple: elegís tus productos en el menú de esta página, los agregás al carrito y hacés click en "Realizar pedido". Se abre WhatsApp con tu pedido ya armado, solo completás tu nombre, dirección y forma de pago.',
  },
  {
    q: '¿Cuáles son las formas de pago?',
    a: 'Aceptamos transferencia bancaria y efectivo. Al pedir por WhatsApp te confirmamos los datos de la cuenta si elegís transferencia.',
  },
  {
    q: '¿Tienen opciones vegetarianas?',
    a: 'Sí, contamos con opciones vegetarianas como el Hot Veggie (rebozado con cheddar, palta y Philadelphia), Veggie Perú, Tropical Veggie y el Pink Maki con remolacha, palta y queso.',
  },
  {
    q: `¿Es el mejor sushi de ${config.direccion.ciudad}?`,
    a: 'Nos esforzamos cada día para que sí lo sea. Usamos ingredientes frescos, pescado de calidad y preparaciones artesanales. Nuestros clientes nos avalan — ¡probá y nos contás!',
  },
];

/* ─── Single accordion item ─────────────────────────────────────────────── */
function FAQItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-sushi-darkGray border border-white/10 rounded-2xl shadow-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-white/5 transition-colors group rounded-2xl"
      >
        <span className="font-bold text-white tracking-tight text-sm md:text-base pr-4 group-hover:text-brand-400 transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-brand-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Smooth expand/collapse */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-400 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-6 py-5 text-gray-400 text-sm leading-relaxed border-t border-white/10 bg-black/30 rounded-b-2xl">
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────────── */
export function FAQ() {
  const [headerRef, headerVisible] = useInView({ threshold: 0.2 });
  const [listRef, listVisible] = useInView({ threshold: 0.05 });

  return (
    <section id="faq" className="py-24 bg-sushi-black border-t border-white/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-14 anim-fade-up ${headerVisible ? 'in-view' : ''}`}
        >
          <span className="text-brand-400 text-sm tracking-[0.3em] font-bold uppercase">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-3 text-white drop-shadow-sm">
            Todo lo que necesitás saber
          </h2>
          <p className="text-gray-400 mt-4 text-sm leading-relaxed font-light">
            ¿No encontrás tu pregunta? Escribinos por WhatsApp, te respondemos al toque.
          </p>
        </div>

        {/* Accordion list — semantic for voice search */}
        <div
          ref={listRef}
          className={`space-y-3 anim-fade-up ${listVisible ? 'in-view' : ''}`}
        >
          {FAQ_DATA.map((item, i) => (
            <FAQItem
              key={i}
              index={i}
              question={item.q}
              answer={item.a}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
