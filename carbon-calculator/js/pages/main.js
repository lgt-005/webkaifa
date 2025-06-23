/**
 * 主页面逻辑
 */
import {
  calculatePersonalCarbonFootprint,
  calculateFamilyCarbonFootprint,
  calculateEnterpriseCarbonFootprint,
  getCarbonFootprintLevel,
  calculateQuickCarbonFootprint,

} from '../modules/calculator.js';
import { ModalManager } from '../modules/modal.js';
import { StorageManager } from '../modules/storage.js';
import { formatNumber, getDateTimeString, getInputValue } from '../modules/utils.js';


export class MainPage {
  constructor() {
    this.initialize();
    this.bindEvents();
    this.initElectricityModeListener();
    this.initGasModeListener();
  }

  initialize() {
    this.bindEvents();
    // 初始化模态框
    ModalManager.initialize();


    const typeSelector = document.getElementById('quick-type');
    this.updateCalculationFields(typeSelector.value); // 初始化显示

    typeSelector.addEventListener('change', (e) => {
      this.updateCalculationFields(e.target.value);
    });


    // 更新记录计数
    this.updateRecordCounts();
  }

  initCalculationTypeListener() {
    const typeSelector = document.getElementById('quick-type');
    this.updateCalculationFields(typeSelector.value); // 初始化显示

    typeSelector.addEventListener('change', (e) => {
      this.updateCalculationFields(e.target.value);
    });
  }

  updateCalculationFields(type) {
    // 隐藏所有类型的字段
    document.querySelectorAll('.quick-fields').forEach(field => {
      field.classList.add('hidden');
    });

    // 显示当前选择类型的字段
    document.getElementById(`quick-fields-${type}`)?.classList.remove('hidden');

    // 初始化用电/用气模式
    if (type === 'electricity') {
      this.updateElectricityMode(document.getElementById('quick-electricity-mode').value);
    } else if (type === 'gas') {
      this.updateGasMode(document.getElementById('quick-gas-mode').value);
    }
  }

  initElectricityModeListener() {
    const modeSelector = document.getElementById('quick-electricity-mode');
    modeSelector.addEventListener('change', (e) => {
      this.updateElectricityMode(e.target.value);
    });
  }

  initGasModeListener() {
    const modeSelector = document.getElementById('quick-gas-mode');
    modeSelector.addEventListener('change', (e) => {
      this.updateGasMode(e.target.value);
    });
  }




  updateElectricityMode(mode) {
    const isDaily = mode === 'daily';
    document.getElementById('electricity-daily').classList.toggle('hidden', !isDaily);
    document.getElementById('electricity-total').classList.toggle('hidden', isDaily);
  }

  updateGasMode(mode) {
    const isDaily = mode === 'daily';
    document.getElementById('gas-daily').classList.toggle('hidden', !isDaily);
    document.getElementById('gas-total').classList.toggle('hidden', isDaily);
  }


  showCalculationMode(type) {
    const modeSelector = document.getElementById(type === 'electricity' ? 'quick-electricity-mode' : 'quick-gas-mode');
    modeSelector.addEventListener('change', (e) => {
      const mode = e.target.value;
      const isDaily = mode === 'daily';
      document.getElementById(`${type}-daily`).classList.toggle('hidden', !isDaily);
      document.getElementById(`${type}-total`).classList.toggle('hidden', isDaily);
    })
  }



  bindEvents() {
    // 开始计算按钮
    document.getElementById('calculate-button-start').addEventListener('click', () => {
      this.showMainContent();
    });

    // 返回按钮
    document.getElementById('back-button').addEventListener('click', () => {
      this.hideMainContent();
    });

    // 计算类型切换按钮
    document.querySelectorAll('.type-button').forEach(button => {
      button.addEventListener('click', () => {
        this.switchCalculationType(button.dataset.type);
      });
    });

    // 模态框按钮
    document.getElementById('calculation-method-button').addEventListener('click', () => {
      ModalManager.open('calculation-method-modal');
    });

    document.getElementById('about-us-button').addEventListener('click', () => {
      ModalManager.open('about-us-modal');
    });

    document.getElementById('carbon-video-button').addEventListener('click', () => {
      ModalManager.open('carbon-video-modal');
    });

    // 计算按钮
    document.getElementById('calculate-button-personal').addEventListener('click', () => {
      this.calculate('个人');
    });

    document.getElementById('calculate-button-family').addEventListener('click', () => {
      this.calculate('家庭');
    });

    document.getElementById('calculate-button-enterprise').addEventListener('click', () => {
      this.calculate('企业');
    });

    // 清除记录按钮
    document.getElementById('personal-clear-button').addEventListener('click', () => {
      StorageManager.clearLogsByType('个人');
      this.updateRecordCounts();
    });

    document.getElementById('family-clear-button').addEventListener('click', () => {
      StorageManager.clearLogsByType('家庭');
      this.updateRecordCounts();
    });

    document.getElementById('enterprise-clear-button').addEventListener('click', () => {
      StorageManager.clearLogsByType('企业');
      this.updateRecordCounts();
    });

    // 普通计算按钮
    document.getElementById('calculate-button-quick').addEventListener('click', () => {
      this.calculateQuick();
    });
  }

