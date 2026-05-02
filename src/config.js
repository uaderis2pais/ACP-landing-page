/**
 * config.js — White Label Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Archivo de configuración central para la marca.
 * Para adaptar esta app a un nuevo cliente, editá SOLO este archivo.
 *
 * Campos clave:
 *  - nombreDelNegocio  → aparece en navbar, footer, SEO, admin panel
 *  - whatsapp          → todos los botones de WhatsApp usan estos números
 *  - sucursales        → controla dropdowns del admin y gráficos del dashboard
 *  - colores.primario  → color de acento principal (botones, badges, glow)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const config = {
  // ── Identidad ────────────────────────────────────────────────────────────
  nombreDelNegocio: 'Sushinería App',
  eslogan: 'Sushi Premium',
  descripcion:
    'Restaurante asiático especializado en sushi fresco, con ingredientes de calidad y gran variedad de opciones. Nos dedicamos a perfeccionar cada bocado para brindarte una experiencia auténtica.',

  // ── URL del sitio ─────────────────────────────────────────────────────────
  url: 'https://mi-susheria.com.ar',

  // ── Contacto ──────────────────────────────────────────────────────────────
  telefono: '(344) 266-8753',
  telefonoHref: '5493442668753',

  whatsapp: {
    /** Número usado por los botones públicos (flotante, hero, contacto) */
    principal: '5493442668753',
    /** Números por sucursal usados en ventaService al cerrar una venta */
    sucursales: {
      'Sucursal A': '5493442668753',
      'Sucursal B': '5493442668753',
    },
  },

  // ── Dirección ─────────────────────────────────────────────────────────────
  direccion: {
    calle: 'Av. Principal 123',
    ciudad: 'Ciudad',
    provincia: 'Provincia',
    codigoPostal: '0000',
    pais: 'AR',
  },
  geo: {
    lat: -32.4858,
    lng: -58.2355,
  },

  /**
   * Google Maps embed URL. Reemplazá este valor con el iframe src de tu local:
   * https://www.google.com/maps → Compartir → Insertar mapa → copiar src
   * Si se deja en null, se muestra un placeholder visual.
   */
  googleMapsEmbedUrl: null,

  // ── Redes Sociales ────────────────────────────────────────────────────────
  redesSociales: {
    instagram: {
      url: 'https://www.instagram.com/',
      handle: '@mi_susheria',
    },
    tiktok: {
      url: 'https://www.tiktok.com/',
      handle: '@mi_susheria',
    },
  },

  // ── Horarios ──────────────────────────────────────────────────────────────
  horarios: {
    todos: { label: 'Todos los días', value: '19:30 - 00:30' },
  },

  // ── Sucursales (Admin) ────────────────────────────────────────────────────
  /**
   * Controla:
   *  - El dropdown de sucursal en PanelCarga
   *  - Los cards de totales y el pie chart en Dashboard
   * Máximo 3 sucursales para el diseño actual del dashboard.
   */
  sucursales: ['Sucursal A', 'Sucursal B'],

  // ── Colores ───────────────────────────────────────────────────────────────
  /**
   * Para cambiar el color de acento de toda la app, editá estos dos valores.
   * Usados en variables CSS y en clases Tailwind arbitrarias ([#hex]).
   */
  colores: {
    primario:      '#7C5228',   // Marrón oscuro cálido — cambiar aquí afecta toda la app
    primarioHover: '#5C3A1A',   // Marrón más oscuro (hover)
    primarioLight: '#A87A56',   // Marrón claro (acento suave)
  },

  // ── SEO ───────────────────────────────────────────────────────────────────
  seo: {
    keywords:
      'sushi, delivery sushi, restaurante japonés, rolls artesanales, sushi cerca de mí',
    priceRange: '$$',
    currenciesAccepted: 'ARS',
    paymentAccepted: 'Cash, Bank Transfer',
  },
};
