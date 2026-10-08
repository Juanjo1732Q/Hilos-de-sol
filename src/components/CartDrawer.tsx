import React, { useState } from 'react';
import { CartItem, User } from '../types';
import { formatCurrency } from '../utils/formatters';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (buyerName: string, buyerEmail: string, paymentMethod: 'PSE' | 'Tarjeta de Crédito' | 'Transferencia') => void;
  currentUser: User | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'PSE' | 'Tarjeta de Crédito' | 'Transferencia'>('PSE');
  const [buyerName, setBuyerName] = useState(currentUser?.name || 'Cliente Artesanal');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || 'cliente@hilosdesol.com');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSimulatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      onCheckout(
        buyerName.trim() || 'Comprador Hilos de Sol',
        buyerEmail.trim() || 'cliente@hilosdesol.com',
        paymentMethod
      );
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-l border-[#E5D7C3] animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8DEC8] flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#C05634] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#382B23]">
                Carrito de Compras
              </h2>
              <p className="text-xs text-[#7B695D]">
                {totalItems} {totalItems === 1 ? 'artículo artesanal' : 'artículos artesanales'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8C7A6E] hover:text-[#382B23] hover:bg-[#EAE0D1] rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#DE9B27] mb-4">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#382B23] mb-1">
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-[#7B695D] max-w-xs mx-auto mb-6">
                Descubre en nuestro catálogo los frascos decorados, amigurumis y llaveros hechos con amor.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#C05634] hover:bg-[#993C1D] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Product Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-white rounded-xl border border-[#E8DEC8] flex items-center gap-3 shadow-xs"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-lg object-cover border border-[#EADBCE] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-[#DE9B27] uppercase tracking-wider">
                        {item.product.referenceCode}
                      </div>
                      <h4 className="text-xs font-bold text-[#382B23] truncate">
                        {item.product.title}
                      </h4>
                      <div className="text-xs font-semibold text-[#993C1D] mt-0.5">
                        {formatCurrency(item.product.price)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-[#DDD0BE] rounded-lg bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-[#6C594D] hover:text-[#993C1D] hover:bg-black/5 rounded-l-lg transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#382B23]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-[#6C594D] hover:text-[#993C1D] hover:bg-black/5 rounded-r-lg transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 text-[#A08E80] hover:text-red-600 transition"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right text-xs font-bold text-[#382B23] shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout simulation details */}
              <div className="pt-4 border-t border-[#E8DEC8]">
                <h4 className="font-serif font-bold text-sm text-[#382B23] mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#DE9B27]" />
                  Datos de Facturación Simulada
                </h4>

                <form id="checkout-form" onSubmit={handleSimulatePurchase} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6C594D] mb-1">
                      Nombre del Comprador
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-1 focus:ring-[#C05634]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6C594D] mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-1 focus:ring-[#C05634]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6C594D] mb-1">
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['PSE', 'Tarjeta de Crédito', 'Transferencia'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition ${
                            paymentMethod === method
                              ? 'bg-[#C05634] text-white border-[#C05634]'
                              : 'bg-white text-[#5A493D] border-[#DDD0BE] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {method === 'Tarjeta de Crédito' ? 'Tarjeta' : method}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E8DEC8] space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#7B695D]">
                <span>Subtotal de piezas</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#7B695D]">
                <span>Envío artesanal (Gratis por compra)</span>
                <span className="text-[#15803D] font-medium">Gratis</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#382B23] pt-2 border-t border-[#F0E6D8]">
                <span>Total a Pagar</span>
                <span className="font-serif text-base text-[#993C1D]">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C05634] to-[#993C1D] hover:from-[#A84525] hover:to-[#823016] shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generando pedido y factura PDF...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F3C363]" />
                  <span>Simular Compra y Descargar Factura PDF</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#8C7A6E]">
              📄 Tras confirmar, se descargará automáticamente tu factura de compra en PDF.
            </p>

            <button
              onClick={onClearCart}
              type="button"
              className="w-full text-center text-[11px] text-[#8C7A6E] hover:text-[#C05634] transition py-1"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
