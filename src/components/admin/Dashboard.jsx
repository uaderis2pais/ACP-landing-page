import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Clock, MapPin, Hash, Package } from 'lucide-react';

const COLORS = ['#10b981', '#34d399', '#059669'];

export default function Dashboard() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Totales y Gráficos
  const [totales, setTotales] = useState({ global: 0, concepcion: 0, colon: 0 });
  const [hourlyData, setHourlyData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [sucursalData, setSucursalData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [timeRange, setTimeRange] = useState('semana');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchVentas();
  }, [timeRange]);

  const fetchVentas = async () => {
    try {
      setPage(1);
      setLoading(true);
      // Rango de fechas dinámico
      const targetDate = new Date();
      if (timeRange === 'dia') {
        targetDate.setDate(targetDate.getDate() - 1);
      } else if (timeRange === 'mes') {
        targetDate.setMonth(targetDate.getMonth() - 1);
      } else {
        targetDate.setDate(targetDate.getDate() - 7);
      }

      const { data, error } = await supabase
        .from('ventas')
        .select('*')
        .gte('fecha', targetDate.toISOString()); // O asumiendo que usan 'fecha' y es un ISO string

      if (error) throw error;
      
      const v = data || [];
      setVentas(v);
      
      let gl = 0, cc = 0, cl = 0;
      const hMap = {};
      const dMap = {
        0: { name: 'Domingo', val: 0 }, 1: { name: 'Lunes', val: 0 }, 
        2: { name: 'Martes', val: 0 }, 3: { name: 'Miércoles', val: 0 }, 
        4: { name: 'Jueves', val: 0 }, 5: { name: 'Viernes', val: 0 }, 
        6: { name: 'Sábado', val: 0 }
      };      // Canales
      const chanMap = {};

      v.forEach(item => {
        const monto = parseFloat(item.monto_total || 0);
        const itemDate = new Date(item.fecha || item.created_at); // fallback a created_at
        
        gl += monto;
        
        const suc = (item.sucursal || '').toLowerCase();
        if (suc.includes('concepcion') || suc.includes('concepción')) cc += monto;
        if (suc.includes('colon') || suc.includes('colón')) cl += monto;

        // Horas
        const hour = itemDate.getHours();
        hMap[hour] = (hMap[hour] || 0) + monto;

        // Día de semana
        const dayIndex = itemDate.getDay();
        if (dMap[dayIndex]) {
           dMap[dayIndex].val += monto;
        }

        // Canales
        const canalName = item.canal || 'Otro';
        chanMap[canalName] = (chanMap[canalName] || 0) + monto;
      });
      
      setTotales({ global: gl, concepcion: cc, colon: cl });

      // Formatear Datos para Gráficos
      const horasFijas = [12,13,14,15,16,17,18,19,20,21,22,23,0,1,2];
      const parsedHourly = horasFijas.map(h => ({ name: `${h}HS`, val: hMap[h] || 0 }));
      
      setHourlyData(parsedHourly);

      // Líneas: ordenamos los días de Lunes a Domingo
      const parsedWeek = [1, 2, 3, 4, 5, 6, 0].map(idx => dMap[idx]);
      setWeekData(parsedWeek);

      // Torta: Sucursales
      const pieD = [
        { name: 'Concepción', value: cc },
        { name: 'Colón', value: cl }
      ].filter(d => d.value > 0);
      setSucursalData(pieD.length > 0 ? pieD : [{ name: 'Vacio', value: 1 }]);

      // Torta: Canales
      const pieChan = Object.entries(chanMap)
        .map(([name, value]) => ({ name, value }))
        .filter(d => d.value > 0);
      setChannelData(pieChan.length > 0 ? pieChan : [{ name: 'Vacio', value: 1 }]);

      // Top Productos Reales
      const prodMap = {};
      v.forEach(item => {
         try {
            if (item.detalle_productos) {
               const items = typeof item.detalle_productos === 'string' 
                   ? JSON.parse(item.detalle_productos) 
                   : item.detalle_productos;
               
               if (Array.isArray(items)) {
                   items.forEach(prod => {
                      const name = prod.nombre || prod.name;
                      const qty = parseInt(prod.cantidad || 0);
                      if (name && qty) {
                         prodMap[name] = (prodMap[name] || 0) + qty;
                      }
                   });
               }
            }
         } catch (e) {
            console.error("Error parseando producto", e);
         }
      });
      
      const topProductsD = Object.entries(prodMap)
         .map(([name, qty]) => ({ name, qty }))
         .sort((a,b) => b.qty - a.qty)
         .slice(0, 3);
         
      const maxProd = topProductsD.length > 0 ? topProductsD[0].qty : 1;
      setTopProducts(topProductsD.map(p => ({ ...p, max: maxProd })));

    } catch (err) {
      console.error("Error trayendo ventas: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular el porcentaje total general
  const pieTotal = sucursalData.reduce((acc, curr) => acc + curr.value, 0);
  const pieChanTotal = channelData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
        <div className="flex items-center justify-between md:justify-start gap-4">
           <div>
              <p className="text-[10px] text-emerald-400 font-black tracking-widest uppercase opacity-80">Administración ACP</p>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Panel de Control</h1>
           </div>
           <div className="md:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900/50 to-black border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center">
              🍣
           </div>
        </div>
        
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10 w-full md:w-auto overflow-hidden">
           {['dia', 'semana', 'mes'].map(t => (
              <button 
                 key={t}
                 onClick={() => setTimeRange(t)}
                 disabled={loading}
                 className={`flex-1 md:flex-none px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${timeRange === t ? 'bg-gradient-to-r from-emerald-600/30 to-emerald-800/30 text-emerald-400 shadow-inner' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 disabled:opacity-50'}`}
              >
                 {t === 'dia' ? 'Hoy' : t === 'semana' ? 'Semana' : 'Mes'}
              </button>
           ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50 animate-pulse text-emerald-500">
           <span className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3"></span>
           <p className="text-xs font-black tracking-widest">Sincronizando Ventas...</p>
        </div>
      ) : (
      <>
        {/* Totales Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] col-span-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-3 opacity-90">Ventas 7 Días</p>
            <div className="flex items-center justify-between relative z-10">
              <h2 className="text-4xl font-extrabold tracking-tight">${totales.global.toLocaleString()}</h2>
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner shadow-white/30">
                <DollarSign className="text-white drop-shadow-md" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 rounded-2xl p-6 flex flex-col justify-center shadow-lg group">
              <p className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-3 uppercase tracking-wider">
                <MapPin size={14} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"/> CONCEPCIÓN
              </p>
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">${totales.concepcion.toLocaleString()}</h3>
              <div className="h-1.5 bg-black mt-4 rounded-full overflow-hidden shadow-inner w-full">
                 <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{width: `${totales.global ? (totales.concepcion/totales.global)*100 : 0}%`}}></div>
              </div>
          </div>

          <div className="bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 rounded-2xl p-6 flex flex-col justify-center shadow-lg group">
              <p className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-3 uppercase tracking-wider">
                <MapPin size={14} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"/> COLÓN
              </p>
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">${totales.colon.toLocaleString()}</h3>
              <div className="h-1.5 bg-black mt-4 rounded-full overflow-hidden shadow-inner w-full">
                 <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" style={{width: `${totales.global ? (totales.colon/totales.global)*100 : 0}%`}}></div>
              </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* Ventas por hora */}
          <div className="bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-lg">
             <div className="flex justify-between items-center mb-8">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Clock size={16} className="text-emerald-500" /> Ventas por Hora
                </h4>
             </div>
             
             <div className="h-56 w-full">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={hourlyData} margin={{top: 0, right: 0, bottom: 0, left: 0}}>
                     <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor: 'rgba(10,17,10,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'}} itemStyle={{color: '#fff', fontWeight: 'bold'}} labelStyle={{color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px'}} formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']} />
                     <Bar dataKey="val" fill="url(#colorHourly)" radius={[4, 4, 0, 0]} maxBarSize={28} barSize={20} />
                     <defs>
                       <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                         <stop offset="100%" stopColor="#047857" stopOpacity={0.8}/>
                       </linearGradient>
                     </defs>
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11, fontWeight: 600}} dy={15} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Tendencia */}
          <div className="bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-lg">
             <div className="flex justify-between items-center mb-8">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp size={16} className="text-emerald-500" /> Tendencia Activa
                </h4>
             </div>
             <div className="h-56 w-full">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                 <LineChart data={weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorWeek" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Tooltip contentStyle={{backgroundColor: 'rgba(10,17,10,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px'}} itemStyle={{color: '#fff', fontWeight: 'bold'}} labelStyle={{color: '#9ca3af', fontSize: '12px'}} formatter={(value) => [`$${value.toLocaleString()}`, 'Total']} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11, fontWeight: 600}} dy={15} />
                   <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={4} dot={{r: 5, fill: '#0a110a', stroke: '#10b981', strokeWidth: 3}} activeDot={{r: 8, fill: '#10b981', stroke: '#fff', strokeWidth: 2}} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>

        </div>

        {/* Detalles e indicadores (3 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
           {/* Distribución de la Sucursal */}
           <div className="col-span-1 lg:col-span-1 bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row lg:flex-col items-center justify-between shadow-lg">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 w-full mb-6">
                 <Hash size={16} className="text-emerald-500" /> Rendimiento
               </h4>
               <div className="flex lg:flex-col items-center justify-center gap-6 w-full h-full">
                  <div className="w-28 h-28 relative shrink-0 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie data={sucursalData} innerRadius={28} outerRadius={48} dataKey="value" stroke="none" cornerRadius={4} paddingAngle={2}>
                           {sucursalData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-[9px] font-black tracking-widest text-emerald-400 mb-0.5">MAYOR</span>
                       <span className="text-[10px] font-black text-white">{sucursalData.length > 0 && pieTotal > 0 ? Math.round((Math.max(...sucursalData.map(d => d.value)) / pieTotal) * 100) + '%' : '-'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3 w-full max-w-[150px]">
                     {sucursalData.map((d, i) => (
                       <div key={i} className="flex items-center justify-between text-xs font-medium">
                          <span className="flex items-center gap-3 text-gray-300">
                             <span className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{backgroundColor: COLORS[i]}}></span>
                             {d.name === 'Vacio' ? 'Sin datos' : d.name}
                          </span>
                          <span className="font-bold text-white">{pieTotal > 0 ? Math.round((d.value / pieTotal) * 100) : 0}%</span>
                       </div>
                     ))}
                  </div>
               </div>
           </div>

           {/* Top Productos mock */}
           <div className="col-span-1 lg:col-span-1 bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
               <div className="flex justify-between items-center mb-6">
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <Package size={16} className="text-emerald-500" /> Top Productos
                   </h4>
               </div>
               <div className="space-y-5 flex-1 relative">
                   {topProducts.length === 0 ? (
                      <p className="text-xs text-gray-500 italic text-center w-full mt-4">Sin datos de productos agrupados</p>
                   ) : (
                      topProducts.map((p, i) => (
                        <div key={i} className="group">
                           <div className="flex justify-between text-xs mb-2">
                              <span className="font-semibold text-gray-300 group-hover:text-white transition-colors truncate pr-2 max-w-[150px]">{i+1}. {p.name}</span>
                              <span className="text-emerald-400 font-black">{p.qty} uds</span>
                           </div>
                           <div className="h-1.5 bg-black rounded-full overflow-hidden shadow-inner flex-shrink-0">
                              <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:opacity-80 transition-opacity" style={{width: `${(p.qty/p.max)*100}%`}}></div>
                           </div>
                        </div>
                      ))
                   )}
               </div>
           </div>

           {/* Canales (Pie) */}
           <div className="col-span-1 lg:col-span-1 bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row lg:flex-col items-center justify-between shadow-lg">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 w-full mb-6">
                 <Hash size={16} className="text-emerald-500" /> Canales
               </h4>
               <div className="flex lg:flex-col items-center justify-center gap-6 w-full h-full">
                  <div className="w-28 h-28 relative shrink-0 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie data={channelData} innerRadius={28} outerRadius={48} dataKey="value" stroke="none" cornerRadius={4} paddingAngle={2}>
                           {channelData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-[9px] font-black tracking-widest text-emerald-400 mb-0.5">MAYOR</span>
                       <span className="text-[10px] font-black text-white">{channelData.length > 0 && pieChanTotal > 0 ? Math.round((Math.max(...channelData.map(d => d.value)) / pieChanTotal) * 100) + '%' : '-'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3 w-full max-w-[150px]">
                     {channelData.map((d, i) => (
                       <div key={i} className="flex items-center justify-between text-xs font-medium">
                          <span className="flex items-center gap-3 text-gray-300">
                             <span className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{backgroundColor: COLORS[i]}}></span>
                             {d.name === 'Vacio' ? 'Sin datos' : d.name}
                          </span>
                          <span className="font-bold text-white">{pieChanTotal > 0 ? Math.round((d.value / pieChanTotal) * 100) : 0}%</span>
                       </div>
                     ))}
                  </div>
               </div>
           </div>
        </div>

        {/* Tabla Operaciones Recientes Full Width */}
        <div className="bg-[#0c130d]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-lg mt-6">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} className="text-emerald-500" /> Registro Expandido de Operaciones
                </h4>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar pb-2">
               <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
                  <thead className="text-[10px] uppercase bg-black/40 text-gray-500 border-b border-white/10 font-black tracking-widest">
                     <tr>
                        <th className="px-4 py-4 rounded-tl-xl">Fecha y Hora</th>
                        <th className="px-4 py-4">Sucursal</th>
                        <th className="px-4 py-4">Vendedor</th>
                        <th className="px-4 py-4">Canal</th>
                        <th className="px-4 py-4">Medio</th>
                        <th className="px-4 py-4 text-right rounded-tr-xl">Monto</th>
                     </tr>
                  </thead>
                  <tbody>
                     {ventas.length === 0 ? (
                        <tr>
                           <td colSpan="6" className="text-center py-8 text-gray-500 italic">No hay registros de ventas recientes.</td>
                        </tr>
                     ) : (() => {
                        const sortedVentas = [...ventas].sort((a,b) => new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha));
                        const recentPerPage = 10;
                        const totalPages = Math.ceil(sortedVentas.length / recentPerPage) || 1;
                        const paginatedVentas = sortedVentas.slice((page - 1) * recentPerPage, page * recentPerPage);

                        return (
                           <>
                              {paginatedVentas.map((v) => (
                                 <tr key={v.id || Math.random()} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="px-4 py-3 text-gray-300 group-hover:text-white transition-colors">{new Date(v.fecha || v.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                                    <td className="px-4 py-3 text-gray-300 group-hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">{v.sucursal}</td>
                                    <td className="px-4 py-3 text-gray-300 group-hover:text-white transition-colors">{v.vendedor_nombre}</td>
                                    <td className="px-4 py-3 text-gray-300 group-hover:text-white transition-colors">{v.canal || '-'}</td>
                                    <td className="px-4 py-3 text-gray-300 group-hover:text-white transition-colors">{v.metodo_pago || '-'}</td>
                                    <td className="px-4 py-3 text-right font-black text-emerald-400 drop-shadow-sm">${parseFloat(v.monto_total || 0).toLocaleString()}</td>
                                 </tr>
                              ))}
                              {totalPages > 1 && (
                                 <tr>
                                    <td colSpan="6" className="p-4 border-t border-white/5">
                                       <div className="flex items-center justify-between">
                                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Página {page} de {totalPages}</p>
                                          <div className="flex gap-2">
                                             <button 
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-emerald-500/50 disabled:opacity-30 disabled:hover:border-white/10 transition-all"
                                             >Anterior</button>
                                             <button 
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-emerald-500/50 disabled:opacity-30 disabled:hover:border-white/10 transition-all"
                                             >Siguiente</button>
                                          </div>
                                       </div>
                                    </td>
                                 </tr>
                              )}
                           </>
                        );
                     })()}
                  </tbody>
               </table>
            </div>
        </div>

      </>
      )}
    </div>
  );
}
