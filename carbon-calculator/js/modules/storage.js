/**
 * 本地存储模块
 */

const STORAGE_KEY = 'carbon_footprint_logs';

export class StorageManager {
  /**
   * 获取所有日志
   */
  static getLogs() {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  }
  
  /**
   * 保存日志
   */
  static saveLog(logEntry) {
    const logs = this.getLogs();
    
    // 按类型过滤日志，每种类型最多保存10条
    const logsByType = logs.filter(log => log.type === logEntry.type);
    if (logsByType.length >= 10) {
      // 删除最早的记录
      const oldestLog = logsByType.reduce((oldest, log) => 
        new Date(log.timestamp) < new Date(oldest.timestamp) ? log : oldest
      );
      const index = logs.findIndex(log => log.id === oldestLog.id);
      if (index !== -1) logs.splice(index, 1);
    }
    
    // 添加新记录
    logs.push({
      ...logEntry,
      id: Date.now().toString(), // 唯一ID
      timestamp: new Date().toISOString() // 标准化时间戳
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }
  
  /**
   * 清除特定类型的日志
   */
  static clearLogsByType(type) {
    const logs = this.getLogs().filter(log => log.type !== type);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }
  
  /**
   * 获取特定类型的日志数量
   */
  static getLogCountByType(type) {
    return this.getLogs().filter(log => log.type === type).length;
  }
}