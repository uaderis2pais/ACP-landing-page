import { useEffect } from 'react';
import { config } from '../../config';

/* ─────────────────────────────────────────────────────────────────────────
   SEO.jsx  —  Structured Data + Meta injection — White Label
   Todos los datos se leen desde src/config.js.
   ───────────────────────────────────────────────────────────────────────── */

// ── 1. Business data (leído desde config.js — source of truth) ─────────────
const BUSINESS = {
  name:          config.nombreDelNegocio,
  alternateName: `${config.nombreDelNegocio} Sushi`,
  description:   config.descripcion,
  url:           config.url,
  telephone:     config.telefono,
  servesCuisine: ['Sushi', 'Japanese', 'Asian Fusion'],
  priceRange:    config.seo.priceRange,
  currenciesAccepted: config.seo.currenciesAccepted,
  paymentAccepted:    config.seo.paymentAccepted,
  address: {
    streetAddress:   config.direccion.calle,
    addressLocality: config.direccion.ciudad,
    addressRegion:   config.direccion.provincia,
    postalCode:      config.direccion.codigoPostal,
    addressCountry:  config.direccion.pais,
  },
  geo: {
    latitude:  config.geo.lat,
    longitude: config.geo.lng,
  },
  openingHours: [
    // Martes a Jueves
    { dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday'], opens: '20:00', closes: '00:30' },
    // Viernes a Domingo
    { dayOfWeek: ['Friday', 'Saturday', 'Sunday'], opens: '20:00', closes: '00:30' },
    // Lunes: cerrado (omitido intencionalmente — ausencia = cerrado)
  ],
  sameAs: [
    config.redesSociales.instagram.url,
    config.redesSociales.tiktok.url,
  ],
  image: `${config.url}/favicon.svg`,
};

// ── 2. Menu highlights (add/remove as needed) ──────────────────────────────
const MENU_ITEMS = [
  { name: 'Crunch x 4u',          desc: 'Roll súper crocante relleno de salmón.',          price: 7000 },
  { name: 'Geishas x 5u',         desc: 'Opciones rellenas de palta o mango.',             price: 13500 },
  { name: 'Mango Roll x 4u',      desc: 'Salmón natural, queso y mango fresco.',           price: 7000 },
  { name: 'Dragon Salmón x 4u',   desc: 'Salmón natural con queso Philadelphia.',          price: 7000 },
  { name: 'Pink Maki x 4u',       desc: 'Arroz rosa con remolacha, palta y queso.',        price: 7800 },
  { name: 'Roll de Verano x 4u',  desc: 'Salmón natural marinado en lima.',                price: 8200 },
  { name: 'Hot Veggie x 4u',      desc: 'Rebozado con cheddar, palta y Philadelphia.',     price: 7000 },
  { name: 'Philadelphia Roll x 4u', desc: 'Salmón natural y palta decorado.',              price: 7000 },
];

// ── 3. JSON-LD builder ─────────────────────────────────────────────────────
function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // — FoodEstablishment entity ——————————————————————————————————————————
      {
        '@type': 'Restaurant',
        '@id': `${BUSINESS.url}/#restaurant`,
        name: BUSINESS.name,
        alternateName: BUSINESS.alternateName,
        description: BUSINESS.description,
        url: BUSINESS.url,
        telephone: BUSINESS.telephone,
        servesCuisine: BUSINESS.servesCuisine,
        priceRange: BUSINESS.priceRange,
        currenciesAccepted: BUSINESS.currenciesAccepted,
        paymentAccepted: BUSINESS.paymentAccepted,
        image: BUSINESS.image,
        sameAs: BUSINESS.sameAs,

        // NAP — Name Address Phone (crítico para Local SEO)
        address: {
          '@type': 'PostalAddress',
          streetAddress: BUSINESS.address.streetAddress,
          addressLocality: BUSINESS.address.addressLocality,
          addressRegion: BUSINESS.address.addressRegion,
          postalCode: BUSINESS.address.postalCode,
          addressCountry: BUSINESS.address.addressCountry,
        },

        // Coordenadas geográficas
        geo: {
          '@type': 'GeoCoordinates',
          latitude: BUSINESS.geo.latitude,
          longitude: BUSINESS.geo.longitude,
        },

        // Horarios detallados
        openingHoursSpecification: BUSINESS.openingHours.map(slot => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: slot.dayOfWeek.map(d => `https://schema.org/${d}`),
          opens: slot.opens,
          closes: slot.closes,
        })),

        // Menú enlazado
        hasMenu: `${BUSINESS.url}/#menu`,

        // Acepta reservas / pedidos
        acceptsReservations: false,
        potentialAction: {
          '@type': 'OrderAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `https://wa.me/${config.telefono}`,
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/MobileWebPlatform',
            ],
          },
          deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModePickUp'],
        },
      },

      // — Menu entity ————————————————————————————————————————————————————————
      {
        '@type': 'Menu',
        '@id': `${BUSINESS.url}/#menu`,
        name: `Menú de ${BUSINESS.name}`,
        description: 'Amplia variedad de rolls artesanales, geishas, makis y más.',
        url: `${BUSINESS.url}/#menu`,
        inLanguage: 'es-AR',
        hasMenuSection: [
          {
            '@type': 'MenuSection',
            name: 'Rolls & Combinaciones',
            hasMenuItem: MENU_ITEMS.map(item => ({
              '@type': 'MenuItem',
              name: item.name,
              description: item.desc,
              offers: {
                '@type': 'Offer',
                price: item.price,
                priceCurrency: 'ARS',
                availability: 'https://schema.org/InStock',
              },
            })),
          },
        ],
      },

      // — WebSite ————————————————————————————————————————————————————————————
      {
        '@type': 'WebSite',
        '@id': `${BUSINESS.url}/#website`,
        url: BUSINESS.url,
        name: BUSINESS.name,
        description: BUSINESS.description,
        inLanguage: 'es-AR',
        publisher: { '@id': `${BUSINESS.url}/#restaurant` },
      },
    ],
  };
}

