import React, { useState } from 'react';
import { User, Product, Transaction, CartItem } from './types';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { CatalogView } from './components/CatalogView';
import { DashboardView } from './components/DashboardView';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { ChangeImageModal } from './components/ChangeImageModal';
import { ReceiptModal } from './components/ReceiptModal';
import { downloadInvoicePDF } from './utils/pdfInvoiceGenerator';
import { CheckCircle2, Info, Sparkles, SunMedium, Heart } from 'lucide-react';

export default function App() {
  // Current user state: default to admin for rich immediate experience
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<'auth' | 'catalog' | 'dashboard'>('catalog');
  
  // Products and Transactions state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);
  const [productForImageChange, setProductForImageChange] = useState<Product | null>(null);
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Flash notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showToast(`¡Sesión iniciada con éxito como ${user.role === 'admin' ? 'Administrador' : 'Comprador'}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('auth');
    showToast('Sesión cerrada. Selecciona un perfil para continuar.');
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Añadido "${product.title}" al carrito.`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Simulated Checkout Handler: Updates inventory and creates new order in dashboard
  const handleCheckout = (
    buyerName: string,
    buyerEmail: string,
    paymentMethod: 'PSE' | 'Tarjeta de Crédito' | 'Transferencia'
  ) => {
    if (cart.length === 0) return;

    // Deduct stock for each cart item
    setProducts((prev) =>
      prev.map((p) => {
        const inCart = cart.find((item) => item.product.id === p.id);
        if (inCart) {
          return {
            ...p,
            stock: Math.max(0, p.stock - inCart.quantity),
          };
        }
        return p;
      })
    );

    // Create consolidated transaction record for this order
    const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const primaryTitle = cart.length === 1 
      ? cart[0].product.title 
      : `${cart[0].product.title} + ${cart.length - 1} más`;
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

    const transactionItems = cart.map((item) => ({
      referenceCode: item.product.referenceCode,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      orderNumber: `HS-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: buyerName,
      customerEmail: buyerEmail,
      productTitle: primaryTitle,
      quantity: totalQty,
      date: new Date().toISOString().slice(0, 10),
      amount: totalAmount,
      status: 'Completada',
      paymentMethod,
      items: transactionItems,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setReceiptTransaction(newTx);
    setIsReceiptOpen(true);
    setCart([]);

    // Automatically generate and download the PDF invoice for the buyer
    try {
      downloadInvoicePDF(newTx);
      showToast(`¡Compra exitosa! Factura en PDF generada y descargada para ${buyerName}.`);
    } catch {
      showToast(`¡Pedido ${newTx.orderNumber} simulado exitosamente!`);
    }
  };

  // Product Management Handlers (Admin)
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Referencia eliminada del catálogo.');
  };

  const handleOpenChangeImage = (product: Product) => {
    setProductForImageChange(product);
    setIsChangeImageModalOpen(true);
  };

  const handleSaveImage = (productId: string, newImageUrl: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, imageUrl: newImageUrl } : p))
    );
    showToast('Imagen de la referencia actualizada con éxito.');
  };

  const handleOpenCreateProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (productData.id) {
      // Edit existing
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? ({ ...p, ...productData } as Product) : p))
      );
      showToast('Referencia actualizada.');
    } else {
      // Create new
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        referenceCode: productData.referenceCode || `REF-${Math.floor(100 + Math.random() * 900)}`,
        title: productData.title || 'Nueva Referencia Artesanal',
        description: productData.description || 'Tejido artesanal hecho a mano en crochet.',
        category: productData.category || 'Frascos Decorados',
        price: productData.price || 30000,
        stock: productData.stock || 10,
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`¡Nueva referencia "${newProduct.title}" creada!`);
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#382B23] selection:bg-[#E9B44C]/30 selection:text-[#933D22]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-[#382B23] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#DE9B27] flex items-center gap-2.5 text-xs font-medium animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[#DE9B27] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'auth' && (
          <LoginView
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onNavigateToCatalog={() => setActiveTab('catalog')}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            products={products}
            currentUser={currentUser}
            onAddToCart={handleAddToCart}
            onDeleteProduct={handleDeleteProduct}
            onOpenChangeImage={handleOpenChangeImage}
            onOpenCreateProduct={handleOpenCreateProduct}
            onEditProduct={handleOpenEditProduct}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            products={products}
            transactions={transactions}
            onSwitchToAdmin={() => {
              const admin = INITIAL_USERS.find((u) => u.role === 'admin')!;
              handleLogin(admin);
            }}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
        currentUser={currentUser}
      />

      {/* Admin Product Modal (Cargar nuevo producto o editar) */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />

      {/* Admin Change Image Modal */}
      <ChangeImageModal
        isOpen={isChangeImageModalOpen}
        onClose={() => setIsChangeImageModalOpen(false)}
        product={productForImageChange}
        onSaveImage={handleSaveImage}
      />

      {/* Simulated Purchase Confirmation Receipt */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={receiptTransaction}
        onGoToCatalog={() => setActiveTab('catalog')}
      />

      {/* Handcrafted Footer */}
      <footer className="mt-auto border-t border-[#E8DEC8] bg-[#FAF4EC] py-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <SunMedium className="w-5 h-5 text-[#C05634]" />
            <span className="font-serif text-lg font-bold text-[#382B23]">
              Hilos de Sol
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#DE9B27]" />
          </div>
          <p className="text-xs text-[#7B695D] max-w-md mx-auto">
            Paleta corporativa terracota, mostaza y crudo. Plataforma integral con autenticación basada en roles, catálogo de referencias en crochet y analítica en tiempo real.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-[#A08E80] pt-2">
            <span>© 2026 Hilos de Sol</span>
            <span>·</span>
            <span>Hecho con amor y ganchillo</span>
            <span>·</span>
            <span className="text-[#C05634] font-semibold">Artesanías Colombianas</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
