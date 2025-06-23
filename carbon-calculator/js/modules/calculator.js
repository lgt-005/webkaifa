/**
 * 碳足迹计算模块
 */

// 碳排放因子
export const EMISSION_FACTORS = {
  transport: {
    car: 0.2,          // kgCO2e/公里
    bus: 0.08,        // kgCO2e/km
    train: 0.06,      // kgCO2e/km
    airplane: 0.25,    // kgCO2e/km
    publicTransport: 0.1,
  },
  energy: {
    electricity: 0.5,  // kgCO2e/度
    gas: 0.3,          // kgCO2e/立方米
  },
  food: {
    meat: 2,           // kgCO2e/千克
    dairy: 1.2,       // kgCO2e/kg
    grain: 0.5,       // kgCO2e/kg
    vegetable: 0.3,   // kgCO2e/kg
    fruit: 0.4        // kgCO2e/kg
  },
  production: 0.1      // kgCO2e/单位产品
};

/**
 * 计算个人碳足迹
 */
export function calculatePersonalCarbonFootprint(data) {
  const { carDistance, publicTransportDistance, electricityUsage, gasUsage, meatConsumption } = data;

  // 转换为日均数据
  const dailyElectricity = electricityUsage / 30;
  const dailyGas = gasUsage / 30;
  const dailyMeat = meatConsumption / 7;

  // 计算各项排放
  const transportEmissions = carDistance * EMISSION_FACTORS.transport.car +
    publicTransportDistance * EMISSION_FACTORS.transport.publicTransport;
  const energyEmissions = dailyElectricity * EMISSION_FACTORS.energy.electricity +
    dailyGas * EMISSION_FACTORS.energy.gas;
  const foodEmissions = dailyMeat * EMISSION_FACTORS.food.meat;

  return transportEmissions + energyEmissions + foodEmissions;
}

/**
 * 计算家庭碳足迹 (复用个人逻辑)
 */
export function calculateFamilyCarbonFootprint(data) {
  return calculatePersonalCarbonFootprint(data);
}

/**
 * 计算企业碳足迹
 */
export function calculateEnterpriseCarbonFootprint(data) {
  const { carDistance, publicTransportDistance, electricityUsage, gasUsage, production } = data;

  // 转换为日均数据
  const dailyElectricity = electricityUsage / 30;
  const dailyGas = gasUsage / 30;
  const dailyProduction = production / 30;

  // 计算各项排放
  const transportEmissions = carDistance * EMISSION_FACTORS.transport.car +
    publicTransportDistance * EMISSION_FACTORS.transport.publicTransport;
  const energyEmissions = dailyElectricity * EMISSION_FACTORS.energy.electricity +
    dailyGas * EMISSION_FACTORS.energy.gas;
  const productionEmissions = dailyProduction * EMISSION_FACTORS.production;

  return transportEmissions + energyEmissions + productionEmissions;
}


/**
 * 普通碳足迹计算
 */
export function calculateQuickCarbonFootprint(type, data, days) {
  switch (type) {
    case 'food':
      return data.dailyAmount * days * EMISSION_FACTORS.food[data.foodType];

    case 'transport':
      return data.dailyDistance * days * EMISSION_FACTORS.transport[data.transportType];

    case 'electricity':
      return data.dailyUsage ? data.dailyUsage * days * EMISSION_FACTORS.energy.electricity :
        (data.totalUsage / data.days) * EMISSION_FACTORS.energy.electricity;

    case 'gas':
      return data.dailyUsage ? data.dailyUsage * days * EMISSION_FACTORS.energy.gas :
       (data.totalUsage / data.days) * EMISSION_FACTORS.energy.gas;
    default:
      return 0;
  }
}

/**
 * 获取碳足迹等级描述
 */
export function getCarbonFootprintLevel(emissions) {
  if (emissions < 100) return { text: "非常低", color: "green" };
  if (emissions < 200) return { text: "中等", color: "orange" };
  return { text: "高", color: "red" };
}