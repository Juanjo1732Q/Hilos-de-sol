import React from 'react';
import { Sparkles, ShoppingBag, ShieldCheck, UserCheck, Lock, SunMedium, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'auth' | 'catalog' | 'dashboard';
  setActiveTab: (tab: 'auth' | 'catalog' | 'dashboard') => void;
  currentUser: User | null;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  cartCount,
  onOpenCart,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DEC8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#DE9B27] via-[#C05634] to-[#993C1D] p-0.5 shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#FAF7F2] flex items-center justify-center">
                <SunMedium className="w-6 h-6 text-[#C05634]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#382B23]">
                  Hilos de Sol
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#DE9B27]" />
              </div>
              <p className="text-xs font-medium tracking-wider text-[#C05634] uppercase">
                Tejidos & Artesanías Hechas a Mano
              </p>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F1E8DC]/80 p-1.5 rounded-xl border border-[#E3D6C1]">
            <button
              onClick={() => setActiveTab('auth')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'auth'
                  ? 'bg-white text-[#993C1D] shadow-sm font-semibold'
                  : 'text-[#6C594D] hover:text-[#382B23] hover:bg-white/50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#C05634]" />
              <span>1. Autenticación & Roles</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-white text-[#993C1D] shadow-sm font-semibold'
                  : 'text-[#6C594D] hover:text-[#382B23] hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#DE9B27]" />
              <span>2. Catálogo de Productos</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#993C1D] shadow-sm font-semibold'
                  : 'text-[#6C594D] hover:text-[#382B23] hover:bg-white/50'
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-[#C05634]" />
              ) : (
                <Lock className="w-4 h-4 text-[#A8988B]" />
              )}
              <span>3. Dashboard & Analítica</span>
              {!isAdmin && (
                <span className="text-[10px] bg-[#E8DEC8] text-[#786659] px-1.5 py-0.5 rounded font-normal">
                  Admin
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Area: Role Status, Cart & User */}
          <div className="flex items-center gap-3">
            {/* Active User / Role Badge */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-3 py-1 pr-1.5 bg-[#F6EFE5] border border-[#E5D7C3] rounded-full">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#DE9B27]"
                />
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-semibold text-[#382B23] max-w-[110px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="flex items-center gap-1 font-medium text-[10px]">
                    {isAdmin ? (
                      <span className="text-[#C05634] font-bold">Admin</span>
                    ) : (
                      <span className="text-[#DE9B27] font-bold">Comprador</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Cerrar sesión o cambiar de perfil"
                  className="p-1 text-[#8C7A6E] hover:text-[#C05634] hover:bg-[#EAE0D1] rounded-full transition-colors ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="text-xs font-medium text-[#C05634] hover:underline px-2 py-1"
              >
                Iniciar sesión
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="Ver carrito de compras"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF2E6] hover:bg-[#F3E6D3] text-[#993C1D] border border-[#DE9B27]/40 shadow-xs transition-all hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5 text-[#C05634]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C05634] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-[#ECE0CE] overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'auth'
                ? 'bg-[#C05634] text-white'
                : 'text-[#6C594D] bg-[#F3EBDD]'
            }`}
          >
            1. Perfiles
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-[#C05634] text-white'
                : 'text-[#6C594D] bg-[#F3EBDD]'
            }`}
          >
            2. Catálogo
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'dashboard'
                ? 'bg-[#C05634] text-white'
                : 'text-[#6C594D] bg-[#F3EBDD]'
            }`}
          >
            <span>3. Dashboard</span>
            {!isAdmin && <Lock className="w-3 h-3 text-[#A8988B]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
