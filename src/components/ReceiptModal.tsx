import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { downloadInvoicePDF } from '../utils/pdfInvoiceGenerator';
import { 
  CheckCircle, 
  Sun, 
  X, 
  ShoppingBag, 
  FileDown, 
  Printer, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToCatalog: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onGoToCatalog,
}) => {
  if (!isOpen || !transaction) return null;

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = () => {
    downloadInvoicePDF(transaction);
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-[#FAF7F2] border-2 border-[#DE9B27]/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8C7A6E] hover:text-[#382B23] hover:bg-[#EAE0D1] rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Success Section */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FCF5E8] border-2 border-[#DE9B27] flex items-center justify-center text-[#DE9B27] mb-3 shadow-inner">
            <CheckCircle className="w-9 h-9 text-[#C05634]" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C05634] bg-[#FAF0E6] px-3 py-0.5 rounded-full border border-[#E9DAC8]">
            ¡Compra Confirmada con Éxito!
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#382B23] mt-1.5">
            Factura Electrónica Generada
          </h3>
          <p className="text-xs text-[#7B695D] mt-1 max-w-sm mx-auto">
            Hemos generado tu factura oficial en PDF con validez de compra para <strong>{transaction.customerName}</strong>.
          </p>
        </div>

        {/* Invoice Preview Box */}
        <div className="bg-white border border-[#E5D7C3] rounded-2xl p-5 text-xs space-y-3.5 shadow-xs relative">
          
          {/* Top Bar with brand and invoice number */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8]">
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#DE9B27]" />
              <span className="font-serif font-bold text-sm text-[#382B23]">Hilos de Sol S.A.S.</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8C7A6E] block">Factura N°</span>
              <span className="font-mono text-[#993C1D] font-bold text-xs">
                {transaction.orderNumber}
              </span>
            </div>
          </div>

          {/* Customer & Order Metadata */}
          <div className="grid grid-cols-2 gap-3 text-[#6C594D] bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE2D4]">
            <div>
              <span className="text-[10px] uppercase text-[#A08E80] font-semibold block">Comprador</span>
              <strong className="text-[#382B23] text-xs block truncate">{transaction.customerName}</strong>
              <span className="text-[10px] text-[#8C7A6E] truncate block">{transaction.customerEmail}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#A08E80] font-semibold block">Emisión & Pago</span>
              <strong className="text-[#382B23] text-xs block">{formatDate(transaction.date)}</strong>
              <span className="text-[10px] text-[#8C6212] font-semibold block">{transaction.paymentMethod}</span>
            </div>
          </div>

          {/* Products breakdown */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A6E] mb-1.5">
              Detalle de Piezas Artesanales
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {transaction.items && transaction.items.length > 0 ? (
                transaction.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[#382B23] text-[11px] py-1 border-b border-[#F5EDE1] last:border-0">
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold">{it.title}</span>
                      <span className="text-[#8C7A6E] ml-1.5 font-mono text-[10px]">({it.referenceCode})</span>
                    </div>
                    <div className="text-right whitespace-nowrap shrink-0">
                      <span className="text-[#8C7A6E] mr-2">x{it.quantity}</span>
                      <span className="font-semibold">{formatCurrency(it.price * it.quantity)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between text-[#382B23] text-[11px] py-1">
                  <span>{transaction.productTitle}</span>
                  <span className="font-semibold">{formatCurrency(transaction.amount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-dashed border-[#DDD0BE] flex items-center justify-between">
            <div>
              <span className="font-bold uppercase tracking-wider text-[#382B23] text-xs">Total Pagado:</span>
              <span className="text-[10px] text-[#166534] block">Envío nacional gratuito incluido</span>
            </div>
            <span className="font-serif text-xl font-bold text-[#993C1D]">
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        </div>

        {/* PRIMARY ACTIONS: PDF DOWNLOAD & NAVIGATION */}
        <div className="mt-5 space-y-2.5">
          
          {/* Highlighted PDF Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#C05634] via-[#DE9B27] to-[#C05634] hover:opacity-95 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-101"
          >
            <FileDown className="w-4 h-4 text-white" />
            <span>
              {downloadSuccess ? '¡Descargando Factura en PDF...!' : 'Descargar Factura en PDF'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onGoToCatalog();
              }}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold text-[#382B23] bg-[#EFE8DC] hover:bg-[#E5D7C3] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C05634]" />
              <span>Seguir en Catálogo</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl text-xs font-medium text-[#7B695D] hover:bg-[#ECE2D2] transition text-center cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Artisan assurance note */}
        <div className="mt-4 pt-3 border-t border-[#E8DEC8] flex items-center justify-center gap-1.5 text-[11px] text-[#8C7A6E]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Comprobante digital registrado en el sistema de Hilos de Sol</span>
        </div>
      </div>
    </div>
  );
};
