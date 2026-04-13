import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Clock, RefreshCw } from 'lucide-react';

export default function PedidosPendientes({ sucursalFija }) {
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendientes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ventas')
        .select('*')
        .eq('estado', 'pendiente');

      // Si el rol está limitado a una sucursal, solo traemos los pendientes de ella
      if (sucursalFija) {
        // Asumiendo que sucursalFija es "Concepción" o "Colón"
        query = query.ilike('sucursal', `%${sucursalFija}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPendientes(data || []);
    } catch (e) {
      console.error("Error buscando pendientes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, [sucursalFija]);

  const handleConfirm = async (id) => {
    if(!window.confirm('¿Confirmar pedido y sumarlo como venta completada?')) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from('ventas').update({ estado: 'completado' }).eq('id', id).select();
      
      // EL FILTRO MÁS IMPORTANTE PARA DETECTAR FALLA RLS (Cambiaron 0 filas pero sin tirar error)
      if (error) {
         throw new Error(error.message || JSON.stringify(error));
      }
      if (!data || data.length === 0) {
         throw new Error("Cero filas actualizadas en la Base de Datos.\nMotivo: Tienes bloqueado el permiso UPDATE en Supabase. No cumple las Políticas RLS de Seguridad.");
      }
      
      alert('✅ Pedido completado.');
      fetchPendientes(); // recargar
    } catch (e) {
      alert(`❌ ERROR EN BASE DE DATOS (Probable bloqueo RLS):\n\n${e.message}\n\n-> Ir al Panel de Supabase -> Authentication -> Policies -> Habilitar UPDATE para la tabla 'ventas'.`);
      console.error('Error detallado updatting:', e);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
      
       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
         <div>
            <p className="text-[10px] text-amber-500 font-black tracking-widest uppercase opacity-80">Recepción Inmediata</p>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Pedidos Web</h1>
         </div>
         <button onClick={fetchPendientes} disabled={loading} className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/20 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''}`} /> Actualizar
         </button>
       </div>

       {loading && pendientes.length === 0 ? (
          <div className="text-center py-10 text-emerald-500 animate-pulse font-bold">Cargando bandeja...</div>
       ) : pendientes.length === 0 ? (
          <div className="bg-[#0c130d]/80 border border-white/5 rounded-2xl p-16 flex flex-col items-center justify-center text-gray-500">
             <Clock size={48} className="mb-4 opacity-20" />
             <p className="font-bold tracking-widest uppercase text-sm">Bandeja limpia</p>
             <p className="text-xs mt-2 opacity-60">No hay pedidos pendientes de confirmación en este momento.</p>
          </div>
       ) : (
          <div className="bg-[#0c130d]/80 backdrop-blur-xl border border-amber-500/50 rounded-2xl p-6 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} className="text-amber-500" /> Pedidos Recibidos ({pendientes.length})
                </h4>
            </div>
            
            {/* Cards mode for Mobile, Table mode for Desktop */}
            <div className="grid grid-cols-1 md:hidden gap-4 mb-4">
               {pendientes.map((v) => (
                  <div key={v.id} className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-4 relative group">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{v.sucursal}</span>
                        <span className="text-xs text-amber-200">{new Date(v.fecha || v.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                     </div>
                     <p className="text-lg font-black text-amber-400 drop-shadow-sm mb-4">${parseFloat(v.monto_total || 0).toLocaleString()}</p>
                     
                     {/* Detalle de productos opcional */}
                     <div className="text-xs text-gray-400 mb-4 bg-black/30 p-2 rounded-lg">
                        {(typeof v.detalle_productos === 'string' ? JSON.parse(v.detalle_productos) : v.detalle_productos)?.map((p, idx) => (
                           <div key={idx} className="truncate">- {p.cantidad}x {p.nombre || p.name}</div>
                        ))}
                     </div>

                     <button
                        onClick={() => handleConfirm(v.id)}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-emerald-500 hover:to-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg transition-all"
                     >
                        Confirmar y Acreditar Pedido
                     </button>
                  </div>
               ))}
            </div>

            <div className="hidden md:block overflow-x-auto custom-scrollbar pb-2">
               <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
                  <thead className="text-[10px] uppercase bg-amber-900/20 text-amber-500/70 border-b border-amber-500/20 font-black tracking-widest">
                     <tr>
                        <th className="px-4 py-4 rounded-tl-xl">Fecha y Hora</th>
                        <th className="px-4 py-4">Detalle</th>
                        <th className="px-4 py-4">Sucursal</th>
                        <th className="px-4 py-4">Total</th>
                        <th className="px-4 py-4 text-right rounded-tr-xl">Acción</th>
                     </tr>
                  </thead>
                  <tbody>
                     {pendientes.map((v) => (
                        <tr key={v.id} className="border-b border-amber-500/10 hover:bg-amber-900/10 transition-colors group">
                           <td className="px-4 py-3 text-amber-100 group-hover:text-white transition-colors">{new Date(v.fecha || v.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                           <td className="px-4 py-3 text-[10px] text-gray-400 truncate max-w-[200px]">
                              {(typeof v.detalle_productos === 'string' ? JSON.parse(v.detalle_productos) : v.detalle_productos)?.map(p => `${p.cantidad}x ${p.nombre || p.name}`).join(', ')}
                           </td>
                           <td className="px-4 py-3 text-amber-100 group-hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">{v.sucursal}</td>
                           <td className="px-4 py-3 font-black text-amber-400 drop-shadow-sm">${parseFloat(v.monto_total || 0).toLocaleString()}</td>
                           <td className="px-4 py-3 text-right">
                              <button
                                 onClick={() => handleConfirm(v.id)}
                                 className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-emerald-500 hover:to-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg transition-all"
                              >
                                 Confirmar Pedido
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
       )}
    </div>
  );
}
