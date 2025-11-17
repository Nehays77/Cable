# IEC 949 Conductor Calculator

A web-based calculator for determining adiabatic and non-adiabatic current ratings for electrical conductors based on IEC 949 standard.

## Features

- **Dropdown Inputs**: All material and configuration selections use dropdown menus
- **Automatic Constants**: Material constants (Table I) and thermal constants (Table II) are automatically loaded from IEC 949 standard
- **Complete Calculations**: 
  - Adiabatic current/area calculation
  - Non-adiabatic factor (ε) calculation
  - Permissible current calculation
  - Required area with standard size suggestions

## How to Use

1. Open `index.html` in a web browser
2. Fill in all required fields (marked with *):
   - **Conductor Material**: Select from Copper, Aluminium, Lead, Steel, or Bronze
   - **Insulation Type**: Select appropriate insulation type
   - **Sheath Material**: Select sheath material
   - **Outer Sheath Material**: Select outer sheath material
   - **Sheath Thickness**: Select thickness in mm
   - **Construction Type**: Select construction type
   - **Thermal Contact**: Select thermal contact factor
   - **Inside/Outside Medium**: Select thermal media
   - **Fault Current**: Enter fault current in Amperes
   - **Fault Duration**: Enter fault duration in seconds
3. Optional fields:
   - **Initial Temperature**: Default is 90°C
   - **Final Temperature**: Default is 250°C
   - **Mean Diameter**: For tubular sheaths
4. Click **Calculate** button
5. View results in the output section

## Calculation Flow

The calculator follows the IEC 949 standard calculation flow:

1. **Step A**: Calculate adiabatic current/area
   - `I_AD = K * S * sqrt(ln((θ_f + β) / (θ_i + β)) / t)`
   - `S = (I * sqrt(t)) / (K * sqrt(ln((θ_f + β) / (θ_i + β))))`

2. **Step B**: Calculate non-adiabatic factor (ε)
   - `M = (F / (δ * 10^-3)) * ((σ_2 + σ_3) / σ_1)`
   - `ε = 1 + 0.61 * M * sqrt(t) - 0.069 * (M * sqrt(t))^2 + 0.0043 * (M * sqrt(t))^3`

3. **Step C**: Calculate final permissible current/area
   - `I_perm = ε * I_AD`
   - `S_non = S_AD / ε`

## Output Schema

The calculator provides:
- **Adiabatic Current (I_AD)**: Base current in Amperes
- **Non-Adiabatic Factor (ε)**: Multiplier (dimensionless)
- **Permissible Current (I_perm)**: Final result in Amperes
- **Required Area (S)**: Calculated area in mm²
- **Suggested Standard Size**: Next standard conductor size in mm²

## Files Structure

- `index.html`: Main HTML structure
- `styles.css`: Styling and layout
- `constants.js`: Material and thermal constants (Table I & II)
- `calculations.js`: Calculation functions
- `app.js`: Main application logic and UI interaction

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## Notes

- All calculations are based on IEC 949 standard
- Constants are taken from IEC 949 Table I (Material Constants) and Table II (Thermal Constants of Media)
- The calculator currently focuses on conductor calculations
- Standard conductor sizes follow common industry standards

