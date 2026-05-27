import PDFDocument from 'pdfkit';

/**
 * PdfService — Generates PDF documents for the Onion ERP platform.
 * Supports: Sales Invoice, Quotation, Packing List, Export Proforma Invoice.
 */
class PdfService {
  /**
   * Create a new PDFDocument and pipe it to the Express Response.
   * @param {import('express').Response} res
   * @param {string} filename
   * @returns {PDFDocument}
   */
  static _createDoc(res, filename) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);
    return doc;
  }

  /**
   * Render a common page header with company branding.
   * @param {PDFDocument} doc
   * @param {string} title
   */
  static _header(doc, title) {
    doc
      .fillColor('#1a1a2e')
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('OnionERP', 50, 50)
      .fillColor('#4a4a6a')
      .fontSize(11)
      .font('Helvetica')
      .text('Export-Import ERP for Dehydrated Food Products', 50, 76);

    doc
      .fillColor('#e63946')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(title, { align: 'right' });

    doc
      .moveDown(0.5)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#e63946')
      .lineWidth(2)
      .stroke();

    doc.moveDown(1);
  }

  /**
   * Render two-column key–value info block.
   * @param {PDFDocument} doc
   * @param {Object} left   - { label: value }
   * @param {Object} right  - { label: value }
   */
  static _infoBlock(doc, left, right) {
    const startY = doc.y;
    const leftX = 50;
    const rightX = 300;

    let y = startY;
    Object.entries(left).forEach(([label, value]) => {
      doc.fillColor('#666').fontSize(9).font('Helvetica').text(label, leftX, y);
      doc.fillColor('#111').fontSize(10).font('Helvetica-Bold').text(String(value || 'N/A'), leftX, y + 12);
      y += 30;
    });

    y = startY;
    Object.entries(right).forEach(([label, value]) => {
      doc.fillColor('#666').fontSize(9).font('Helvetica').text(label, rightX, y);
      doc.fillColor('#111').fontSize(10).font('Helvetica-Bold').text(String(value || 'N/A'), rightX, y + 12);
      y += 30;
    });

    doc.y = Math.max(doc.y, y);
    doc.moveDown(1);
  }

  /**
   * Render a styled items table.
   * @param {PDFDocument} doc
   * @param {Array<{name,qty,rate,amount}>} items
   * @param {string} currency   - e.g. "₹" or "$"
   */
  static _itemsTable(doc, items, currency = '₹') {
    const col = { no: 50, name: 80, qty: 310, rate: 370, amount: 450 };
    const rowH = 22;
    let y = doc.y + 8;

    // Header row
    doc
      .fillColor('#1a1a2e')
      .rect(50, y, 495, rowH)
      .fill();

    doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold');
    doc.text('#', col.no + 2, y + 7);
    doc.text('Product / Description', col.name, y + 7);
    doc.text('Qty', col.qty, y + 7);
    doc.text(`Rate (${currency})`, col.rate, y + 7);
    doc.text(`Amount (${currency})`, col.amount, y + 7);

    y += rowH;

    items.forEach((item, idx) => {
      const bg = idx % 2 === 0 ? '#f8f9fa' : '#ffffff';
      doc.fillColor(bg).rect(50, y, 495, rowH).fill();
      doc.fillColor('#333').fontSize(9).font('Helvetica');
      doc.text(String(idx + 1), col.no + 2, y + 7);
      doc.text(item.name || item.product?.name || 'Product', col.name, y + 7, { width: 220 });
      doc.text(String(item.quantity ?? item.qty ?? 0), col.qty, y + 7);
      doc.text((item.rate || 0).toFixed(2), col.rate, y + 7);
      doc.text((item.amount || 0).toFixed(2), col.amount, y + 7);
      y += rowH;
    });

    doc.y = y + 4;
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#ccc')
      .lineWidth(0.5)
      .stroke();

    doc.moveDown(0.5);
  }

  /**
   * Render totals block (subtotal, discount, tax, grand total).
   * @param {PDFDocument} doc
   * @param {number} subtotal
   * @param {number} discount
   * @param {number} gst
   * @param {string} currency
   */
  static _totals(doc, subtotal, discount, gst, currency = '₹') {
    const right = 545;
    const labelX = 380;
    const valueX = 460;

    const lines = [
      ['Subtotal', subtotal],
      ['Discount', -discount],
      ['GST / Tax', gst],
    ];

    lines.forEach(([label, val]) => {
      doc
        .fillColor('#555').fontSize(9).font('Helvetica')
        .text(label, labelX, doc.y)
        .text(`${currency}${Math.abs(val).toFixed(2)}`, valueX, doc.y - 12, { width: 80, align: 'right' });
      doc.moveDown(0.4);
    });

    const grand = subtotal - discount + gst;
    doc
      .fillColor('#1a1a2e')
      .rect(labelX - 5, doc.y, right - labelX + 5, 24)
      .fill();
    doc
      .fillColor('#fff').fontSize(11).font('Helvetica-Bold')
      .text('Grand Total', labelX, doc.y + 6)
      .text(`${currency}${grand.toFixed(2)}`, valueX, doc.y - 15, { width: 80, align: 'right' });

    doc.moveDown(2);
  }

  /**
   * Render a simple footer.
   * @param {PDFDocument} doc
   */
  static _footer(doc) {
    doc
      .fillColor('#999')
      .fontSize(8)
      .font('Helvetica')
      .text(
        'Generated by OnionERP Platform | This is a computer-generated document.',
        50,
        doc.page.height - 60,
        { align: 'center', width: 495 }
      );
  }

  // ─────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────

  /**
   * Generate a Sales Invoice PDF.
   * @param {import('express').Response} res
   * @param {Object} order   - Populated SalesOrder document
   */
  static generateInvoice(res, order) {
    const doc = PdfService._createDoc(res, `invoice-${order.orderNo || order._id}.pdf`);

    PdfService._header(doc, 'TAX INVOICE');
    PdfService._infoBlock(
      doc,
      {
        'Invoice No': order.invoiceNo || order.orderNo,
        'Customer': order.customer?.name,
        'Billing Address': order.customer?.billingAddress,
        'GSTIN': order.customer?.gst || 'N/A',
      },
      {
        'Date': new Date(order.createdAt).toLocaleDateString('en-IN'),
        'Status': order.status,
        'Payment Status': order.paymentStatus,
        'Payment Terms': order.customer?.paymentTerms || 'N/A',
      }
    );

    PdfService._itemsTable(doc, order.items || []);
    PdfService._totals(doc, order.subtotal || 0, order.discount || 0, order.gstAmount || 0);
    PdfService._footer(doc);

    doc.end();
  }

  /**
   * Generate a Quotation PDF.
   * @param {import('express').Response} res
   * @param {Object} order   - SalesOrder / ExportOrder document
   */
  static generateQuotation(res, order) {
    const doc = PdfService._createDoc(res, `quotation-${order.orderNo || order._id}.pdf`);

    PdfService._header(doc, 'QUOTATION');
    PdfService._infoBlock(
      doc,
      {
        'Quotation No': order.quotation || order.orderNo,
        'Customer': order.customer?.name,
        'Country': order.customer?.country || 'India',
      },
      {
        'Date': new Date(order.createdAt).toLocaleDateString('en-IN'),
        'Valid Until': new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-IN'),
        'Terms': order.customer?.paymentTerms || 'Advance',
      }
    );

    const currency = order.currency || '₹';
    PdfService._itemsTable(doc, order.items || [], currency);
    PdfService._totals(doc, order.subtotal || 0, order.discount || 0, order.gstAmount || 0, currency);

    doc
      .fillColor('#333')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Terms & Conditions:', 50, doc.y)
      .font('Helvetica')
      .fillColor('#555')
      .fontSize(9)
      .text('1. Prices are subject to change without prior notice.\n2. Delivery in 7–14 working days.\n3. Payment due as per agreed terms.', { indent: 10 });

    PdfService._footer(doc);
    doc.end();
  }

  /**
   * Generate a Packing List PDF (for export shipments).
   * @param {import('express').Response} res
   * @param {Object} exportOrder   - Populated ExportOrder document
   */
  static generatePackingList(res, exportOrder) {
    const doc = PdfService._createDoc(res, `packing-list-${exportOrder.orderNo || exportOrder._id}.pdf`);

    PdfService._header(doc, 'PACKING LIST');
    PdfService._infoBlock(
      doc,
      {
        'Export Order No': exportOrder.orderNo,
        'Buyer': exportOrder.customer?.name,
        'Destination': exportOrder.destination || exportOrder.customer?.country,
        'Container No': exportOrder.containerNo || 'N/A',
      },
      {
        'Date': new Date(exportOrder.createdAt).toLocaleDateString('en-IN'),
        'Port of Loading': exportOrder.portOfLoading || 'N/A',
        'Port of Discharge': exportOrder.portOfDischarge || 'N/A',
        'Vessel / Flight': exportOrder.vessel || 'N/A',
      }
    );

    PdfService._itemsTable(doc, exportOrder.items || [], exportOrder.currency || '$');
    PdfService._totals(
      doc,
      exportOrder.subtotal || 0,
      exportOrder.discount || 0,
      0,
      exportOrder.currency || '$'
    );

    doc
      .fillColor('#1a1a2e').fontSize(10).font('Helvetica-Bold')
      .text('Shipping Marks & Numbers:', 50, doc.y)
      .font('Helvetica').fillColor('#555').fontSize(9)
      .text(exportOrder.shippingMarks || 'As per agreement.', { indent: 10 });

    PdfService._footer(doc);
    doc.end();
  }
}

export default PdfService;
