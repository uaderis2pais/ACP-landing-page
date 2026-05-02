/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sushi: {
          black: '#0a0a0a',
          red: '#d91e18',
          white: '#f9f9f9',
          gold: '#d4af37',
          darkGray: '#1a1a1a',
        },
        /**
         * Color de marca — White Label
         * Para cambiar el acento de toda la app, editá config.js → colores.primario
         * y actualizá estos valores en espejo.
         * Paleta actual: Marrón cremoso oscuro (mocha/espresso)
         */
        brand: {
          50:      '#fdf6ee',
          100:     '#f5e3cc',
          200:     '#e8c49a',
          300:     '#d4a070',   // texto suave
          400:     '#c08550',   // acento claro (reemplaza emerald-400)
          500:     '#a87a56',   // acento medio (reemplaza emerald-500)
          600:     '#8b6340',   // más oscuro (reemplaza emerald-600)
          700:     '#7c5228',   // PRIMARY — color principal
          800:     '#5c3a1a',   // hover / dark (reemplaza emerald-800)
          900:     '#3a2210',   // fondos muy oscuros (reemplaza emerald-900)
          DEFAULT: '#7c5228',   // config.colores.primario
          dark:    '#5c3a1a',   // config.colores.primarioHover
          light:   '#a87a56',   // config.colores.primarioLight
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
