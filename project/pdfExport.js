// PDF Export functionality using jsPDF

const LOGO_IMAGE =
    'data:image/png;base64,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';

function generatePDF(calculationData) {
    // Ensure jsPDF is available
    if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error('jsPDF library is not loaded. Please check your internet connection and that the jsPDF script tag is reachable.');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Small helper to safely coerce to numbers
    const num = (value, fallback = 0) => {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    };
    
    // Helper function to add a new page if needed
    function checkPageBreak(requiredSpace = 10) {
        if (yPos + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            return true;
        }
        return false;
    }
    
    // Logo Header (do not fail PDF if logo cannot be drawn)
    if (LOGO_IMAGE) {
        try {
            const logoWidth = 70;
            const logoHeight = 23;
            doc.addImage(LOGO_IMAGE, 'PNG', margin, yPos, logoWidth, logoHeight);
            yPos += logoHeight + 4;
        } catch (e) {
            console.warn('PDF logo could not be rendered, continuing without logo:', e);
        }
    }
    
    // Blue line under header
    doc.setDrawColor(173, 216, 230); // Light blue color
    doc.setLineWidth(1);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;
    
    // Title (smaller than Balfour Beatty, larger than content)
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('IEC 949 Conductor Calculator', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Adiabatic Current Calculation Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
    
    // Date
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    doc.setFontSize(10);
    doc.text('Generated: ' + dateStr, pageWidth - margin, yPos, { align: 'right' });
    yPos += 10;
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    // Input Parameters Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Input Parameters', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const inputs = calculationData.inputs || {};
    const materialNames = {
        'copper': 'Copper',
        'aluminium': 'Aluminium',
        'lead': 'Lead',
        'steel': 'Steel',
        'bronze': 'Bronze'
    };
    
    const inputData = [
        ['Voltage:', num(inputs.voltage).toFixed(1) + ' kV'],
        ['Conductor Material:', materialNames[inputs.material] || inputs.material],
        ['Short Circuit Current:', num(inputs.shortCircuitCurrent).toFixed(2) + ' kA'],
        ['Time:', num(inputs.time).toFixed(2) + ' s'],
        ['Initial Temperature:', num(inputs.initialTemp, 90).toFixed(1) + ' °C'],
        ['Final Temperature:', num(inputs.finalTemp, 250).toFixed(1) + ' °C']
    ];
    
    if (inputs.conductorArea !== null && inputs.conductorArea !== undefined) {
        inputData.splice(2, 0, ['Conductor Area:', num(inputs.conductorArea).toFixed(2) + ' mm²']);
    }
    
    inputData.forEach(([label, value]) => {
        checkPageBreak(7);
        doc.setFont(undefined, 'bold');
        doc.text(label, margin + 5, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(value, margin + 70, yPos);
        yPos += 7;
    });
    
    yPos += 5;
    checkPageBreak(15);
    
    // Results Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Calculation Results', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const results = calculationData.results || {};
    
    const resultData = [
        ['Voltage:', num(results.voltage ?? inputs.voltage).toFixed(1) + ' kV'],
        ['Short Circuit Current:', (num(results.shortCircuitCurrent) / 1000).toFixed(2) + ' kA'],
        ['Required Area:', num(results.requiredArea).toFixed(2) + ' mm²'],
        ['Suggested Standard Size:', num(results.suggestedStandardSize).toFixed(0) + ' mm²']
    ];
    
    if (results.conductorArea !== null && results.conductorArea !== undefined) {
        resultData.push(
            ['Adiabatic Current (I_AD):', num(results.adiabaticCurrent).toFixed(2) + ' A'],
            ['Safety Factor:', num(results.safetyFactor, 1).toFixed(2)],
            ['Selected Conductor Area:', num(results.conductorArea).toFixed(2) + ' mm²'],
            ['Conductor Adequacy:', results.isAdequate ? '✓ ADEQUATE' : '✗ INADEQUATE']
        );
    }
    
    resultData.forEach(([label, value]) => {
        checkPageBreak(7);
        doc.setFont(undefined, 'bold');
        doc.text(label, margin + 5, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(value, margin + 70, yPos);
        yPos += 7;
    });
    
    yPos += 10;
    checkPageBreak(10);
    
    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.text('This report is generated based on IEC 949 standard calculations.', 
             pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Generate filename with timestamp
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `IEC949_Conductor_Calculation_${timestamp}.pdf`;
    
    // Save PDF
    doc.save(filename);
}

