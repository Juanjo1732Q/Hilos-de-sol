import { jsPDF } from 'jspdf';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from './formatters';

export function generateInvoicePDF(tx: Transaction): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // --- BRAND HEADER BAR (Terracota #C05634) ---
  doc.setFillColor(192, 86, 52); // Terracotta
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line (Mostaza #DE9B27)
  doc.setFillColor(222, 155, 39); // Mustard
  doc.rect(0, 28, pageWidth, 3, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('HILOS DE SOL', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('TEJIDOS & ARTESANÍAS HECHAS A MANO', margin, 20);

  // Invoice Number Badge in Header (Right side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('FACTURA DE COMPRA', pageWidth - margin, 13, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`N°: ${tx.orderNumber}`, pageWidth - margin, 19, { align: 'right' });

  // --- BUSINESS & EMISSION DETAILS ---
  let y = 38;

  doc.setTextColor(80, 65, 55);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Hilos de Sol S.A.S. · NIT: 901.482.319-4', margin, y);
  doc.text('Taller Artesanal: Bucaramanga, Santander, Colombia', margin, y + 4.5);
  doc.text('contacto@hilosdesol.com · (+57) 301 513 7667', margin, y + 9);

  // Date & Payment method (Right side)
  doc.text(`Fecha de Emisión: ${formatDate(tx.date)}`, pageWidth - margin, y, { align: 'right' });
  doc.text(`Método de Pago: ${tx.paymentMethod}`, pageWidth - margin, y + 4.5, { align: 'right' });
  doc.text(`Estado del Pedido: ${tx.status}`, pageWidth - margin, y + 9, { align: 'right' });

  y += 18;

  // --- BUYER DETAILS SECTION (Light Crudo / Canvas Box #FAF6F0) ---
  doc.setFillColor(250, 246, 240);
  doc.setDrawColor(230, 218, 202);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');

  doc.setTextColor(192, 86, 52); // Terracotta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('DATOS DEL COMPRADOR', margin + 5, y + 6);

  doc.setTextColor(56, 43, 35);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Cliente:`, margin + 5, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(tx.customerName, margin + 20, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.text(`Correo:`, margin + 5, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.text(tx.customerEmail, margin + 20, y + 19);

  // Status Chip
  doc.setFillColor(220, 245, 225);
  doc.roundedRect(pageWidth - margin - 35, y + 4, 30, 7, 2, 2, 'F');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PAGADO', pageWidth - margin - 20, y + 8.5, { align: 'center' });

  y += 32;

  // --- ITEMS TABLE HEADER ---
  doc.setFillColor(192, 86, 52); // Terracotta table header
  doc.rect(margin, y, contentWidth, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  const colX = {
    item: margin + 4,
    desc: margin + 25,
    qty: margin + 105,
    unit: margin + 125,
    total: pageWidth - margin - 4,
  };

  doc.text('CÓDIGO', colX.item, y + 5.5);
  doc.text('DESCRIPCIÓN DE LA PIEZA ARTESANAL', colX.desc, y + 5.5);
  doc.text('CANT.', colX.qty, y + 5.5, { align: 'center' });
  doc.text('PRECIO UNIT.', colX.unit, y + 5.5, { align: 'right' });
  doc.text('SUBTOTAL', colX.total, y + 5.5, { align: 'right' });

  y += 8;

  // --- TABLE ROWS ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const items = tx.items && tx.items.length > 0
    ? tx.items
    : [
        {
          referenceCode: 'REF-ART',
          title: tx.productTitle,
          price: Math.round(tx.amount / (tx.quantity || 1)),
          quantity: tx.quantity || 1,
        },
      ];

  items.forEach((item, index) => {
    // Alternating row background
    if (index % 2 === 1) {
      doc.setFillColor(252, 250, 246);
      doc.rect(margin, y, contentWidth, 8.5, 'F');
    }

    doc.setTextColor(70, 55, 45);
    doc.text(item.referenceCode || `REF-${index + 1}`, colX.item, y + 5.5);
    
    // Truncate title if too long
    const cleanTitle = item.title.length > 44 ? item.title.substring(0, 42) + '...' : item.title;
    doc.text(cleanTitle, colX.desc, y + 5.5);
    
    doc.text(String(item.quantity), colX.qty, y + 5.5, { align: 'center' });
    doc.text(formatCurrency(item.price), colX.unit, y + 5.5, { align: 'right' });
    doc.text(formatCurrency(item.price * item.quantity), colX.total, y + 5.5, { align: 'right' });

    // Subtle row line
    doc.setDrawColor(235, 226, 215);
    doc.line(margin, y + 8.5, pageWidth - margin, y + 8.5);

    y += 8.5;
  });

  y += 6;

  // --- TOTALS SUMMARY BOX (Right aligned) ---
  const summaryWidth = 75;
  const summaryX = pageWidth - margin - summaryWidth;

  doc.setFillColor(250, 246, 240);
  doc.setDrawColor(222, 155, 39);
  doc.roundedRect(summaryX, y, summaryWidth, 26, 2, 2, 'FD');

  doc.setTextColor(90, 75, 65);
  doc.setFontSize(8.5);
  doc.text('Subtotal:', summaryX + 5, y + 7);
  doc.text(formatCurrency(tx.amount), summaryX + summaryWidth - 5, y + 7, { align: 'right' });

  doc.text('Envío Artesanal:', summaryX + 5, y + 13);
  doc.setTextColor(22, 101, 52);
  doc.text('Gratis ($0)', summaryX + summaryWidth - 5, y + 13, { align: 'right' });

  doc.setDrawColor(215, 200, 185);
  doc.line(summaryX + 5, y + 16.5, summaryX + summaryWidth - 5, y + 16.5);

  doc.setTextColor(192, 86, 52); // Terracotta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('TOTAL FACTURA:', summaryX + 5, y + 22);
  doc.text(formatCurrency(tx.amount), summaryX + summaryWidth - 5, y + 22, { align: 'right' });

  y += 35;

  // --- ARTISANAL WARM MESSAGE BANNER ---
  doc.setFillColor(253, 247, 236); // Soft mustard ecru
  doc.setDrawColor(222, 155, 39);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

  doc.setTextColor(180, 115, 20); // Mustard gold dark
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('¡Gracias por apoyar el arte y la tradición del crochet colombiano!', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(85, 70, 60);
  doc.setFontSize(8);
  doc.text(
    'Cada pieza ha sido tejida a mano con hilos 100% naturales, dedicación y calidez. Tu compra apoya',
    margin + 6,
    y + 12
  );
  doc.text(
    'directamente el sustento de artesanas y maestras tejedoras locales.',
    margin + 6,
    y + 16.5
  );

  // --- FOOTER NOTE ---
  const footerY = 282;
  doc.setDrawColor(210, 195, 180);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(7.5);
  doc.setTextColor(140, 125, 115);
  doc.text(
    'Factura de venta expedida por Hilos de Sol · Soporte: juanjosequinteroreyes8@gmail.com · (+57) 301 513 7667',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  doc.text(
    `Documento digital comprobatorio de la transacción ${tx.orderNumber} emitido el ${tx.date}.`,
    pageWidth / 2,
    footerY + 4,
    { align: 'center' }
  );

  return doc;
}

export function downloadInvoicePDF(tx: Transaction): void {
  const doc = generateInvoicePDF(tx);
  const fileName = `Factura_${tx.orderNumber}_Hilos_de_Sol.pdf`;
  doc.save(fileName);
}
