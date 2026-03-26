const CARBON_IMPACT_DATA = {
    "GPU": 150.0,
    "CPU": 40.0,
    "Motherboard": 35.0,
    "RAM": 10.0,
    "ESP8266/IoT": 2.5,
    "Default": 5.0
};

export const calculateCarbonSaved = (categoryName, ecoScore) => {
    const baseImpact = CARBON_IMPACT_DATA[categoryName] || CARBON_IMPACT_DATA['Default'];
    const conditionMultiplier = ecoScore / 100;
    const totalSaved = baseImpact * conditionMultiplier * 0.9;

    return parseFloat(totalSaved.toFixed(2));
}

export const getEcoFriendlyComparison = (totalKgSaved) => {
    const treesEquivalent = (totalKgSaved / 21).toFixed(1); // 1 tree absorbs ~21kg/year
    const carKmEquivalent = (totalKgSaved / 0.12).toFixed(0); // Avg car emits 0.12kg/km
    
    return {
        trees: treesEquivalent,
        carKm: carKmEquivalent,
        label: `${totalKgSaved}kg of CO2 saved`
    };
};