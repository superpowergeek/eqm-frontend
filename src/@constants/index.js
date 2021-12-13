export const sourceCategory = {
  COMPANY: 'Company',
  ASSETGROUP: 'Asset Group',
  ASSET: 'Asset',
}

export const emissionTypesMap = {
  1: 'Office', 
  2: 'Retail',
  3: 'Industrial',
  4: 'Hotels, pubs & restaurants',
  5: 'Education',
  6: 'Residential',
  7: 'Healthcare',
  8: 'Sport and leisure',
  9: 'Public amenity and services',
  10: 'Car'
}

export const assignableTypes = {
  FUEL_CONSUMPTION: 'FuelConsumption',
  WASTE: 'Waste',
  TRAVEL: 'Travel',
  UTILITY: 'Utility',
  REFRIGERATOR_CONSUMPTION: 'RefrigeratorConsumption',
}

export const assignableTypesLabelMap = {
  [assignableTypes.WASTE]: 'Waste',
  [assignableTypes.FUEL_CONSUMPTION]: 'Fuel Consumption',
  [assignableTypes.TRAVEL]: 'Travel',
  [assignableTypes.UTILITY]: 'Utility',
  [assignableTypes.REFRIGERATOR_CONSUMPTION]: 'Refrigerator Consumption',
}

export const assignableTypeAmountGetter = {
  [assignableTypes.WASTE]: row => row.waste.amount,
  [assignableTypes.FUEL_CONSUMPTION]: row => row.consumption.amount,
  [assignableTypes.TRAVEL]: row => row.travel.distance,
  [assignableTypes.UTILITY]: row => row.utility.meter,
}

export const assignableTypeAmountLabelMap = {
  [assignableTypes.WASTE]: 'Amount',
  [assignableTypes.FUEL_CONSUMPTION]: 'Amount',
  [assignableTypes.TRAVEL]: 'Distance',
  [assignableTypes.UTILITY]: 'Meter',
}

export const vehicleTypesMap = {
  1: 'Car', // auto complete with {url}/travel/car?name=xxx
  2: 'Bus', 
  3: 'Train', 
  4: 'Airplane', // auto complete chose start/end with {url}/travel/airport?name=xxx
  5: 'Ship',
}

export const purchasesTypesMap = {
  1: 'Product',
  2: 'Service',
}

export const categoryTypesMap = {
  1: 'Purchased Goods and Services',
  2: 'Capital Goods',
  4: 'Upstream Transportation & Warehousing',
  9: 'Downstream purchasing & Warehousing',
}

export const commuteTypesMap = {
  1: 'Car',
  2: 'Bus',
  3: 'Rail',
  4: 'Subway',
  5: 'Airplane',
  6: 'Bike',
  7: 'Walk',
  8: 'Telecommute',
}

export const companyUtilityTypesMap = {
  'coal': 'Coal',
  'natureGas': 'Nature Gas',
  'hydro': 'Hydro',
  'oil': 'Oil',
  'tidal': 'Tidal',
  'solar': 'Solar',
  'wind': 'Wind',
  'geothermal': 'Geothermal',
  'nuclear': 'Nuclear',
  'otherRenewable': 'Other Renewable'
}

export const companyWasteTypesMap = {
  'landfillPercent': 'Landfill',
  'incinerationPercent':'Incineration',
  'recyclingPercent':'Recycling',
  'pcWasteTreatmentPercent':'pcWasteTreatment',
  'biologicalCompostingPercent':'Biological Composting',
  'anaerobicDigestationPercent':'Anaerobic Digestion' 
}

export const chartTypes = {
  BAR_CHART: 'BAR_CHART',
  LINE_CHART: 'LINE_CHART',
  // PIE_CHART: 'PIE_CHART',
  // COMPOSE_CHART: 'COMPOSE_CHART',
}

export const chartTypesValueMap = {
  [chartTypes.BAR_CHART]: 'Bar',
  [chartTypes.LINE_CHART]: 'Line',
}

export const categories = {
  POLLUTANTS: 'pollutants',
  WASTE: 'waste',
  // UTILITIES: 'utilities',
}

export const pollutantItems = {
  SOX: 'sox',
  COX: 'cox',
  NOX: 'nox',
  PM2_5: 'pm2_5',
  PM10: 'pm10',
};

export const wasteItems = {
  GARBAGE: 'garbage',
  SLUDGE: 'sludge',
  BILGE: 'bilge',
  WASTEWATER: 'waste water',
};

export const utilityItems = {
  ELETRICITY: 'electricity',
}

export const wasteTypeMap = {
  [wasteItems.GARBAGE]: 1,
  [wasteItems.SLUDGE]: 2,
  [wasteItems.BILGE]: 3,
  [wasteItems.WASTEWATER]: 4,
}

export const utilityTypeMap = {
  [utilityItems.ELETRICITY]: 1,
}

export const wasteTypeLabelMap = {
  1: wasteItems.GARBAGE,
  2: wasteItems.SLUDGE,
  3: wasteItems.BILGE,
  4: wasteItems.WASTEWATER,
}

export const utilityLabelMap = {
  1: 'eletricity'
}

export const itemsUnitMap = {
  [pollutantItems.SOX]: 'gram',
  [pollutantItems.COX]: 'kilogram',
  [pollutantItems.NOX]: 'gram',
  [pollutantItems.PM2_5]: 'gram',
  [pollutantItems.PM10]: 'gram',
  [wasteItems.GARBAGE]: 'metric tons',
  [wasteItems.SLUDGE]: 'metric tons',
  [wasteItems.BILGE]: 'metric tons',
  [wasteItems.WASTEWATER]: 'litre',
}

export const frequencies = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
}

export const manageDataTabsMap = {
  0: "assetGroup",
  1: "travel",
  2: "assign",
  3: "commute",
  4: "purchases",
  5: "utility",
  6: "waste",
  7: "employee",
  8: "product"
}

export const engineTypesMap = {
  1: "Maritime",
  2: "Mobile",
  3: "Stationary",
  4: "Other",
}

export const unitMap = {
  Waste: "kg",
  FuelConsumption: "L",
  Travel: "km",
  Utility: "kWH",
  RefrigeratorConsumption: "m\u00B3"
}

export const itemsPresentMap = {
  [categories.POLLUTANTS]: 'Pollutant',
  [categories.WASTE]: 'Waste',
  [pollutantItems.SOX]: 'SOx',
  [pollutantItems.COX]: 'COx',
  [pollutantItems.NOX]: 'NOx',
  [pollutantItems.PM2_5]: 'PM2.5',
  [pollutantItems.PM10]: 'PM10',
  [wasteItems.GARBAGE]: 'Garbage',
  [wasteItems.SLUDGE]: 'Sludge',
  [wasteItems.BILGE]: 'Bilge',
  [wasteItems.WASTEWATER]: 'Waste Water',
  [frequencies.DAY]: 'Day',
  [frequencies.WEEK]: 'Week',
  [frequencies.MONTH]: 'Month',
}