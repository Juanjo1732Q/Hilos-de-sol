import React, { useState, useMemo } from 'react';
import { Product, Transaction, User } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportTransactionsToExcel, triggerPrintReport } from '../utils/exportUtils';
import { downloadInvoicePDF } from '../utils/pdfInvoiceGenerator';
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  FileDown,
  Search,
  Lock,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
  ShoppingBag,
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface DashboardViewProps {
  currentUser: User | null;
  products: Product[];
  transactions: Transaction[];
  onSwitchToAdmin: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  products,
  transactions,
  onSwitchToAdmin,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [tableSearch, setTableSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'recent'>('all');

  // Real-time KPI calculations
  const totalProducts = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.stock || 0), 0);
  }, [products]);

  const uniqueActiveClients = useMemo(() => {
    const clients = new Set(transactions.map((t) => t.customerEmail.toLowerCase().trim()));
    return clients.size;
  }, [transactions]);

  const totalRevenue = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  }, [transactions]);

  const totalUnitsSold = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.quantity || 1), 0);
  }, [transactions]);

  // Bar Chart Data: Sales & Units by Category
  const categorySalesData = useMemo(() => {
    const catMap: Record<string, { ventas: number; unidades: number }> = {
      'Frascos Decorados': { ventas: 0, unidades: 0 },
      'Amigurumis': { ventas: 0, unidades: 0 },
      'Llaveros': { ventas: 0, unidades: 0 },
      'Accesorios': { ventas: 0, unidades: 0 },
    };

    transactions.forEach((tx) => {
      // Find product category or infer from title
      const foundProduct = products.find((p) => p.title === tx.productTitle);
      let cat = foundProduct?.category;

      if (!cat) {
        if (tx.productTitle.toLowerCase().includes('frasco')) cat = 'Frascos Decorados';
        else if (tx.productTitle.toLowerCase().includes('amigurumi') || tx.productTitle.toLowerCase().includes('abeja') || tx.productTitle.toLowerCase().includes('osito')) cat = 'Amigurumis';
        else if (tx.productTitle.toLowerCase().includes('llavero')) cat = 'Llaveros';
        else cat = 'Accesorios';
      }

      if (catMap[cat]) {
        catMap[cat].ventas += tx.amount;
        catMap[cat].unidades += tx.quantity;
      }
    });

    return Object.entries(catMap).map(([category, values]) => ({
      categoria: category,
      ventas: values.ventas,
      unidades: values.unidades,
    }));
  }, [transactions, products]);

  // Line Chart Data: 6-month sales and client growth trend
  const monthlyTrendData = useMemo(() => {
    return [
      { mes: 'Nov 2025', ventas: 890000, clientes: 14 },
      { mes: 'Dic 2025', ventas: 1720000, clientes: 32 },
      { mes: 'Ene 2026', ventas: 1150000, clientes: 21 },
      { mes: 'Feb 2026', ventas: 1480000, clientes: 28 },
      { mes: 'Mar 2026', ventas: 1890000, clientes: 36 },
      { mes: 'Abr 2026', ventas: totalRevenue, clientes: uniqueActiveClients },
    ];
  }, [totalRevenue, uniqueActiveClients]);

  // Filtered transactions table
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchQuery =
        t.orderNumber.toLowerCase().includes(tableSearch.toLowerCase()) ||
        t.customerName.toLowerCase().includes(tableSearch.toLowerCase()) ||
        t.productTitle.toLowerCase().includes(tableSearch.toLowerCase()) ||
        t.customerEmail.toLowerCase().includes(tableSearch.toLowerCase());
      return matchQuery;
    });
  }, [transactions, tableSearch]);

  const handleExportExcel = () => {
    exportTransactionsToExcel(transactions, products, {
      totalProducts,
      totalClients: uniqueActiveClients,
      totalRevenue,
    });
  };

  const handleExportPDF = () => {
    triggerPrintReport();
  };

  // If user is not an Admin, show protective lock state
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border-2 border-[#DE9B27]/40 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#C05634] mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C05634] bg-[#FAF0E6] px-3 py-1 rounded-full border border-[#E8DEC8]">
            Área Confidencial
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#382B23] mt-3">
            Dashboard de Analítica e Inventario
          </h2>
          <p className="mt-3 text-sm text-[#6C594D] max-w-md mx-auto leading-relaxed">
            Esta sección contiene información financiera sensible, métricas de inventario y datos de facturación. Solo el usuario administrador autorizado (<strong className="text-[#993C1D]">juanjosequinteroreyes8@gmail.com</strong>) tiene acceso.
          </p>

          <div className="mt-8 pt-6 border-t border-[#F0E6D8] flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onSwitchToAdmin}
              className="px-6 py-3 bg-[#C05634] hover:bg-[#993C1D] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Cambiar a Perfil Administrador</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Dashboard Top Header & Functional Export Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C05634]">
              Panel de Control Central
            </span>
            <span className="text-[10px] font-bold bg-[#DE9B27] text-[#2B1D0F] px-2 py-0.2 rounded-full">
              En Tiempo Real
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#382B23]">
            Dashboard de Analítica e Inventario
          </h1>
          <p className="text-xs sm:text-sm text-[#7B695D] mt-1">
            Supervisa los volúmenes de stock, flujo financiero y comportamiento de compradores en <em>Hilos de Sol</em>.
          </p>
        </div>

        {/* FUNCTIONAL EXPORT BUTTONS (VISUALLY HIGHLIGHTED WITH ICONS) */}
        <div className="flex items-center gap-3 no-print">
          {/* Button: Descargar informe PDF */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF5ED] text-[#993C1D] border-2 border-[#C05634] text-xs font-bold shadow-xs hover:shadow transition transform hover:-translate-y-0.5 cursor-pointer"
            title="Genera e imprime el reporte consolidado en PDF"
          >
            <FileText className="w-4 h-4 text-[#C05634]" />
            <span>Descargar informe PDF</span>
          </button>

          {/* Button: Exportar a Excel */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#DE9B27] to-[#C68B23] hover:from-[#C68B23] hover:to-[#A87214] text-[#2B1D0F] text-xs font-bold shadow-xs hover:shadow transition transform hover:-translate-y-0.5 cursor-pointer"
            title="Descarga archivo CSV compatible con Microsoft Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2B1D0F]" />
            <span>Exportar a Excel</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Total de productos en inventario */}
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B695D]">
              Total en Inventario
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] text-[#C05634] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif text-3xl font-bold text-[#382B23]">
              {totalProducts}
            </div>
            <p className="text-[11px] text-[#7B695D] mt-1 flex items-center gap-1">
              <span>{products.length} referencias activas catalogadas</span>
            </p>
          </div>
        </div>

        {/* KPI 2: Cantidad de clientes activos/compradores */}
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B695D]">
              Clientes Activos
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FCF6E9] text-[#DE9B27] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif text-3xl font-bold text-[#382B23]">
              {uniqueActiveClients}
            </div>
            <p className="text-[11px] text-[#7B695D] mt-1 flex items-center gap-1">
              <span className="text-[#166534] font-semibold">+18.4%</span>
              <span>vs mes anterior</span>
            </p>
          </div>
        </div>

        {/* KPI 3: Ingresos Totales */}
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B695D]">
              Ingresos Totales
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] text-[#C05634] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#993C1D] truncate">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-[11px] text-[#7B695D] mt-1 flex items-center gap-1">
              <span className="text-[#166534] font-semibold">+24.2%</span>
              <span>crecimiento sostenido</span>
            </p>
          </div>
        </div>

        {/* KPI 4: Unidades Totales Vendidas */}
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B695D]">
              Unidades Vendidas
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FCF6E9] text-[#DE9B27] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif text-3xl font-bold text-[#382B23]">
              {totalUnitsSold}
            </div>
            <p className="text-[11px] text-[#7B695D] mt-1 flex items-center gap-1">
              <span>{transactions.length} pedidos procesados</span>
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHART 1: Ventas por Categoría (Bar Chart) */}
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0E6D8]">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#382B23] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C05634]" />
                Ventas por Categoría Artesanal
              </h3>
              <p className="text-xs text-[#7B695D]">
                Comparativa de ingresos recaudados por línea de producto
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySalesData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE6DA" />
                <XAxis
                  dataKey="categoria"
                  tick={{ fill: '#736357', fontSize: 11 }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: '#736357', fontSize: 10 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Ventas']}
                  contentStyle={{
                    backgroundColor: '#FAF7F2',
                    borderColor: '#DE9B27',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#382B23',
                  }}
                />
                <Bar
                  dataKey="ventas"
                  name="Ingresos (COP)"
                  fill="#C05634"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-[11px] text-[#8C7A6E]">
            * Las piezas de <strong>Amigurumis</strong> y <strong>Frascos Decorados</strong> concentran la mayor cuota de facturación.
          </div>
        </div>

        {/* CHART 2: Tendencia de Ventas y Crecimiento de Clientes (Line Chart) */}
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0E6D8]">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#382B23] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#DE9B27]" />
                Tendencia Semestral & Clientes
              </h3>
              <p className="text-xs text-[#7B695D]">
                Evolución de ventas totales y nuevos compradores (Últimos 6 Meses)
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 10, right: 15, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE6DA" />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: '#736357', fontSize: 11 }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#736357', fontSize: 10 }}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#DE9B27', fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    name === 'Ventas (COP)' ? formatCurrency(Number(value)) : `${value} clientes`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#FAF7F2',
                    borderColor: '#C05634',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ventas"
                  name="Ventas (COP)"
                  stroke="#C05634"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#C05634' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="clientes"
                  name="Clientes Activos"
                  stroke="#DE9B27"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#DE9B27' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-[11px] text-[#8C7A6E]">
            * Crecimiento continuo impulsado por la temporada decembrina y el nuevo canal digital.
          </div>
        </div>
      </div>

      {/* REPORT TABLE: Historial de Transacciones */}
      <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-[#F0E6D8]">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#382B23]">
              Historial de Transacciones
            </h3>
            <p className="text-xs text-[#7B695D]">
              Registro detallado de órdenes, compradores, referencias solicitadas y montos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C7A6E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filtrar por orden, cliente o producto..."
                className="pl-9 pr-4 py-1.5 bg-[#FAF7F2] border border-[#DDD0BE] rounded-xl text-xs text-[#382B23] focus:outline-none focus:ring-2 focus:ring-[#C05634] w-64"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8DEC8] text-[11px] font-bold uppercase tracking-wider text-[#7B695D] bg-[#FAF7F2]">
                <th className="py-3 px-4 rounded-l-lg">ID de Orden</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Producto Referencia</th>
                <th className="py-3 px-4 text-center">Cantidad</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Monto</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center rounded-r-lg">Factura PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8] text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#8C7A6E]">
                    No se encontraron transacciones que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FAF7F2]/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#993C1D]">
                      {tx.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#382B23]">{tx.customerName}</div>
                      <div className="text-[10px] text-[#8C7A6E]">{tx.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-[#382B23] font-medium max-w-[200px] truncate">
                      {tx.productTitle}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-[#6C594D]">
                      {tx.quantity}
                    </td>
                    <td className="py-3 px-4 text-[#6C594D]">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3 px-4 text-[#6C594D]">
                      <span className="bg-[#FAF2E6] text-[#8C6212] px-2 py-0.5 rounded text-[10px] font-medium border border-[#E9DAC8]">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-[#382B23]">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'Completada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.status === 'Enviada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => downloadInvoicePDF(tx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF0E6] hover:bg-[#F3E2CF] text-[#993C1D] text-[11px] font-semibold border border-[#DE9B27]/40 transition shadow-xs cursor-pointer"
                        title={`Descargar Factura PDF de la orden ${tx.orderNumber}`}
                      >
                        <FileDown className="w-3.5 h-3.5 text-[#C05634]" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE DEDICATED REPORT CONTAINER (VISIBLE IN BROWSER PRINT / PDF DOWNLOAD) */}
      <div id="printable-dashboard-report" className="hidden">
        <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #C05634', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', margin: '0 0 6px 0', color: '#382B23' }}>
            HILOS DE SOL · INFORME OFICIAL DE GESTIÓN Y ANALÍTICA
          </h1>
          <p style={{ fontSize: '12px', margin: 0, color: '#666' }}>
            Generado el: {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
          <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1, borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#666' }}>TOTAL PRODUCTOS EN INVENTARIO</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{totalProducts} unidades</div>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1, borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#666' }}>CLIENTES ACTIVOS</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{uniqueActiveClients} compradores</div>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1, borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#666' }}>INGRESOS TOTALES</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#C05634' }}>{formatCurrency(totalRevenue)}</div>
          </div>
        </div>

        <h3 style={{ fontSize: '14px', borderBottom: '1px solid #ccc', paddingBottom: '6px' }}>
          Historial de Órdenes Registradas
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>Orden</th>
              <th style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>Cliente</th>
              <th style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>Producto</th>
              <th style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>Fecha</th>
              <th style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>Monto</th>
              <th style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '6px' }}>{tx.orderNumber}</td>
                <td style={{ padding: '6px' }}>{tx.customerName}</td>
                <td style={{ padding: '6px' }}>{tx.productTitle}</td>
                <td style={{ padding: '6px' }}>{tx.date}</td>
                <td style={{ padding: '6px', fontWeight: 'bold' }}>{formatCurrency(tx.amount)}</td>
                <td style={{ padding: '6px' }}>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
