export type UserRole = 'admin' | 'buyer';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export interface Product {
  id: string;
  referenceCode: string;
  title: string;
  description: string;
  category: 'Frascos Decorados' | 'Amigurumis' | 'Llaveros' | 'Accesorios';
  price: number;
  stock: number;
  imageUrl: string;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TransactionItem {
  referenceCode: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  quantity: number;
  date: string;
  amount: number;
  status: 'Completada' | 'En Proceso' | 'Enviada';
  paymentMethod: 'Tarjeta de Crédito' | 'Transferencia' | 'PSE';
  items?: TransactionItem[];
}

export interface SalesCategoryMetric {
  category: string;
  ventas: number;
  unidades: number;
}

export interface MonthlyTrendMetric {
  mes: string;
  ventas: number;
  clientes: number;
}
