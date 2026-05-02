import { openWhatsApp } from '../../utils/whatsappGuard';
import { config } from '../../config';

export function FloatingWhatsApp() {
  const handleClick = (e) => {
    e.preventDefault();
    openWhatsApp(`https://wa.me/${config.whatsapp.principal}`);
  };

  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 z-50 group hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
      aria-label="Contact us on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current transform group-hover:-rotate-6 transition-transform">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.12-.202-.089-.481-.19-.882-.365-1.701-.741-2.809-2.508-2.895-2.624-.085-.115-.688-.918-.688-1.752 0-.834.437-1.246.59-1.416.152-.17.329-.212.438-.212.11 0 .219.005.316.009.102.005.239-.039.364.263.129.311.439 1.07.477 1.15.038.081.064.175.02.269-.043.095-.065.155-.13.23-.065.075-.137.164-.194.225-.063.067-.13.138-.057.263.073.125.326.537.697.868.48.43.886.564 1.01.624.124.06.196.05.269-.035.073-.085.316-.364.403-.49.087-.124.174-.105.289-.064.114.04 1.701.802 1.993.949.292.146.486.22.557.342.072.123.072.715-.072 1.12z"/>
      </svg>
    </button>
  );
}
