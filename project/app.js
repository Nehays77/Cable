// Main application logic

// Store current calculation data for PDF export
let currentCalculationData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Populate constants tables
    populateMaterialConstantsTable();
    populateThermalConstantsTable();
    populateInsulationConstantsTable();
    updateMaterialConstantsDisplay();
    
    // Set up navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            switchPage(targetPage);
            
            // Update active state
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Set up calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', handleCalculate);

    const materialSelect = document.getElementById('material');
    if (materialSelect) {
        materialSelect.addEventListener('change', updateMaterialConstantsDisplay);
    }
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
    
    // Set up PDF download button
    const pdfBtn = document.getElementById('downloadPdfBtn');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            if (!currentCalculationData) {
                alert('Please run a calculation before downloading the PDF report.');
                return;
            }
            try {
                generatePDF(currentCalculationData);
            } catch (err) {
                console.error('PDF generation failed:', err);
                alert('Unable to generate PDF. Please check the console for details.');
            }
        });
    }
    
    // Set up Word download button
    const wordBtn = document.getElementById('downloadWordBtn');
    if (wordBtn) {
        wordBtn.addEventListener('click', function() {
            if (currentCalculationData) {
                generateWord(currentCalculationData);
            }
        });
    }
    
    // Allow Enter key to trigger calculation
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleCalculate();
            }
        });
    });

    resetDisplayPanels();
});

function switchPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function handleCalculate() {
    try {
        // Get all input values
        const voltage = parseFloat(document.getElementById('voltage').value); // in kV
        const conductorAreaValue = document.getElementById('conductorArea').value;
        const conductorArea = conductorAreaValue ? parseFloat(conductorAreaValue) : null;
        const material = document.getElementById('material').value;
        const shortCircuitCurrent = parseFloat(document.getElementById('shortCircuitCurrent').value); // in kA
        const time = parseFloat(document.getElementById('time').value); // in seconds
        const initialTemp = parseFloat(document.getElementById('initialTemp').value) || 90; // °C
        const finalTemp = parseFloat(document.getElementById('finalTemp').value) || 250; // °C
        const betaValue = parseFloat(document.getElementById('betaValue').value);
        const kValue = parseFloat(document.getElementById('kValue').value);
        
        // Validate required fields
        if (!voltage || !material || !shortCircuitCurrent || !time) {
            showError('Please fill in all required fields (marked with *)');
            return;
        }

        if (isNaN(betaValue) || isNaN(kValue)) {
            showError('Please select valid β and K values.');
            return;
        }
        
        if (voltage <= 0) {
            showError('Voltage must be greater than 0');
            return;
        }
        
        if (time <= 0) {
            showError('Time must be greater than 0');
            return;
        }
        
        if (shortCircuitCurrent <= 0) {
            showError('Short circuit current must be greater than 0');
            return;
        }
        
        // Validate conductor area if provided
        if (conductorArea !== null && conductorArea <= 0) {
            showError('Conductor area must be greater than 0');
            return;
        }
        
        // Convert kA to A
        const shortCircuitCurrentA = shortCircuitCurrent * 1000;
        
        // Prepare calculation inputs
        const calculationInputs = {
            material: material,
            conductorArea: conductorArea, // in mm² (can be null)
            shortCircuitCurrent: shortCircuitCurrentA, // in A
            time: time, // in seconds
            initialTemp: initialTemp, // in °C
            finalTemp: finalTemp, // in °C
            voltage: voltage, // in kV
            betaOverride: betaValue,
            kOverride: kValue
        };
        
        // Perform calculation
        const results = performConductorCalculation(calculationInputs);
        
        // Add time and voltage to results for display
        results.time = time;
        results.voltage = voltage;
        
        // Store calculation data for PDF export
        currentCalculationData = {
            inputs: {
                material: material,
                conductorArea: conductorArea,
                shortCircuitCurrent: shortCircuitCurrent, // in kA
                time: time,
                initialTemp: initialTemp,
                finalTemp: finalTemp,
                voltage: voltage, // in kV
                beta: betaValue,
                K: kValue
            },
            results: results
        };
        
        // Display results
        displayResults(results);
        
    } catch (error) {
        showError('Calculation error: ' + error.message);
        console.error(error);
    }
}