  showMainContent() {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    // 默认显示个人计算表单
    this.switchCalculationType('personal');
  }

  hideMainContent() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('start-page').style.display = 'flex';
    // 隐藏结果区域
    document.getElementById('result').classList.add('hidden');
  }

  switchCalculationType(type) {
    // 显示对应类型的表单，隐藏其他表单
    document.querySelectorAll('.calculation-type').forEach(form => {
      form.classList.toggle('hidden', form.id !== type);
    });
  }

  calculate(type) {
    let emissions = 0;
    let formData = {};

    // 收集表单数据
    if (type === '个人') {
      formData = {
        carDistance: getInputValue('personal-car-distance'),
        publicTransportDistance: getInputValue('personal-public-transport-distance'),
        electricityUsage: getInputValue('personal-electricity-usage'),
        gasUsage: getInputValue('personal-gas-usage'),
        meatConsumption: getInputValue('personal-meat-consumption')
      };
      emissions = calculatePersonalCarbonFootprint(formData);
    } else if (type === '家庭') {
      formData = {
        carDistance: getInputValue('family-car-distance'),
        publicTransportDistance: getInputValue('family-public-transport-distance'),
        electricityUsage: getInputValue('family-electricity-usage'),
        gasUsage: getInputValue('family-gas-usage'),
        meatConsumption: getInputValue('family-meat-consumption')
      };
      emissions = calculateFamilyCarbonFootprint(formData);
    } else if (type === '企业') {
      formData = {
        carDistance: getInputValue('enterprise-car-distance'),
        publicTransportDistance: getInputValue('enterprise-public-transport-distance'),
        electricityUsage: getInputValue('enterprise-electricity-usage'),
        gasUsage: getInputValue('enterprise-gas-usage'),
        production: getInputValue('enterprise-production')
      };
      emissions = calculateEnterpriseCarbonFootprint(formData);
    }

    // 显示结果
    this.displayResult(type, emissions);

    // 保存记录
    this.saveCalculationLog(type, emissions, formData);

    // 更新记录计数
    this.updateRecordCounts();
  }

  displayResult(type, emissions) {
    const resultElement = document.getElementById('result');
    const valueElement = document.getElementById('carbon-footprint-value');
    const feedbackElement = document.getElementById('feedback-message');

    // 显示结果区域
    resultElement.classList.remove('hidden');

    // 显示碳排放量
    valueElement.textContent = `你的 ${type} 日均碳排放量为: ${formatNumber(emissions)} 千克二氧化碳当量`;

    // 显示反馈信息
    const level = getCarbonFootprintLevel(emissions);
    feedbackElement.textContent = `${type} 碳排放量处于 ${level.text} 水平。${this.getFeedbackMessage(level.text)}`;
    feedbackElement.style.color = level.color;
  }

  getFeedbackMessage(level) {
    switch (level) {
      case "非常低":
        return "继续保持！可以考虑进一步减少碳排放。";
      case "中等":
        return "建议你采取措施减少碳排放。";
      case "高":
        return "需要大力采取措施减少碳排放。";
      default:
        return "";
    }
  }


  // 保存计算记录
  saveCalculationLog(type, emissions, formData) {
    const logEntry = {
      type,
      carbonFootprint: formatNumber(emissions),
      inputData: formData,
      timestamp: getDateTimeString()
    };

    StorageManager.saveLog(logEntry);
  }

  updateRecordCounts() {
    document.getElementById('personal-record-count').textContent = `当前记录数: ${StorageManager.getLogCountByType('个人')}/10`;
    document.getElementById('family-record-count').textContent = `当前记录数: ${StorageManager.getLogCountByType('家庭')}/10`;
    document.getElementById('enterprise-record-count').textContent = `当前记录数: ${StorageManager.getLogCountByType('企业')}/10`;
  }

  calculateQuick() {
    const type = document.getElementById('quick-type').value;
    let data = {};
    const days = Math.max(getInputValue('quick-days'), 1); // 确保天数至少为 1
    let isValid = false;


    switch (type) {
      case 'food':
        data = {
          foodType: document.getElementById('quick-food-type').value,
          dailyAmount: getInputValue('quick-food-amount')
        };
        isValid = data.dailyAmount > 0;
        break;

      case 'transport':
        data = {
          transportType: document.getElementById('quick-transport-type').value,
          dailyDistance: getInputValue('quick-transport-distance')
        };
        isValid = data.dailyDistance > 0;
        break;

      case 'electricity':
        const electricityMode = document.getElementById('quick-electricity-mode').value;
        if (electricityMode === 'daily') {
          data = {
            dailyUsage: getInputValue('quick-electricity-daily-amount'),
            days: getInputValue('quick-days')
          };
          isValid = data.dailyUsage > 0;
        } else {
          data = {
            totalUsage: getInputValue('quick-electricity-total-amount'),
            days: getInputValue('quick-days')
          };
         isValid = data.totalUsage > 0 && data.days > 0;
        }
        break;

      case 'gas':
        const gasMode = document.getElementById('quick-gas-mode').value;
        if (gasMode === 'daily') {
          data = {
            dailyUsage: getInputValue('quick-gas-daily-amount'),
            days: getInputValue('quick-days')
          };
          isValid = data.dailyUsage > 0;
        } else {
          data = {
            totalUsage: getInputValue('quick-gas-total-amount'),
            days: getInputValue('quick-days')
          };
          isValid = data.totalUsage > 0 && data.days > 0;
        }
        break;
    }

    if (isValid) {
        // 调用计算函数
        const totalEmission = calculateQuickCarbonFootprint(type, data, days);

        // 显示结果
        this.displayQuickResult(type, totalEmission, data, days);
    } else {
        // 处理输入无效的情况，例如显示错误提示
        alert('请输入有效的数据。');
    }
}
    

  displayQuickResult(type, totalEmission, data, days) {
    const resultElement = document.getElementById('normal-calculation-result');
    const valueElement = document.getElementById('normal-carbon-footprint-value');
    const feedbackElement = document.getElementById('normal-feedback-message');

    // 显示结果区域
    resultElement.classList.remove('hidden');
    // 隐藏常规计算结果区域
    document.getElementById('result').classList.add('hidden');

    // 根据不同类型显示不同的结果描述
    let description = '';

    switch (type) {
      case 'food':
        const foodName = this.getFoodName(data.foodType);
        description = `你每日摄入 ${data.dailyAmount}kg ${foodName}，持续 ${days} 天，累计产生的碳排放量为:`;
        break;

      case 'transport':
        const transportName = this.getTransportName(data.transportType);
        description = `你每日乘坐 ${transportName} 行驶 ${data.dailyDistance} 公里，持续 ${days} 天，累计产生的碳排放量为:`;
        break;

      case 'electricity':
        if (data.dailyUsage !== undefined) {
          description = `你每日用电 ${data.dailyUsage} 度，持续 ${days} 天，累计产生的碳排放量为:`;
        } else {
          description = `你总共用电 ${data.totalUsage} 度，持续 ${days} 天,平均每日的碳排放量为:`;
        }
        break;

      case 'gas':
        if (data.dailyUsage !== undefined) {
          description = `你每日用气 ${data.dailyUsage} 立方米，持续 ${days} 天，累计产生的碳排放量为:`;
        } else {
          description = `你总共用气 ${data.totalUsage} 立方米，持续 ${days} 天,平均每日碳排放量为:`;
        }
        break;
    }

    valueElement.textContent = `${description} ${formatNumber(totalEmission)} 千克二氧化碳当量`;

    // 提供简单的减排建议
    feedbackElement.textContent = this.getQuickFeedback(type);
  }

  getFoodName(type) {
    const names = {
      meat: '肉类',
      dairy: '乳制品',
      grain: '谷物',
      vegetable: '蔬菜',
      fruit: '水果'
    };
    return names[type] || type;
  }

  getTransportName(type) {
    const names = {
      car: '汽车',
      bus: '公交车',
      train: '火车',
      airplane: '飞机'
    };
    return names[type] || type;
  }

  getQuickFeedback(type) {
    const tips = {
      food: '减少肉类摄入，增加植物性食物比例可以显著降低碳足迹。',
      transport: '优先选择公共交通或共享出行，短途可考虑步行或骑自行车。',
      electricity: '节约用电，使用节能电器，可有效减少碳排放。',
      gas: '合理控制用气量，检查管道是否漏气，可降低碳排放。'
    };

    return tips[type] || '减少此类活动的频率或强度可以降低碳足迹。';
  }
}