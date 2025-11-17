// Table I: Material Constants (IEC 949)
const MATERIAL_CONSTANTS = {
    copper: {
        K: 226,
        beta: 234.5,
        sigma1: 3.45e6,  // J/K·m³
        rho20: 1.7241e-8  // Ω·m
    },
    aluminium: {
        K: 148,
        beta: 228,
        sigma1: 2.5e6,
        rho20: 2.8264e-8
    },
    lead: {
        K: 41,
        beta: 230,
        sigma1: 1.45e6,
        rho20: 21.4e-8
    },
    steel: {
        K: 78,
        beta: 202,
        sigma1: 3.8e6,
        rho20: 13.8e-8
    },
    bronze: {
        K: 180,
        beta: 313,
        sigma1: 3.4e6,
        rho20: 3.5e-8
    }
};

// Table II: Thermal Constants of Media (IEC 949)
const THERMAL_CONSTANTS = {
    xlpe: {
        rho: 3.5,  // K·m/W
        sigma: 2.4e6  // J/K·m³
    },
    pvc: {
        rho: 5.0,
        sigma: 1.7e6
    },
    epr: {
        rho: 4.25,  // Average of 3.5-5.0 range
        sigma: 2.0e6
    },
    paper: {
        rho: 5.5,  // Average of 5.0-6.0 range
        sigma: 2.0e6
    },
    oil: {
        rho: 7.0,
        sigma: 1.7e6
    },
    bitumen: {
        rho: 5.0,  // Approximate value
        sigma: 1.7e6
    }
};

// Function to get material constants
function getMaterialConstants(material) {
    return MATERIAL_CONSTANTS[material] || null;
}

// Function to get thermal constants
function getThermalConstants(medium) {
    return THERMAL_CONSTANTS[medium] || null;
}

// Function to populate material constants table
function populateMaterialConstantsTable() {
    const tbody = document.getElementById('materialConstantsBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const rows = [
        { heading: 'a) Conductors' },
        { name: 'Copper', key: 'copper' },
        { name: 'Aluminium', key: 'aluminium' },
        { heading: 'b) Sheaths, screens and armour' },
        { name: 'Lead or lead alloy', key: 'lead' },
        { name: 'Steel', key: 'steel' },
        { name: 'Bronze', key: 'bronze' },
        { name: 'Aluminium (sheath)', key: 'aluminium' }
    ];
    
    rows.forEach(rowData => {
        const row = document.createElement('tr');
        
        if (rowData.heading) {
            row.classList.add('table-heading-row');
            row.innerHTML = `<td colspan="5">${rowData.heading}</td>`;
        } else {
            const constants = MATERIAL_CONSTANTS[rowData.key];
            row.innerHTML = `
                <td><strong>${rowData.name}</strong></td>
                <td>${constants.K}</td>
                <td>${constants.beta}</td>
                <td>${formatScientific(constants.sigma1)}</td>
                <td>${formatScientific(constants.rho20)}</td>
            `;
        }
        tbody.appendChild(row);
    });
}

