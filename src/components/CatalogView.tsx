import React, { useState } from 'react';
import { Product, User } from '../types';
import { formatCurrency } from '../utils/formatters';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Check, 
  AlertTriangle,
  Heart,
  SlidersHorizontal
} from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  currentUser: User | null;
  onAddToCart: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenChangeImage: (product: Product) => void;
  onOpenCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  currentUser,
  onAddToCart,
  onDeleteProduct,
  onOpenChangeImage,
  onOpenCreateProduct,
  onEditProduct,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const categories = ['Todas', 'Frascos Decorados', 'Amigurumis', 'Llaveros', 'Accesorios'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCartWithFeedback = (product: Product) => {
    onAddToCart(product);
    setAddedItemAnimation(product.id);
    setTimeout(() => {
      setAddedItemAnimation(null);
    }, 1200);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
      
      {/* Catalog Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FAF0E6] via-[#FAF4ED] to-[#F5ECE0] border border-[#E8DEC8] p-6 sm:p-10 mb-10 shadow-xs">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C05634] bg-white/80 px-2.5 py-0.5 rounded-md border border-[#EADCCC]">
              Colección Hecha a Mano
            </span>
            {isAdmin && (
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF] bg-[#C05634] px-2.5 py-0.5 rounded-md shadow-xs">
                Modo Administrador Activo
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#382B23] tracking-tight">
            Catálogo de Piezas Exclusivas
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6C594D] leading-relaxed">
            Explora nuestras referencias tejidas a mano en hilo de algodón natural. Cada pieza es única, tejida con paciencia, dedicación y calidez artesanal.
          </p>
        </div>

        {/* Ambient decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#DE9B27]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block text-8xl opacity-15 select-none pointer-events-none">
          ☀️
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        
        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C05634] text-white shadow-xs font-semibold'
                  : 'bg-[#FAF7F2] text-[#6C594D] border border-[#E5D7C3] hover:bg-[#F2E7D8] hover:text-[#382B23]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input and action */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#8C7A6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por referencia..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] placeholder-[#A09284] focus:outline-none focus:ring-2 focus:ring-[#C05634]"
            />
          </div>

          {/* Top Admin Action Button if logged in */}
          {isAdmin && (
            <button
              onClick={onOpenCreateProduct}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#C05634] hover:bg-[#993C1D] text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cargar nuevo producto</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E8DEC8] rounded-3xl p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#C05634] mb-3">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#382B23] mb-1">
            No se encontraron referencias
          </h3>
          <p className="text-xs text-[#7B695D] max-w-sm mx-auto mb-5">
            Intenta con otro término de búsqueda o selecciona otra categoría artesanal.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Todas');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#F2E7D8] text-[#6C594D] text-xs font-semibold rounded-xl hover:bg-[#E5D7C3] transition cursor-pointer"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const isJustAdded = addedItemAnimation === product.id;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 w-full bg-[#EFE8DC] overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Reference Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[11px] font-bold text-[#382B23] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-[#E5D7C3] font-mono">
                      {product.referenceCode}
                    </span>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="text-[10px] font-semibold text-[#8C6212] bg-[#FAF5E6]/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-[#DE9B27]/30">
                      {product.category}
                    </span>
                  </div>

                  {/* Stock Notice */}
                  {isOutOfStock ? (
                    <div className="absolute top-3 right-3 z-10 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Agotado
                    </div>
                  ) : product.stock <= 5 ? (
                    <div className="absolute top-3 right-3 z-10 bg-[#DE9B27] text-[#2F2113] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      ¡Últimas {product.stock} unids!
                    </div>
                  ) : null}

                  {/* ---------------- ADMIN OVERLAY ACTION BUTTONS ---------------- */}
                  {isAdmin && (
                    <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/70 via-black/30 to-transparent flex items-center justify-end gap-2 z-20">
                      {/* Cambiar Imagen Button */}
                      <button
                        type="button"
                        onClick={() => onOpenChangeImage(product)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-[#993C1D] text-[11px] font-bold shadow-md transition transform hover:scale-105 cursor-pointer backdrop-blur-xs"
                        title="Cambiar imagen de la referencia"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#C05634]" />
                        <span>Cambiar imagen</span>
                      </button>

                      {/* Editar Referencia */}
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-[#524135] text-[11px] font-bold shadow-md transition transform hover:scale-105 cursor-pointer backdrop-blur-xs"
                        title="Editar información"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#524135]" />
                      </button>

                      {/* Eliminar Referencia Button */}
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-white text-[11px] font-bold shadow-md transition transform hover:scale-105 cursor-pointer backdrop-blur-xs"
                        title="Eliminar referencia del catálogo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Information */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#382B23] line-clamp-2 leading-snug group-hover:text-[#993C1D] transition-colors">
                      {product.title}
                    </h3>

                    <p className="mt-2 text-xs text-[#6C594D] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#F0E6D8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A08E80] block">
                        Precio Artesanal
                      </span>
                      <span className="font-serif text-xl font-bold text-[#382B23]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    {/* Button "Añadir al carrito" */}
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCartWithFeedback(product)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isOutOfStock
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : isJustAdded
                          ? 'bg-[#15803D] text-white scale-105'
                          : 'bg-[#C05634] hover:bg-[#993C1D] text-white hover:scale-102'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4 animate-bounce" />
                          <span>¡Añadido!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Añadir al carrito</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button (FAB) for Admin to "Cargar nuevo producto" */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={onOpenCreateProduct}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#C05634] to-[#993C1D] text-white font-bold text-xs uppercase tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-white/30"
          >
            <Plus className="w-5 h-5" />
            <span>Cargar nuevo producto</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal for Deleting Product */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#E3D6C1] rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#382B23] mb-2">
              ¿Eliminar esta referencia?
            </h3>
            <p className="text-xs text-[#7B695D] mb-5">
              Se eliminará <strong>{productToDelete.referenceCode}: {productToDelete.title}</strong> del catálogo de la tienda. Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-[#6C594D] bg-[#EFE8DC] hover:bg-[#E5D7C3] rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-xs cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
