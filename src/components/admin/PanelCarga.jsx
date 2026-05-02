import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { registrarVenta } from '../../services/ventaService';
import { Store, Phone, MessageCircle, Plus, Minus, Trash2, ChevronDown } from 'lucide-react';
import { config } from '../../config';

export default function PanelCarga({ rol, sucursalFija }) {
   const [sucursal, setSucursal] = useState(sucursalFija || config.sucursales[0]);
   const [tipoPedido, setTipoPedido] = useState('Mostrador');
   const [cart, setCart] = useState([]);
   const [productos, setProductos] = useState([]);
   const [loading, setLoading] = useState(false);
   const [loadingData, setLoadingData] = useState(true);
   const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

   // Estado para el acordeón de categorías (podemos guardar qué categorías están abiertas)
   const [openCategories, setOpenCategories] = useState({});

   useEffect(() => {
      // Si la prop sucursalFija cambia (ej: los datos del auth llegaron tarde), actualizamos state
      if (sucursalFija) setSucursal(sucursalFija);
   }, [sucursalFija]);

   useEffect(() => {
      const fetchProductos = async () => {
         try {
            const { data, error } = await supabase
               .from('productos')
               .select('*');
            
            if (error) throw error;
            if (data) setProductos(data);
         } catch (error) {
            console.error("Error cargando productos:", error);
         } finally {
            setLoadingData(false);
         }
      };

      fetchProductos();
   }, []);

   // Agrupar productos por categoría
   const categories = productos.reduce((acc, product) => {
      const cat = product.categoria || 'Otros';
      if (!acc[cat]) {
         acc[cat] = [];
      }
      acc[cat].push(product);
      return acc;
   }, {});

   const toggleCategory = (cat) => {
      setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
   };


   const addToCart = (product) => {
      setCart(prev => {
         const existing = prev.find(item => item.id === product.id);
         if (existing) {
            return prev.map(item => item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item);
         }
         return [...prev, { ...product, cantidad: 1 }];
      });
   };

   const removeFromCart = (productId) => {
      setCart(prev => prev.filter(item => item.id !== productId));
   };

   const decreaseQuantity = (productId) => {
      setCart(prev => {
         const existing = prev.find(item => item.id === productId);
         if (existing.cantidad === 1) {
            return prev.filter(item => item.id !== productId);
         }
         return prev.map(item => item.id === productId ? { ...item, cantidad: item.cantidad - 1 } : item);
      });
   };

   const total = cart.reduce((sum, item) => sum + ((item.price || item.precio || 0) * item.cantidad), 0);

   const handleCheckout = async () => {
      if (cart.length === 0) return;
      // Lógica de Vendedor (carga manual local): estado = completado automáticamente
      if (rol === 'vendedor' || rol === 'admin') {
         await ejecutarVenta('completado');
      } else {
         // Usuario público: Doble paso para validación de WhatsApp
         setShowWhatsAppModal(true);
      }
   };

   const ejecutarVenta = async (estado) => {
      setLoading(true);

      const cartFormatd = cart.map(item => ({
         nombre: item.name || item.nombre,
         cantidad: item.cantidad,
         precio: item.price || item.precio || 0
      }));

      const nombreVendedor = rol ? `Usuario ${rol}` : 'Cliente Web';
      const success = await registrarVenta(cartFormatd, total, sucursal, nombreVendedor, estado);

      setLoading(false);
      if (success) {
         if (estado === 'pendiente') {
            alert("¡Pedido registrado exitosamente! Esperamos tu mensaje por WhatsApp.");
         } else {
            alert("¡Venta registrada y completada exitosamente!");
         }
         setShowWhatsAppModal(false);
         setCart([]);
      } else {
         alert("Hubo un error al guardar tu pedido. Reintentá.");
      }
   };

   return (
      <>
      <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-4 duration-500">

         {/* Columna Izquierda: Configuración y Catálogo */}
         <div className="flex-1 space-y-8">

            {/* Configuración */}
            <div className="bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
               <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                 <h2 className="font-black text-lg text-brand-400 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(124,82,40,0.5)]">Venta Rápida</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Sucursal de Origen</label>
                     <div className="relative group">
                       <select
                          value={sucursal}
                          onChange={e => setSucursal(e.target.value)}
                          disabled={rol === 'vendedor' && sucursalFija} // Bloqueo dinámico
                          className={`w-full border border-white/10 rounded-xl p-4 font-semibold focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 appearance-none transition-all ${rol === 'vendedor' && sucursalFija ? 'bg-black/60 text-gray-500 cursor-not-allowed opacity-70' : 'bg-black/40 text-white cursor-pointer group-hover:bg-black/60'}`}
                       >
                          {config.sucursales.map(s => (
                             <option key={s} value={s}>📍 {s}</option>
                          ))}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-500">▼</div>
                     </div>
                     {rol === 'vendedor' && sucursalFija && (
                        <p className="text-[10px] text-brand-500/70 mt-2 font-semibold">🔒 Bloqueado a tu sucursal asignada.</p>
                     )}
                  </div>

                  <div>
                     <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Formato</label>
                     <div className="grid grid-cols-3 gap-2">
                        <button
                           onClick={() => setTipoPedido('Mostrador')}
                           className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${tipoPedido === 'Mostrador' ? 'bg-gradient-to-br from-brand-600 to-brand-800 border-brand-500/50 text-white shadow-[0_0_15px_rgba(124,82,40,0.3)] scale-105' : 'bg-black/40 border-white/5 text-gray-500 hover:text-gray-300 hover:bg-black/60'}`}
                        >
                           <Store size={22} className={`mb-1.5 ${tipoPedido === 'Mostrador' ? 'drop-shadow-md' : ''}`} />
                           <span className="text-[9px] font-black tracking-wider">LOCAL</span>
                        </button>
                        <button
                           onClick={() => setTipoPedido('Teléfono')}
                           className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${tipoPedido === 'Teléfono' ? 'bg-gradient-to-br from-brand-600 to-brand-800 border-brand-500/50 text-white shadow-[0_0_15px_rgba(124,82,40,0.3)] scale-105' : 'bg-black/40 border-white/5 text-gray-500 hover:text-gray-300 hover:bg-black/60'}`}
                        >
                           <Phone size={22} className={`mb-1.5 ${tipoPedido === 'Teléfono' ? 'drop-shadow-md' : ''}`} />
                           <span className="text-[9px] font-black tracking-wider">TEL</span>
                        </button>
                        <button
                           onClick={() => setTipoPedido('WhatsApp')}
                           className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${tipoPedido === 'WhatsApp' ? 'bg-gradient-to-br from-brand-600 to-brand-800 border-brand-500/50 text-white shadow-[0_0_15px_rgba(124,82,40,0.3)] scale-105' : 'bg-black/40 border-white/5 text-gray-500 hover:text-gray-300 hover:bg-black/60'}`}
                        >
                           <MessageCircle size={22} className={`mb-1.5 ${tipoPedido === 'WhatsApp' ? 'drop-shadow-md' : ''}`} />
                           <span className="text-[9px] font-black tracking-wider">WSP</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Catálogo Dinámico */}
            <div className="bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
               <h3 className="text-xs font-black text-gray-400 uppercase mb-5 tracking-widest block">Menú Disponible</h3>
               
               {loadingData ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50 animate-pulse text-brand-500">
                     <span className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mb-3"></span>
                     <p className="text-xs font-black tracking-widest">CARGANDO CATÁLOGO...</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {Object.keys(categories).map(catName => {
                        const isOpen = openCategories[catName] === true; // Cerrado por defecto
                        return (
                           <div key={catName} className="border border-white/5 rounded-xl overflow-hidden shadow-inner bg-black/20 transition-all duration-300">
                              <button 
                                 onClick={() => toggleCategory(catName)}
                                 className="w-full bg-gradient-to-r from-[#0f2c1f] to-transparent p-4 flex justify-between items-center text-brand-400 font-bold uppercase text-sm tracking-wider border-b border-white/5 hover:bg-white/5 transition-colors"
                              >
                                 <span>{catName}</span>
                                 <ChevronDown size={18} className={`transition-transform duration-300 text-brand-500 ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {isOpen && (
                                 <div className="divide-y divide-white/5 animate-in slide-in-from-top-2 fade-in duration-300">
                                    {categories[catName].map(product => (
                                       <div key={product.id} className="p-3 md:p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors group">
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-white/10 group-hover:border-brand-500/30 transition-colors">
                                                {(product.image || product.imagen_url) && <img src={product.image || product.imagen_url} alt={product.name || product.nombre} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />}
                                             </div>
                                             <div>
                                                <p className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{product.name || product.nombre}</p>
                                                <p className="text-xs font-semibold text-brand-500/80 drop-shadow-sm">${(product.price || product.precio || 0).toLocaleString()}</p>
                                             </div>
                                          </div>
                                          <button
                                             onClick={() => addToCart(product)}
                                             className="w-10 h-10 rounded-full bg-black/40 border border-white/5 group-hover:border-brand-500/50 hover:bg-gradient-to-br hover:from-brand-500 hover:to-brand-700 hover:shadow-[0_0_15px_rgba(124,82,40,0.4)] text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300"
                                          >
                                             <Plus size={18} />
                                          </button>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               )}
            </div>

         </div>

         {/* Columna Derecha: Resumen */}
         <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="bg-[#0c130d]/90 backdrop-blur-2xl border border-brand-500/10 rounded-2xl flex flex-col h-full sticky top-28 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
               <div className="p-5 border-b border-white/5 bg-gradient-to-b from-brand-900/10 to-transparent">
                  <h3 className="font-black text-lg text-brand-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(124,82,40,0.3)]">Resumen</h3>
               </div>

               <div className="flex-1 p-5 overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-300px)] custom-scrollbar">
                  {cart.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-brand-900/30 py-16 animate-pulse">
                        <Store size={64} className="mb-4" />
                        <p className="text-sm font-bold tracking-widest uppercase">TICKET VACÍO</p>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        {cart.map(item => (
                           <div key={item.id} className="flex flex-col gap-3 p-3 bg-black/20 border border-white/5 rounded-xl animate-in slide-in-from-left-2 duration-200">
                              <div className="flex justify-between font-bold text-gray-200">
                                 <span className="truncate pr-2">{item.name || item.nombre}</span>
                                 <span className="text-brand-400 shrink-0">${((item.price || item.precio || 0) * item.cantidad).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                 <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">${item.price || item.precio || 0} c/u</span>
                                 <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-full px-2 py-1 shadow-inner">
                                    <button onClick={() => decreaseQuantity(item.id)} className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><Minus size={12} /></button>
                                    <span className="font-black text-xs w-5 text-center">{item.cantidad}</span>
                                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center rounded-full text-brand-400 hover:text-white hover:bg-brand-500/20 transition-colors"><Plus size={12} /></button>
                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center rounded-full text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={12} /></button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               <div className="p-6 bg-black/40 border-t border-brand-500/10 mt-auto relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 opacity-5 blur-[50px] pointer-events-none"></div>
                  <div className="flex justify-between items-end mb-6 relative z-10">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Factura</span>
                     <span className="text-4xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(124,82,40,0.3)]">${total.toLocaleString()}</span>
                  </div>
                  <button
                     onClick={handleCheckout}
                     disabled={cart.length === 0 || loading}
                     className="w-full bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 disabled:from-[#1a2c20] disabled:to-[#1a2c20] disabled:text-gray-500 disabled:shadow-none text-white font-black tracking-widest py-4 rounded-xl shadow-[0_10px_20px_rgba(124,82,40,0.3)] hover:shadow-[0_10px_30px_rgba(124,82,40,0.5)] transition-all duration-300 flex items-center justify-center gap-3 relative z-10 group"
                  >
                     {loading ? 'Sincronizando...' : (
                       <>
                         <span className="group-hover:scale-105 transition-transform">REGISTRAR PAGO</span>
                         <Store size={18} className="opacity-80 group-hover:translate-x-1 transition-transform" />
                       </>
                     )}
                  </button>
               </div>
            </div>
         </div>

      </div>

      {/* MODAL DE DOBLE PASO */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <div className="bg-[#0c130d] border border-brand-500/30 rounded-2xl p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(124,82,40,0.2)] animate-in zoom-in-95 duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 opacity-10 blur-[50px] pointer-events-none"></div>
              
              <div className="flex justify-center mb-4">
                 <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                    <MessageCircle size={32} className="text-brand-400" />
                 </div>
              </div>
              
              <h3 className="text-xl font-black text-white mb-3 text-center uppercase tracking-widest drop-shadow-[0_0_5px_rgba(124,82,40,0.5)]">¡Tu pedido está casi listo!</h3>
              <p className="text-gray-400 text-center text-sm mb-8 leading-relaxed">
                 Para que empecemos a prepararlo, <strong className="text-brand-400 font-bold block mt-1">confirmá el envío por WhatsApp</strong>.
              </p>
              
              <div className="flex flex-col gap-3 relative z-10">
                 <button 
                    onClick={() => ejecutarVenta('pendiente')} 
                    disabled={loading} 
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white font-black tracking-widest text-sm shadow-[0_0_15px_rgba(124,82,40,0.4)] transition-all flex items-center justify-center gap-2"
                 >
                    {loading ? 'CARGANDO...' : 'CONFIRMAR POR WHATSAPP'}
                 </button>
                 <button 
                    onClick={() => setShowWhatsAppModal(false)} 
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-transparent border border-white/10 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                 >
                    Volver a la tienda
                 </button>
              </div>
           </div>
        </div>
      )}
      </>
   );
}