function handleReset() {
    const fieldsToClear = ['voltage', 'conductorArea', 'material', 'shortCircuitCurrent', 'time'];
    fieldsToClear.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0;
            } else {
                element.value = '';
            }
        }
    });
    
    document.getElementById('initialTemp').value = 90;
    document.getElementById('finalTemp').value = 250;

    const betaInput = document.getElementById('betaValue');
    if (betaInput) {
        betaInput.value = '';
    }

    const kInput = document.getElementById('kValue');
    if (kInput) {
        kInput.value = '';
    }
    
    currentCalculationData = null;
    resetDisplayPanels();
    updateMaterialConstantsDisplay();
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const cableSelectionText = document.getElementById('cableSelectionText');
    const analysisCards = document.getElementById('analysisCards');
    const analysisStatus = document.getElementById('analysisStatus');
    const time = results.time || 0;
    
    let html = `
        <div class="result-item">
            <h4>Voltage</h4>
            <div class="result-value">
                ${formatNumber(results.voltage || 0, 1)} <span class="result-unit">kV</span>
            </div>
            <div class="result-notes">input value</div>
        </div>
        
        <div class="result-item">
            <h4>Short Circuit Current</h4>
            <div class="result-value">
                ${formatNumber(results.shortCircuitCurrent / 1000, 2)} <span class="result-unit">kA</span>
            </div>
            <div class="result-notes">input value</div>
        </div>
        
        <div class="result-item">
            <h4>Required Area S</h4>
            <div class="result-value">
                ${formatNumber(results.requiredArea, 2)} <span class="result-unit">mm²</span>
            </div>
            <div class="result-notes">minimum required area</div>
        </div>
    `;
    
    // Show adiabatic current and conductor area comparison only if conductor area is provided
    if (results.conductorArea !== null && results.conductorArea !== undefined) {
        html += `
            <div class="result-item">
                <h4>Adiabatic Current I<sub>AD</sub></h4>
                <div class="result-value">
                    ${formatNumber(results.adiabaticCurrent)} <span class="result-unit">A</span>
                </div>
                <div class="result-notes">base current for selected conductor</div>
            </div>
            
            <div class="result-item">
                <h4>Safety Factor</h4>
                <div class="result-value">
                    ${formatNumber(results.safetyFactor, 2)} <span class="result-unit">—</span>
                </div>
                <div class="result-notes">I_AD / I_short_circuit</div>
            </div>
            
            <div class="result-item">
                <h4>Selected Conductor Area</h4>
                <div class="result-value">
                    ${formatNumber(results.conductorArea)} <span class="result-unit">mm²</span>
                </div>
                <div class="result-notes">input value</div>
            </div>
            
            <div class="result-item ${results.isAdequate ? 'result-adequate' : 'result-inadequate'}">
                <h4>Conductor Adequacy</h4>
                <div class="result-value">
                    ${results.isAdequate ? '✓ ADEQUATE' : '✗ INADEQUATE'}
                </div>
                <div class="result-notes">${results.isAdequate ? 'Conductor can handle the short circuit current' : 'Conductor is too small for the short circuit current'}</div>
            </div>
        `;
        
        // Generate cable selection analysis text
        let analysisText = '';
        
        if (results.isAdequate) {
            analysisText = `✓ CABLE CAN BE CHOSEN\n\n`;
            analysisText += `The selected conductor cross-sectional area of ${formatNumber(results.conductorArea, 2)} mm² is SUFFICIENT for the application.\n\n`;
            analysisText += `Comparison:\n`;
            analysisText += `• Selected Area: ${formatNumber(results.conductorArea, 2)} mm²\n`;
            analysisText += `• Required Area: ${formatNumber(results.requiredArea, 2)} mm²\n`;
            analysisText += `• Margin: ${formatNumber(results.conductorArea - results.requiredArea, 2)} mm² (${formatNumber(((results.conductorArea - results.requiredArea) / results.requiredArea * 100), 1)}% above minimum)\n\n`;
            analysisText += `The conductor can safely handle the short circuit current of ${formatNumber(results.shortCircuitCurrent / 1000, 2)} kA for ${formatNumber(results.time || 0, 2)} seconds.`;
        } else {
            analysisText = `✗ CABLE CANNOT BE CHOSEN\n\n`;
            analysisText += `The selected conductor cross-sectional area of ${formatNumber(results.conductorArea, 2)} mm² is INSUFFICIENT for the application.\n\n`;
            analysisText += `Comparison:\n`;
            analysisText += `• Selected Area: ${formatNumber(results.conductorArea, 2)} mm²\n`;
            analysisText += `• Required Area: ${formatNumber(results.requiredArea, 2)} mm²\n`;
            analysisText += `• Shortfall: ${formatNumber(results.requiredArea - results.conductorArea, 2)} mm² (${formatNumber(((results.requiredArea - results.conductorArea) / results.requiredArea * 100), 1)}% below minimum)\n\n`;
            analysisText += `SUGGESTED STANDARD SIZE:\n`;
            analysisText += `The next standard conductor size that meets the requirement is ${formatNumber(results.suggestedStandardSize)} mm².\n\n`;
            analysisText += `Please select a conductor with cross-sectional area of at least ${formatNumber(results.requiredArea, 2)} mm² (recommended: ${formatNumber(results.suggestedStandardSize)} mm²) to safely handle the short circuit current of ${formatNumber(results.shortCircuitCurrent / 1000, 2)} kA for ${formatNumber(results.time || 0, 2)} seconds.`;
        }
        
        // Display the analysis text
        if (cableSelectionText) {
            cableSelectionText.textContent = analysisText;
        }
    } else {
        // If no conductor area provided, still show suggested size
        let analysisText = `REQUIRED AREA ANALYSIS\n\n`;
        analysisText += `Based on the input parameters, the minimum required conductor cross-sectional area is ${formatNumber(results.requiredArea, 2)} mm².\n\n`;
        analysisText += `SUGGESTED STANDARD SIZE:\n`;
        analysisText += `The recommended standard conductor size is ${formatNumber(results.suggestedStandardSize)} mm².\n\n`;
        analysisText += `To verify if a specific conductor can be used, please enter the conductor cross-sectional area in the input field and recalculate.`;
        
        if (cableSelectionText) {
            cableSelectionText.textContent = analysisText;
        }
    }
    
    resultsDiv.innerHTML = html;

    // Reveal IEC 949 formula section after a successful calculation
    const formulaSection = document.getElementById('formulaSection');
    if (formulaSection) {
        formulaSection.style.display = 'block';
    }
    
    // Show PDF download button
    const pdfButtonContainer = document.getElementById('pdfButtonContainer');
    if (pdfButtonContainer) {
        pdfButtonContainer.style.display = 'block';
    }
    
    // Populate analysis cards
    if (analysisCards) {
        const cards = [];
        
        cards.push(`
            <div class="analysis-card">
                <span class="label">Required Area</span>
                <span class="value">${formatNumber(results.requiredArea, 2)} mm²</span>
                <span class="hint">Minimum cross section</span>
            </div>
        `);
        
        cards.push(`
            <div class="analysis-card">
                <span class="label">Fault Duration</span>
                <span class="value">${formatNumber(time, 2)} s</span>
                <span class="hint">Input parameter</span>
            </div>
        `);
        
        cards.push(`
            <div class="analysis-card">
                <span class="label">Short Circuit Current</span>
                <span class="value">${formatNumber(results.shortCircuitCurrent / 1000, 2)} kA</span>
                <span class="hint">Converted to kA</span>
            </div>
        `);
        
        cards.push(`
            <div class="analysis-card">
                <span class="label">Recommended Standard</span>
                <span class="value">${formatNumber(results.suggestedStandardSize)} mm²</span>
                <span class="hint">Next available size</span>
            </div>
        `);
        
        if (results.conductorArea !== null && results.conductorArea !== undefined) {
            cards.push(`
                <div class="analysis-card">
                    <span class="label">Selected Area</span>
                    <span class="value">${formatNumber(results.conductorArea, 2)} mm²</span>
                    <span class="hint">Provided by user</span>
                </div>
            `);
        }
        
        if (results.adiabaticCurrent !== undefined) {
            cards.push(`
                <div class="analysis-card">
                    <span class="label">Adiabatic Current</span>
                    <span class="value">${formatNumber(results.adiabaticCurrent)} A</span>
                    <span class="hint">Capacity for selected conductor</span>
                </div>
            `);
        }
        
        if (results.safetyFactor !== undefined) {
            cards.push(`
                <div class="analysis-card">
                    <span class="label">Safety Factor</span>
                    <span class="value">${formatNumber(results.safetyFactor, 2)}</span>
                    <span class="hint">I_AD / I_SC</span>
                </div>
            `);
        }
        
        analysisCards.innerHTML = cards.join('');
    }
    
    if (analysisStatus) {
        const hasSelection = results.conductorArea !== null && results.conductorArea !== undefined;
        let statusTagClass = 'warn';
        let statusTagText = 'Pending input';
        let description = 'Provide a conductor cross section to evaluate adequacy.';
        
        if (hasSelection) {
            if (results.isAdequate) {
                statusTagClass = 'ok';
                statusTagText = 'Adequate';
                description = 'Selected conductor satisfies the required cross-sectional area.';
            } else {
                statusTagClass = 'warn';
                statusTagText = 'Inadequate';
                description = 'Selected conductor is undersized. Consider the recommended standard.';
            }
        }
        
        analysisStatus.innerHTML = `
            <span class="status-label">Cable readiness</span>
            <span class="status-tag ${statusTagClass}">${statusTagText}</span>
            <p>${description}</p>
        `;
    }
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="result-item" style="border-left-color: #e74c3c; background: #fee;">
            <h4 style="color: #e74c3c;">Error</h4>
            <div style="color: #c0392b;">${message}</div>
        </div>
    `;
    
    // Hide PDF button and cable selection box on error
    const pdfButtonContainer = document.getElementById('pdfButtonContainer');
    if (pdfButtonContainer) {
        pdfButtonContainer.style.display = 'none';
    }
    
    const analysisCards = document.getElementById('analysisCards');
    if (analysisCards) {
        analysisCards.innerHTML = `<p class="placeholder">Fix the highlighted errors on the Calculator page and recalculate to see analysis.</p>`;
    }
    
    const analysisStatus = document.getElementById('analysisStatus');
    if (analysisStatus) {
        analysisStatus.innerHTML = `
            <span class="status-label">Cable readiness</span>
            <span class="status-tag warn">Error</span>
            <p>${message}</p>
        `;
    }
    
    const cableSelectionText = document.getElementById('cableSelectionText');
    if (cableSelectionText) {
        cableSelectionText.textContent = 'Unable to generate analysis. Please correct the inputs and try again.';
    }
    
    // Hide formula section on error
    const formulaSection = document.getElementById('formulaSection');
    if (formulaSection) {
        formulaSection.style.display = 'none';
    }
    
    currentCalculationData = null;
}

function resetDisplayPanels() {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `
            <p class="placeholder">Fill in the inputs and click Calculate to see results</p>
        `;
    }
    
    const pdfButtonContainer = document.getElementById('pdfButtonContainer');
    if (pdfButtonContainer) {
        pdfButtonContainer.style.display = 'none';
    }
    
    const analysisCards = document.getElementById('analysisCards');
    if (analysisCards) {
        analysisCards.innerHTML = `<p class="placeholder">Cable metrics and adequacy summary will be shown here.</p>`;
    }
    
    const analysisStatus = document.getElementById('analysisStatus');
    if (analysisStatus) {
        analysisStatus.innerHTML = `
            <span class="status-label">Cable readiness</span>
            <span class="status-tag warn">Pending input</span>
            <p>Run a calculation on the Calculator page to populate this view.</p>
        `;
    }
    
    const cableSelectionText = document.getElementById('cableSelectionText');
    if (cableSelectionText) {
        cableSelectionText.textContent = 'Run a calculation to generate the cable selection narrative.';
    }

    // Hide formula section on reset
    const formulaSection = document.getElementById('formulaSection');
    if (formulaSection) {
        formulaSection.style.display = 'none';
    }
}

function formatNumber(num, decimals = 2) {
    if (num >= 1000) {
        return num.toLocaleString('en-US', { maximumFractionDigits: decimals });
    }
    return num.toFixed(decimals);
}

function updateMaterialConstantsDisplay() {
    const materialSelect = document.getElementById('material');
    const betaInput = document.getElementById('betaValue');
    const kInput = document.getElementById('kValue');

    if (!materialSelect || !betaInput || !kInput) {
        return;
    }

    const material = materialSelect.value;
    if (!material) {
        betaInput.value = '';
        kInput.value = '';
        betaInput.placeholder = 'Select a material to populate';
        kInput.placeholder = 'Select a material to populate';
        return;
    }

    const constants = getMaterialConstants(material);
    if (!constants) {
        betaInput.value = '';
        kInput.value = '';
        betaInput.placeholder = 'Unavailable for this material';
        kInput.placeholder = 'Unavailable for this material';
        return;
    }

    betaInput.value = constants.beta;
    kInput.value = constants.K;
}