// ── 4. Meta tags builder ────────────────────────────────────────────────
const META = {
  title:       `${config.nombreDelNegocio} | ${config.eslogan}`,
  description: config.descripcion,
  ogImage:     `${config.url}/favicon.svg`,
  canonical:   config.url,
  keywords:    config.seo.keywords,
};

// ── 5. Component ───────────────────────────────────────────────────────────
export function SEO() {
  useEffect(() => {
    // -- Title
    document.title = META.title;

    // -- Helper: upsert a <meta> tag by attribute key
    const setMeta = (attr, attrVal, content) => {
      let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // -- Helper: upsert a <link> tag
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Standard meta
    setMeta('name', 'description', META.description);
    setMeta('name', 'keywords', META.keywords);
    setMeta('name', 'robots', 'index, follow');
    setMeta('name', 'author', BUSINESS.name);

    // Open Graph (Facebook, WhatsApp previews)
    setMeta('property', 'og:type', 'restaurant');
    setMeta('property', 'og:url', META.canonical);
    setMeta('property', 'og:title', META.title);
    setMeta('property', 'og:description', META.description);
    setMeta('property', 'og:image', META.ogImage);
    setMeta('property', 'og:locale', 'es_AR');
    setMeta('property', 'og:site_name', BUSINESS.name);

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', META.title);
    setMeta('name', 'twitter:description', META.description);
    setMeta('name', 'twitter:image', META.ogImage);

    // Geo meta (local SEO boost)
    setMeta('name', 'geo.region', `${BUSINESS.address.addressCountry}-${BUSINESS.address.addressRegion.substring(0, 1)}`);
    setMeta('name', 'geo.placename', BUSINESS.address.addressLocality);
    setMeta('name', 'geo.position', `${BUSINESS.geo.latitude};${BUSINESS.geo.longitude}`);
    setMeta('name', 'ICBM', `${BUSINESS.geo.latitude}, ${BUSINESS.geo.longitude}`);

    // Canonical
    setLink('canonical', META.canonical);

    // -- JSON-LD injection
    const scriptId = 'seo-json-ld';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(buildJsonLd(), null, 2);

    // Cleanup on unmount
    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, []);

  // Renders nothing visible
  return null;
}