// Function to populate thermal constants table
function populateThermalConstantsTable() {
    const tbody = document.getElementById('thermalConstantsBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const mediaRows = [
        { heading: 'Insulating materials' },
        { name: 'Impregnated paper in solid type cables', rho: '6.0', sigma: '2.0 &times; 10<sup>6</sup>' },
        { name: 'Impregnated paper in oil-filled cables', rho: '5.0', sigma: '2.0 &times; 10<sup>6</sup>' },
        { name: 'Oil', rho: '7.0', sigma: '1.7 &times; 10<sup>6</sup>' },
        { name: 'PE', rho: '7.0', sigma: '1.7 &times; 10<sup>6</sup>' },
        { name: 'XLPE', rho: '3.5', sigma: '2.4 &times; 10<sup>6</sup>' },
        { name: 'Polyvinyl chloride (≤ 3 kV)', rho: '5.0', sigma: '1.7 &times; 10<sup>6</sup>' },
        { name: 'Polyvinyl chloride (> 3 kV)', rho: '6.0', sigma: '1.7 &times; 10<sup>6</sup>' },
        { name: 'EPR (≤ 3 kV)', rho: '3.5', sigma: '2.0 &times; 10<sup>6</sup>' },
        { name: 'EPR (> 3 kV)', rho: '5.0', sigma: '2.0 &times; 10<sup>6</sup>' },
        { name: 'Butyl rubber', rho: '5.0', sigma: '2.0 &times; 10<sup>6</sup>' },
        { name: 'Rubber (natural)', rho: '5.0', sigma: '2.0 &times; 10<sup>6</sup>' },
        { heading: 'Protective coverings' },
        { name: 'Compounded jute and fibrous materials', rho: '6.0', sigma: '2.0 &times; 10<sup>6</sup>' },
        { name: 'Rubber sandwich protection', rho: '6.0', sigma: '2.0 &times; 10<sup>6</sup>' },
        { name: 'Polychloroprene', rho: '6.0', sigma: '2.0 &times; 10<sup>6</sup>' },
        { name: 'PVC (corrugated aluminium sheath)', rho: '6.0', sigma: '1.7 &times; 10<sup>6</sup>' },
        { name: 'PE (corrugated aluminium sheath)', rho: '3.5', sigma: '2.4 &times; 10<sup>6</sup>' },
        { heading: 'Other components' },
        { name: 'Semi-conducting XLPE or PE', rho: '2.5', sigma: '2.4 &times; 10<sup>6</sup>' },
        { name: 'Semi-conducting EPR', rho: '3.5', sigma: '2.1 &times; 10<sup>6</sup>' }
    ];
    
    mediaRows.forEach(item => {
        const row = document.createElement('tr');
        if (item.heading) {
            row.classList.add('table-heading-row');
            row.innerHTML = `<td colspan="3">${item.heading}</td>`;
        } else {
            row.innerHTML = `
                <td><strong>${item.name}</strong></td>
                <td>${item.rho}</td>
                <td>${item.sigma}</td>
            `;
        }
        tbody.appendChild(row);
    });
}

// Table III constants
const INSULATION_CONSTANTS = [
    { insulation: 'PVC ≤ 3 kV', copperX: 0.29, copperY: 0.06, aluminiumX: 0.40, aluminiumY: 0.08 },
    { insulation: 'PVC &gt; 3 kV', copperX: 0.27, copperY: 0.05, aluminiumX: 0.37, aluminiumY: 0.07 },
    { insulation: 'XLPE', copperX: 0.41, copperY: 0.12, aluminiumX: 0.57, aluminiumY: 0.16 },
    { insulation: 'EPR ≤ 3 kV', copperX: 0.38, copperY: 0.10, aluminiumX: 0.52, aluminiumY: 0.14 },
    { insulation: 'EPR &gt; 3 kV', copperX: 0.32, copperY: 0.07, aluminiumX: 0.44, aluminiumY: 0.10 },
    { insulation: 'Paper (oil-filled)', copperX: 0.45, copperY: 0.14, aluminiumX: 0.62, aluminiumY: 0.20 },
    { insulation: 'Paper (others)', copperX: 0.29, copperY: 0.06, aluminiumX: 0.40, aluminiumY: 0.08 }
];

function populateInsulationConstantsTable() {
    const tbody = document.getElementById('insulationConstantsBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    INSULATION_CONSTANTS.forEach(rowData => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${rowData.insulation}</strong></td>
            <td>${rowData.copperX.toFixed(2)}</td>
            <td>${rowData.copperY.toFixed(2)}</td>
            <td>${rowData.aluminiumX.toFixed(2)}</td>
            <td>${rowData.aluminiumY.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Helper function to format scientific notation
function formatScientific(num) {
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + '×10⁶';
    } else if (num >= 1e-6 && num < 1) {
        return (num / 1e-8).toFixed(1) + '×10⁻⁸';
    }
    return num.toString();
}

