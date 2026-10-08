import { Product, Transaction } from '../types';
import { formatCurrency, formatDate } from './formatters';

export function exportTransactionsToExcel(
  transactions: Transaction[],
  products: Product[],
  kpiStats: { totalProducts: number; totalClients: number; totalRevenue: number }
) {
  // UTF-8 BOM for Microsoft Excel compatibility
  const BOM = '\uFEFF';
  
  const headers = [
    'ID de Orden',
    'Cliente',
    'Correo Electrónico',
    'Producto',
    'Cantidad',
    'Fecha',
    'Monto (COP)',
    'Estado',
    'Método de Pago',
  ];

  const rows = transactions.map((tx) => [
    `"${tx.orderNumber}"`,
    `"${tx.customerName}"`,
    `"${tx.customerEmail}"`,
    `"${tx.productTitle.replace(/"/g, '""')}"`,
    tx.quantity,
    `"${formatDate(tx.date)}"`,
    tx.amount,
    `"${tx.status}"`,
    `"${tx.paymentMethod}"`,
  ]);

  // Inventory summary section
  const summaryHeaders = ['\nResumen de Métricas Clave Hilos de Sol'];
  const summaryRows = [
    `"Total Productos en Inventario",${kpiStats.totalProducts}`,
    `"Total Clientes Activos",${kpiStats.totalClients}`,
    `"Ingresos Totales",${kpiStats.totalRevenue}`,
    '\nDetalle de Inventario Actual',
    'Código Ref,Título,Categoría,Precio,Stock',
    ...products.map(
      (p) =>
        `"${p.referenceCode}","${p.title.replace(/"/g, '""')}","${p.category}",${p.price},${p.stock}`
    ),
  ];

  const csvContent =
    BOM +
    'HISTORIAL DE TRANSACCIONES - HILOS DE SOL\n' +
    headers.join(',') +
    '\n' +
    rows.map((r) => r.join(',')).join('\n') +
    '\n' +
    summaryHeaders.join('\n') +
    '\n' +
    summaryRows.join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `informe_hilos_de_sol_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPrintReport() {
  window.print();
}
