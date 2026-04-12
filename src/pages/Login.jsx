import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // If success, go to home
      navigate('/');
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Credenciales incorrectas' : err.message);
      setCooldown(5); // 5 segundos de espera obligatoria al fallar
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a110a] flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md bg-[#080d08]/80 backdrop-blur-2xl border border-white/5 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-5 blur-[50px] pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center border border-white/10 mb-4">
            <span className="font-bold text-white text-2xl tracking-widest">A</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Acceso Restringido</h2>
          <p className="text-gray-400 text-sm mt-2">Ingresá tus credenciales de ACP</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
              placeholder="vendedor@acp.com"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className={`w-full font-black tracking-widest py-4 rounded-xl transition-all duration-300 mt-2 ${
              cooldown > 0 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-inner border border-white/5' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 disabled:from-[#1a2c20] disabled:to-[#1a2c20] disabled:text-gray-500 disabled:shadow-none text-white shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.5)]'
            }`}
          >
            {loading ? 'AUTENTICANDO...' : cooldown > 0 ? `ESPERE ${cooldown}S...` : 'INGRESAR AL SISTEMA'}
          </button>
        </form>
      </div>
    </div>
  );
}
