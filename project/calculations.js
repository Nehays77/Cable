// Calculation functions based on IEC 949

/**
 * Step A: Calculate Adiabatic Current or Area
 * I_AD = K * S * sqrt(ln((θ_f + β) / (θ_i + β)) / t)
 * or
 * S = (I * sqrt(t)) / (K * sqrt(ln((θ_f + β) / (θ_i + β))))
 */
function calculateAdiabaticCurrent(materialConstants, area, initialTemp, finalTemp, faultDuration) {
    const { K, beta } = materialConstants;
    const numerator = Math.log((finalTemp + beta) / (initialTemp + beta));
    const denominator = faultDuration;
    const sqrtTerm = Math.sqrt(numerator / denominator);
    return K * area * sqrtTerm;
}

function calculateAdiabaticArea(materialConstants, current, initialTemp, finalTemp, faultDuration) {
    const { K, beta } = materialConstants;
    const numerator = Math.log((finalTemp + beta) / (initialTemp + beta));
    const sqrtTerm = Math.sqrt(numerator);
    const denominator = K * sqrtTerm;
    return (current * Math.sqrt(faultDuration)) / denominator;
}

/**
 * Step B: Calculate Non-Adiabatic Factor (ε)
 * M = (F / (δ * 10^-3)) * ((σ_2 + σ_3) / σ_1)
 * ε = 1 + 0.61 * M * sqrt(t) - 0.069 * (M * sqrt(t))^2 + 0.0043 * (M * sqrt(t))^3
 */
function calculateNonAdiabaticFactor(
    thermalContactFactor,
    sheathThickness,
    insideMediumConstants,
    outsideMediumConstants,
    materialConstants,
    faultDuration
) {
    // Calculate M
    const delta = sheathThickness * 1e-3; // Convert mm to m
    const sigma2 = insideMediumConstants.sigma;
    const sigma3 = outsideMediumConstants.sigma;
    const sigma1 = materialConstants.sigma1;
    
    const M = (thermalContactFactor / delta) * ((sigma2 + sigma3) / sigma1);
    
    // Calculate ε
    const MsqrtT = M * Math.sqrt(faultDuration);
    const epsilon = 1 + 
                    0.61 * MsqrtT - 
                    0.069 * Math.pow(MsqrtT, 2) + 
                    0.0043 * Math.pow(MsqrtT, 3);
    
    return epsilon;
}

/**
 * Step C: Calculate Final Permissible Current or Area
 * I_perm = ε * I_AD
 * or
 * S_non = S_AD / ε
 */
function calculatePermissibleCurrent(epsilon, adiabaticCurrent) {
    return epsilon * adiabaticCurrent;
}

function calculatePermissibleArea(epsilon, adiabaticArea) {
    return adiabaticArea / epsilon;
}

/**
 * Main calculation function
 */
function performCalculation(inputs) {
    const {
        material,
        sheathMaterial,
        insideMedium,
        outsideMedium,
        thermalContactFactor,
        sheathThickness,
        faultCurrent,
        faultDuration,
        initialTemp,
        finalTemp
    } = inputs;
    
    // Get constants
    const materialConstants = getMaterialConstants(material);
    const insideMediumConstants = getThermalConstants(insideMedium);
    const outsideMediumConstants = getThermalConstants(outsideMedium);
    
    if (!materialConstants || !insideMediumConstants || !outsideMediumConstants) {
        throw new Error('Missing required constants');
    }
    
    // Step A: Calculate adiabatic area from fault current
    const adiabaticArea = calculateAdiabaticArea(
        materialConstants,
        faultCurrent,
        initialTemp,
        finalTemp,
        faultDuration
    );
    
    // Calculate adiabatic current (for verification)
    const adiabaticCurrent = calculateAdiabaticCurrent(
        materialConstants,
        adiabaticArea,
        initialTemp,
        finalTemp,
        faultDuration
    );
    
    // Step B: Calculate non-adiabatic factor
    const epsilon = calculateNonAdiabaticFactor(
        thermalContactFactor,
        sheathThickness,
        insideMediumConstants,
        outsideMediumConstants,
        materialConstants,
        faultDuration
    );
    
    // Step C: Calculate permissible current
    const permissibleCurrent = calculatePermissibleCurrent(epsilon, adiabaticCurrent);
    
    // Calculate required area (non-adiabatic)
    const requiredArea = calculatePermissibleArea(epsilon, adiabaticArea);
    
    // Round to next standard size (common standard sizes in mm²)
    const standardSizes = [
        1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800, 1000
    ];
    
    const suggestedStandardSize = standardSizes.find(size => size >= requiredArea) || 
                                  Math.ceil(requiredArea / 10) * 10;
    
    return {
        adiabaticCurrent: adiabaticCurrent,
        epsilon: epsilon,
        permissibleCurrent: permissibleCurrent,
        requiredArea: requiredArea,
        suggestedStandardSize: suggestedStandardSize
    };
}

/**
 * Conductor-only calculation function
 * Simplified calculation focusing on conductors only
 */
function performConductorCalculation(inputs) {
    const {
        material,
        conductorArea, // in mm² (can be null)
        shortCircuitCurrent, // in A
        time, // in seconds
        initialTemp, // in °C
        finalTemp, // in °C
        betaOverride,
        kOverride
    } = inputs;
    
    // Get material constants
    const baseMaterialConstants = getMaterialConstants(material);
    
    if (!baseMaterialConstants) {
        throw new Error('Invalid material selected');
    }

    const materialConstants = {
        ...baseMaterialConstants,
        beta: !isNaN(betaOverride) ? betaOverride : baseMaterialConstants.beta,
        K: !isNaN(kOverride) ? kOverride : baseMaterialConstants.K
    };
    
    // Calculate required area for the given short circuit current
    const requiredArea = calculateAdiabaticArea(
        materialConstants,
        shortCircuitCurrent,
        initialTemp,
        finalTemp,
        time
    );
    
    // Standard conductor sizes (common standard sizes in mm²)
    const standardSizes = [
        1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800, 1000
    ];
    
    // Find suggested standard size
    const suggestedStandardSize = standardSizes.find(size => size >= requiredArea) || 
                                  Math.ceil(requiredArea / 10) * 10;
    
    // Initialize result object
    const result = {
        shortCircuitCurrent: shortCircuitCurrent,
        requiredArea: requiredArea,
        conductorArea: conductorArea,
        suggestedStandardSize: suggestedStandardSize,
        beta: materialConstants.beta,
        K: materialConstants.K
    };
    
    // Only calculate adiabatic current and adequacy if conductor area is provided
    if (conductorArea !== null && conductorArea !== undefined) {
        // Step A: Calculate adiabatic current for the given conductor area
        const adiabaticCurrent = calculateAdiabaticCurrent(
            materialConstants,
            conductorArea,
            initialTemp,
            finalTemp,
            time
        );
        
        // Check if conductor is adequate
        const isAdequate = conductorArea >= requiredArea;
        
        // Calculate safety factor
        const safetyFactor = adiabaticCurrent / shortCircuitCurrent;
        
        result.adiabaticCurrent = adiabaticCurrent;
        result.safetyFactor = safetyFactor;
        result.isAdequate = isAdequate;
    }
    
    return result;
}

