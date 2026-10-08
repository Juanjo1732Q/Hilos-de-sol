import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CURATED_IMAGE_PRESETS } from '../data/initialData';
import { PlusCircle, Edit3, X, Sparkles } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) => {
  if (!isOpen) return null;

  const isEditing = !!productToEdit;

  const [title, setTitle] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [category, setCategory] = useState<Product['category']>('Frascos Decorados');
  const [price, setPrice] = useState<number>(35000);
  const [stock, setStock] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
  );

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setReferenceCode(productToEdit.referenceCode);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setStock(productToEdit.stock);
      setDescription(productToEdit.description);
      setImageUrl(productToEdit.imageUrl);
    } else {
      // Default values for new product
      setTitle('');
      setReferenceCode(`REF-${String.fromCharCode(65 + Math.floor(Math.random() * 20))}-${Math.floor(10 + Math.random() * 90)}`);
      setCategory('Frascos Decorados');
      setPrice(35000);
      setStock(12);
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80');
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...(productToEdit ? { id: productToEdit.id } : {}),
      title: title.trim(),
      referenceCode: referenceCode.trim() || 'REF-NUEVO',
      category,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      description: description.trim() || 'Pieza tejida a mano con hilo de algodón 100%.',
      imageUrl: imageUrl.trim() || CURATED_IMAGE_PRESETS[0].url,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-[#FAF7F2] border border-[#E3D6C1] rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8C7A6E] hover:text-[#382B23] hover:bg-[#EAE0D1] rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#E8DEC8]">
          <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] text-[#C05634] flex items-center justify-center">
            {isEditing ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#382B23]">
              {isEditing ? 'Editar Referencia Artesanal' : 'Cargar Nuevo Producto'}
            </h3>
            <p className="text-xs text-[#7B695D]">
              {isEditing
                ? 'Actualiza los datos del producto en el catálogo'
                : 'Añade una nueva pieza al catálogo visible de Hilos de Sol'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1">
                Nombre de la Referencia
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Frasco de flores en crochet"
                className="w-full px-3.5 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-2 focus:ring-[#C05634]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1">
                Código de Referencia
              </label>
              <input
                type="text"
                required
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                placeholder="Ej: REF-A-01"
                className="w-full px-3.5 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-2 focus:ring-[#C05634]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full px-3 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-2 focus:ring-[#C05634]"
              >
                <option value="Frascos Decorados">Frascos Decorados</option>
                <option value="Amigurumis">Amigurumis</option>
                <option value="Llaveros">Llaveros</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1">
                Precio (COP)
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-2 focus:ring-[#C05634]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1">
                Stock Inicial
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-2 focus:ring-[#C05634]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1">
              Descripción de la Pieza
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalla los puntos de tejido, hilaza utilizada, tonos y dimensiones..."
              className="w-full px-3.5 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-2 focus:ring-[#C05634]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A493D] mb-1">
              URL de la Fotografía
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-2 focus:ring-[#C05634]"
            />
          </div>

          {/* Quick Presets Carousel */}
          <div>
            <span className="text-[11px] font-semibold text-[#8C7A6E] uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <Sparkles className="w-3 h-3 text-[#DE9B27]" />
              Sugerencias de fotografías artesanales:
            </span>
            <div className="grid grid-cols-5 gap-2">
              {CURATED_IMAGE_PRESETS.slice(0, 5).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`h-14 rounded-lg overflow-hidden border-2 transition ${
                    imageUrl === preset.url
                      ? 'border-[#C05634] ring-2 ring-[#C05634]/30'
                      : 'border-transparent hover:border-[#DE9B27]'
                  }`}
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DEC8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#7B695D] hover:bg-[#EAE0D1] rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#C05634] to-[#993C1D] hover:from-[#A84525] hover:to-[#823016] rounded-xl shadow-xs transition cursor-pointer"
            >
              {isEditing ? 'Guardar Cambios' : 'Publicar en Catálogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
