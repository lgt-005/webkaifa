/**
 * 工具函数模块
 */

/**
 * 格式化数字为两位小数
 */
export function formatNumber(num) {
  return num.toFixed(2);
}

/**
 * 获取当前日期时间字符串
 */
export function getDateTimeString() {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * 获取输入值（处理空值和NaN）
 */
export function getInputValue(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return 0;
  
  const value = parseFloat(element.value);
  return isNaN(value) ? 0 : value;
}