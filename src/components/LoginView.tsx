import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS, ADMIN_CREDENTIALS } from '../data/initialData';
import { 
  KeyRound, 
  User as UserIcon, 
  ShieldCheck, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginViewProps {
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onNavigateToCatalog: () => void;
  onNavigateToDashboard: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onNavigateToCatalog,
  onNavigateToDashboard,
}) => {
  const [username, setUsername] = useState(ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState(ADMIN_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const inputUser = username.trim().toLowerCase();
    const inputPass = password.trim();

    // 1. STRICT ADMINISTRATOR CHECK:
    // Only allows login with email juanjosequinteroreyes8@gmail.com and password 573015137667
    if (inputUser === ADMIN_CREDENTIALS.email.toLowerCase()) {
      if (inputPass === ADMIN_CREDENTIALS.password) {
        const adminUser = INITIAL_USERS.find((u) => u.role === 'admin') || INITIAL_USERS[0];
        setSuccessAnimation(true);
        setTimeout(() => {
          onLogin(adminUser);
          setSuccessAnimation(false);
        }, 350);
        return;
      } else {
        setErrorMessage('Contraseña incorrecta para la cuenta de administrador.');
        return;
      }
    }

    // If an unauthorized user attempts to enter "admin" or other administrator alias
    if (inputUser === 'admin' || inputUser.includes('administrador')) {
      setErrorMessage(
        `Acceso de administrador no autorizado: Solo se permite el correo oficial ${ADMIN_CREDENTIALS.email} con su contraseña designada.`
      );
      return;
    }

    // 2. BUYER ACCOUNTS (Solo lectura y compras)
    if (inputUser === 'comprador' || inputUser === 'camila' || inputUser === 'cliente') {
      const buyerUser = INITIAL_USERS.find((u) => u.role === 'buyer') || INITIAL_USERS[1];
      setSuccessAnimation(true);
      setTimeout(() => {
        onLogin(buyerUser);
        setSuccessAnimation(false);
      }, 350);
      return;
    }

    // Other buyer users from initial list
    const found = INITIAL_USERS.find(
      (u) => (u.username.toLowerCase() === inputUser || u.email.toLowerCase() === inputUser) && u.role !== 'admin'
    );
    if (found) {
      setSuccessAnimation(true);
      setTimeout(() => {
        onLogin(found);
        setSuccessAnimation(false);
      }, 350);
      return;
    }

    // Custom buyer profile (cannot be admin)
    if (inputUser.length > 0) {
      const customBuyer: User = {
        id: `user-${Date.now()}`,
        username: inputUser,
        name: inputUser.split('@')[0].charAt(0).toUpperCase() + inputUser.split('@')[0].slice(1),
        email: inputUser.includes('@') ? inputUser : `${inputUser}@cliente.com`,
        role: 'buyer', // STRICT: non-admin credentials can only be buyers
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };
      setSuccessAnimation(true);
      setTimeout(() => {
        onLogin(customBuyer);
        setSuccessAnimation(false);
      }, 350);
    } else {
      setErrorMessage('Por favor ingresa un correo o usuario válido.');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    setErrorMessage('');
    if (role === 'admin') {
      setUsername(ADMIN_CREDENTIALS.email);
      setPassword(ADMIN_CREDENTIALS.password);
      const admin = INITIAL_USERS.find((u) => u.role === 'admin')!;
      onLogin(admin);
    } else {
      setUsername('comprador');
      setPassword('hilos123');
      const buyer = INITIAL_USERS.find((u) => u.role === 'buyer')!;
      onLogin(buyer);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* View Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block text-xs font-bold tracking-widest text-[#C05634] uppercase bg-[#FAF0E6] px-3 py-1 rounded-full border border-[#E9DAC8] mb-3">
          Control de Acceso Artesanal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#382B23]">
          Autenticación & Gestión de Perfiles
        </h1>
        <p className="mt-2 text-base text-[#6C594D]">
          Ingresa a la plataforma de <strong className="text-[#993C1D]">Hilos de Sol</strong>. 
          Selecciona tu rol para experimentar las vistas dinámicas con permisos diferenciados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Session */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Session Notification if logged in */}
          {currentUser && (
            <div className="bg-[#FAF4EC] border-2 border-[#DE9B27]/40 rounded-2xl p-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#DE9B27]/10 rounded-bl-full pointer-events-none" />
              <div className="flex items-start gap-4">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#DE9B27] shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6C594D]">
                      Sesión Activa
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        currentUser.role === 'admin'
                          ? 'bg-[#C05634] text-white'
                          : 'bg-[#DE9B27] text-[#2F2113]'
                      }`}
                    >
                      {currentUser.role === 'admin' ? 'Perfil Administrador' : 'Perfil Comprador'}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#382B23] mt-1">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs text-[#7B695D]">{currentUser.email}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={onNavigateToCatalog}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#C05634] hover:bg-[#993C1D] text-white transition-colors shadow-xs"
                    >
                      <span>Ir al Catálogo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={onNavigateToDashboard}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#DE9B27] hover:bg-[#B07714] text-[#2B1D0F] transition-colors shadow-xs"
                      >
                        <span>Ver Dashboard KPI</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={onLogout}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#7B695D] hover:text-[#993C1D] hover:bg-black/5 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Login Form Box */}
          <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E6D8] mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#382B23]">
                  Iniciar Sesión
                </h2>
                <p className="text-xs text-[#7B695D] mt-0.5">
                  Introduce tus credenciales para acceder a tu panel
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#F7EFE4] flex items-center justify-center text-[#C05634]">
                <KeyRound className="w-5 h-5" />
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1.5">
                  Correo Electrónico o Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A6E]">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="juanjosequinteroreyes8@gmail.com o comprador"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#DDD0BE] rounded-xl text-sm text-[#382B23] placeholder-[#A09284] focus:outline-none focus:ring-2 focus:ring-[#C05634] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A6E]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border border-[#DDD0BE] rounded-xl text-sm text-[#382B23] placeholder-[#A09284] focus:outline-none focus:ring-2 focus:ring-[#C05634] focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C7A6E] hover:text-[#382B23]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={successAnimation}
                className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#C05634] to-[#993C1D] hover:from-[#A84525] hover:to-[#823016] shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {successAnimation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Validando credenciales...</span>
                  </>
                ) : (
                  <>
                    <span>Acceder a la Tienda</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Switchers */}
            <div className="mt-8 pt-6 border-t border-[#F0E6D8]">
              <div className="text-center mb-3">
                <span className="text-xs font-semibold text-[#8C7A6E] tracking-wide">
                  ACCESO RÁPIDO PARA PRUEBAS (1 CLIC):
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-3 rounded-xl border-2 border-[#C05634]/30 bg-[#FBF3ED] hover:bg-[#F6E6DA] text-left transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#993C1D] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C05634]" />
                      Como Administrador
                    </span>
                    <span className="text-[10px] bg-[#C05634] text-white px-1.5 py-0.2 rounded font-medium">
                      Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6353] leading-snug">
                    <strong className="text-[#993C1D]">{ADMIN_CREDENTIALS.email}</strong>
                    <span className="block text-[10px] text-[#8C7A6E] mt-0.5">Clave: {ADMIN_CREDENTIALS.password}</span>
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('buyer')}
                  className="p-3 rounded-xl border-2 border-[#DE9B27]/40 bg-[#FDF9EE] hover:bg-[#F9F0DA] text-left transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#8C6212] flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#DE9B27]" />
                      Como Comprador
                    </span>
                    <span className="text-[10px] bg-[#DE9B27] text-[#2B1D0F] px-1.5 py-0.2 rounded font-bold">
                      Cliente
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6353] leading-snug">
                    <strong className="text-[#8C6212]">comprador</strong>
                    <span className="block text-[10px] text-[#8C7A6E] mt-0.5">Solo lectura & compras</span>
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Roles Matrix & Permissions Comparison */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#FAF7F2] border border-[#E3D6C1] rounded-2xl p-6 sm:p-7 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#382B23] mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#DE9B27]" />
              Esquema de Permisos por Rol
            </h3>
            <p className="text-xs text-[#6C594D] mb-6">
              El sistema de estado de <em>Hilos de Sol</em> adapta la interfaz según el perfil activo:
            </p>

            {/* Admin Profile Card */}
            <div className={`p-5 rounded-xl border-2 transition-all mb-4 ${
              currentUser?.role === 'admin'
                ? 'bg-white border-[#C05634] shadow-md ring-2 ring-[#C05634]/20'
                : 'bg-white/80 border-[#E5D7C3]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#C05634]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#382B23]">
                      Perfil Administrador
                    </h4>
                    <span className="text-xs text-[#993C1D] font-medium block">
                      Cuenta: {ADMIN_CREDENTIALS.email}
                    </span>
                  </div>
                </div>
                {currentUser?.role === 'admin' && (
                  <span className="text-[11px] font-bold bg-[#C05634] text-white px-2 py-0.5 rounded-full">
                    Activo Ahora
                  </span>
                )}
              </div>

              <ul className="space-y-2 text-xs text-[#524135]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C05634] shrink-0 mt-0.5" />
                  <span>
                    <strong>Cargar nuevo producto:</strong> Botón flotante y modal interactivo para dar de alta referencias con imágenes e inventario.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C05634] shrink-0 mt-0.5" />
                  <span>
                    <strong>Gestión de referencias:</strong> Botones superpuestos en cada tarjeta de producto para <em>Eliminar referencia</em> y <em>Cambiar imagen</em>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C05634] shrink-0 mt-0.5" />
                  <span>
                    <strong>Dashboard de Analítica e Inventario:</strong> Vista exclusiva con KPIs en tiempo real, gráficos de barras y líneas, historial de órdenes y exportación en PDF y Excel.
                  </span>
                </li>
              </ul>
            </div>

            {/* Buyer Profile Card */}
            <div className={`p-5 rounded-xl border-2 transition-all ${
              currentUser?.role === 'buyer'
                ? 'bg-white border-[#DE9B27] shadow-md ring-2 ring-[#DE9B27]/20'
                : 'bg-white/80 border-[#E5D7C3]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FCF6E9] flex items-center justify-center text-[#DE9B27]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#382B23]">
                      Perfil Comprador
                    </h4>
                    <span className="text-xs text-[#A07012] font-medium">
                      Solo Lectura y Compra
                    </span>
                  </div>
                </div>
                {currentUser?.role === 'buyer' && (
                  <span className="text-[11px] font-bold bg-[#DE9B27] text-[#2F2113] px-2 py-0.5 rounded-full">
                    Activo Ahora
                  </span>
                )}
              </div>

              <ul className="space-y-2 text-xs text-[#524135]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#DE9B27] shrink-0 mt-0.5" />
                  <span>
                    <strong>Exploración del catálogo:</strong> Visualiza fotografías de alta calidad, precios y descripciones de las piezas tejidas.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#DE9B27] shrink-0 mt-0.5" />
                  <span>
                    <strong>Simulación de compras:</strong> Añade referencias al carrito de compras, modifica cantidades y genera órdenes simuladas con recibo.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EADECE] text-[#8C7A6E] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span className="text-[#7E6E63]">
                    <strong>Sin privilegios de edición:</strong> No visualiza botones de borrado, cambio de imagen, creación de productos ni el dashboard confidencial de métricas.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Warm Artisan Note */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF0E6] to-[#FBF6ED] border border-[#ECDCCB] text-xs text-[#7A6455] flex items-center gap-3">
            <span className="text-2xl">🧶</span>
            <p>
              <em>Hilos de Sol</em> honra la tradición del crochet colombiano. Cada pieza es elaborada con hilos de algodón seleccionados, teñidos con pigmentos naturales y empacada con amor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
