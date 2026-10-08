import React, { useState } from 'react';
import { Product } from '../types';
import { CURATED_IMAGE_PRESETS } from '../data/initialData';
import { Image as ImageIcon, X, Check, Sparkles } from 'lucide-react';

interface ChangeImageModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveImage: (productId: string, newImageUrl: string) => void;
}

export const ChangeImageModal: React.FC<ChangeImageModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveImage,
}) => {
  if (!isOpen || !product) return null;

  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onSaveImage(product.id, imageUrl.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#FAF7F2] border border-[#E3D6C1] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8C7A6E] hover:text-[#382B23] hover:bg-[#EAE0D1] rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E8DEC8]">
          <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] text-[#C05634] flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#382B23]">
              Cambiar Imagen de Referencia
            </h3>
            <p className="text-xs text-[#7B695D]">
              {product.referenceCode} · {product.title}
            </p>
          </div>
        </div>

        {/* Live Preview */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1.5">
            Vista Previa Actual
          </label>
          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#DDD0BE] bg-[#EFE8DC]">
            <img
              src={imageUrl}
              alt="Vista previa"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1.5">
              URL de la Nueva Imagen
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-2 focus:ring-[#C05634]"
            />
          </div>

          {/* Quick Curated Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-[#8C7A6E] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#DE9B27]" />
                O elige una foto artesanal recomendada:
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-white/70 border border-[#E5D7C3] rounded-xl">
              {CURATED_IMAGE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`group relative rounded-lg overflow-hidden h-16 border-2 transition ${
                    imageUrl === preset.url
                      ? 'border-[#C05634] ring-2 ring-[#C05634]/30'
                      : 'border-transparent hover:border-[#DE9B27]'
                  }`}
                  title={preset.name}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  {imageUrl === preset.url && (
                    <div className="absolute inset-0 bg-[#C05634]/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8DEC8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#7B695D] hover:bg-[#EAE0D1] rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#C05634] hover:bg-[#993C1D] rounded-xl shadow-xs transition"
            >
              Guardar Imagen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
