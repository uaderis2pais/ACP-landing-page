import React, { useState, useEffect } from 'react';
import Dashboard from '../components/admin/Dashboard';
import PanelCarga from '../components/admin/PanelCarga';
import { Navbar } from '../components/layout/Navbar';
import { LayoutDashboard, Store, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('panel'); // Default
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('vendedor');
  const [loadingUsr, setLoadingUsr] = useState(true);
  const navigate = useNavigate();

  const [sucursal, setSucursal] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      const currentUser = session.user;
      setUser(currentUser);

      // Obtener el perfil asociado desde la tabla "perfiles"
      // Se asume que la columna de referencia es "id" (mismo uuid que auth.users)
      const { data: profileData, error: profileError } = await supabase
        .from('perfiles')
        .select('rol, sucursal_asignada')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        console.error("Error al buscar perfil en Supabase:", profileError);
      }

      console.log("Perfil obtenido:", profileData);

      // Normalizamos a minúsculas por si escribieron "Admin" o "ADMIN"
      const userRole = (profileData?.rol || 'vendedor').toLowerCase().trim();

      setRole(userRole);
      
      // Si la sucursal asignada es 'todas', la pasamos como null para que no haya bloqueo
      const sucAsignada = profileData?.sucursal_asignada;
      if (sucAsignada && sucAsignada.toLowerCase() !== 'todas') {
         setSucursal(sucAsignada);
      } else {
         setSucursal(null);
      }

      if (userRole === 'admin') {
        setActiveTab('dashboard');
      }

      setLoadingUsr(false);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loadingUsr) {
    return <div className="min-h-screen bg-[#0a110a] flex items-center justify-center text-emerald-500 font-bold">Cargando ACP...</div>;
  }

  const isVendedor = role === 'vendedor';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a110a] text-white flex flex-col md:flex-row pb-16 md:pb-0 pt-[80px]">

        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-[#080d08]/80 backdrop-blur-2xl border-r border-white/5 p-6 shadow-[20px_0_30px_rgba(0,0,0,0.5)] z-40 relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-emerald-500 opacity-5 blur-[50px] pointer-events-none"></div>

          <div className="mb-10 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center border border-white/10">
                <span className="font-bold text-white tracking-widest">A</span>
              </div>
              <div>
                <h1 className="text-xs font-black text-gray-300 uppercase tracking-widest leading-tight">Agarrame</h1>
                <h1 className="text-xs font-black text-emerald-500 uppercase tracking-widest leading-tight">Como Puedas</h1>
              </div>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#1a2c20] overflow-hidden flex items-center justify-center text-xs border border-white/10">👨🏻‍💻</div>
                 <div>
                   <p className="text-xs font-bold text-white truncate max-w-[100px]" title={user?.email}>{user?.email?.split('@')[0] || 'Usuario'}</p>
                   <p className="text-[10px] text-emerald-400 font-semibold uppercase">{role}</p>
                 </div>
              </div>
              <button onClick={handleLogout} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/10" title="Salir">
                  <LogOut size={16}/>
              </button>
            </div>
          </div>

          <nav className="flex-1 space-y-3 relative z-10">
            <p className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-4 pl-2">Vistas Generales</p>
            <button
              onClick={() => !isVendedor && setActiveTab('dashboard')}
              disabled={isVendedor}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-emerald-600/20 to-transparent border border-emerald-500/20 text-emerald-400 font-bold shadow-[inset_4px_0_0_rgba(16,185,129,1)]'
                  : isVendedor
                    ? 'opacity-30 cursor-not-allowed text-gray-600 grayscale'
                    : 'border border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <LayoutDashboard size={18} className={`${activeTab === 'dashboard' ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : (!isVendedor && 'group-hover:scale-110 transition-transform')}`} />
              <span className="text-sm tracking-wide">Panel de Control</span>
            </button>

            <button
              onClick={() => setActiveTab('panel')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === 'panel' ? 'bg-gradient-to-r from-emerald-600/20 to-transparent border border-emerald-500/20 text-emerald-400 font-bold shadow-[inset_4px_0_0_rgba(16,185,129,1)]' : 'border border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Store size={18} className={`${activeTab === 'panel' ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="text-sm tracking-wide">Caja & Ventas</span>
            </button>
          </nav>

          {/* Eliminado el contenedor mt-auto de Salir original */}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {activeTab === 'dashboard' && !isVendedor && <Dashboard />}
          {activeTab === 'panel' && <PanelCarga sucursalFija={sucursal} rol={role} />}
        </main>

        {/* Bottom Nav Mobile */}
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#080d08]/90 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-around p-2 z-50 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
          <button
            onClick={() => !isVendedor && setActiveTab('dashboard')}
            disabled={isVendedor}
            className={`flex flex-col items-center justify-center flex-1 py-2.5 rounded-xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-gradient-to-t from-emerald-600/20 to-transparent text-emerald-400' : isVendedor ? 'opacity-30 cursor-not-allowed grayscale' : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] -translate-y-1 transition-transform' : ''} />
            <span className={`text-[10px] uppercase font-bold tracking-wider mt-1.5 ${activeTab === 'dashboard' ? '' : 'scale-90 opacity-50'}`}>Panel</span>
            {activeTab === 'dashboard' && <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1 animate-pulse"></div>}
          </button>
          <button
            onClick={() => setActiveTab('panel')}
            className={`flex flex-col items-center justify-center flex-1 py-2.5 rounded-xl transition-all duration-300 ${activeTab === 'panel' ? 'bg-gradient-to-t from-emerald-600/20 to-transparent text-emerald-400' : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            <Store size={20} className={activeTab === 'panel' ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] -translate-y-1 transition-transform' : ''} />
            <span className={`text-[10px] uppercase font-bold tracking-wider mt-1.5 ${activeTab === 'panel' ? '' : 'scale-90 opacity-50'}`}>Caja</span>
            {activeTab === 'panel' && <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1 animate-pulse"></div>}
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center flex-1 py-2.5 rounded-xl transition-all duration-300 text-gray-500 hover:text-red-400 opacity-60"
          >
            <LogOut size={18} />
          </button>
        </nav>

      </div>
    </>
  );
};
