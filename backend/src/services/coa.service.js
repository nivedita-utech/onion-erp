import PDFDocument from 'pdfkit';

/**
 * Generates a Certificate of Analysis (COA) PDF
 * @param {Object} labTest - The lab test data with populated batch and product
 * @returns {PDFDocument}
 */
export const generateCOA = (labTest) => {
  try {
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      bufferPages: true 
    });

    // Header
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('ONION POWDER ERP', 110, 57)
      .fontSize(10)
      .text('Quality Control Department', 110, 80)
      .text('Unit 1, Industrial Area, Onion City', 110, 95)
      .moveDown();

    doc.rect(50, 115, 500, 1).fill('#cccccc');

    // Title
    doc
      .fillColor('#333333')
      .fontSize(16)
      .text('CERTIFICATE OF ANALYSIS (COA)', 50, 140, { align: 'center' })
      .moveDown();

    // Status with safe check
    const status = labTest?.overallStatus || 'Pending';
    const statusColor = (status === 'Pass') ? '#10b981' : '#ef4444';
    
    // Basic Info with fallback
    const startY = 180;
    doc
      .fontSize(10)
      .fillColor('#6b7280')
      .text('Batch ID:', 50, startY)
      .fillColor('#111827')
      .text(labTest?.batch?.batchId || 'N/A', 150, startY)
      
      .fillColor('#6b7280')
      .text('Product:', 50, startY + 20)
      .fillColor('#111827')
      .text(labTest?.batch?.product?.name || 'N/A', 150, startY + 20)
      
      .fillColor('#6b7280')
      .text('Grade:', 50, startY + 40)
      .fillColor('#111827')
      .text(labTest?.profile?.productGrade || 'N/A', 150, startY + 40)
      
      .fillColor('#6b7280')
      .text('Date of Test:', 350, startY)
      .fillColor('#111827')
      .text(labTest?.testDate ? new Date(labTest.testDate).toLocaleDateString() : 'N/A', 450, startY)
      
      .fillColor('#6b7280')
      .text('Report Status:', 350, startY + 20)
      .fillColor(statusColor)
      .text(status.toUpperCase(), 450, startY + 20)
      .fillColor('#333333');

    // Parameters Table Header
    const tableTop = 260;
    doc
      .rect(50, tableTop, 500, 20)
      .fill('#f3f4f6');
    
    doc
      .fillColor('#1f2937')
      .fontSize(10)
      .text('Quality Parameter', 60, tableTop + 5)
      .text('Specific Limit', 250, tableTop + 5)
      .text('Result', 450, tableTop + 5);

    // Parameters Table Rows
    let currentY = tableTop + 25;
    if (labTest?.results && labTest.results.length > 0) {
      labTest.results.forEach((res) => {
        const profileParam = labTest.profile?.parameters?.find(p => p.name === res.parameterName);
        const limitLine = profileParam 
          ? `${profileParam.min ?? '0'} - ${profileParam.max ?? '0'} ${profileParam.unit ?? ''}`
          : 'N/A';

        doc
          .fillColor('#374151')
          .text(res.parameterName || 'N/A', 60, currentY)
          .text(limitLine, 250, currentY)
          .fillColor(res.status === 'Pass' ? '#059669' : '#dc2626')
          .text(`${res.value || '0'} ${profileParam?.unit || ''}`, 450, currentY);
        
        currentY += 20;
      });
    } else {
      doc.fillColor('#9ca3af').text('No characteristic results recorded.', 60, currentY);
      currentY += 20;
    }

    // Microbial Header
    currentY += 10;
    doc
      .rect(50, currentY, 500, 20)
      .fill('#f3f4f6');
    
    doc
      .fillColor('#1f2937')
      .text('Microbiological Test', 60, currentY + 5)
      .text('Max Limit', 250, currentY + 5)
      .text('Result', 450, currentY + 5);

    currentY += 25;
    if (labTest?.microbialResults && labTest.microbialResults.length > 0) {
      labTest.microbialResults.forEach((res) => {
        const profileParam = labTest.profile?.microbialSpecs?.find(p => p.name === res.parameterName);
        const limitLine = profileParam ? profileParam.limit : 'N/A';

        doc
          .fillColor('#374151')
          .text(res.parameterName || 'N/A', 60, currentY)
          .text(limitLine, 250, currentY)
          .fillColor(res.status === 'Pass' ? '#059669' : '#dc2626')
          .text(res.value || 'N/A', 450, currentY);
        
        currentY += 20;
      });
    } else {
      doc.fillColor('#9ca3af').text('No microbial results recorded.', 60, currentY);
      currentY += 20;
    }

    // Footer / Remarks
    doc
      .fillColor('#333333')
      .moveDown(2)
      .text('Remarks:', 50, currentY + 20)
      .fontSize(9)
      .text(labTest?.remarks || 'The batch meets all quality specifications.', 50, currentY + 35)
      .moveDown(4);

    const finalY = doc.y > 700 ? 750 : doc.y + 40;
    doc
      .fontSize(10)
      .text('Authorized Signatory', 400, finalY)
      .text('Quality Assurance Manager', 400, finalY + 15);

    return doc;
  } catch (error) {
    console.error('PDF Generation Service Error:', error);
    throw error;
  }
};
