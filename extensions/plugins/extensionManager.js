/**
 * 🔧 مدير التوسعات - Extension Manager
 * يدير تحميل وتشغيل جميع التوسعات بشكل آمن
 */

class ExtensionManager {
  constructor() {
    this.extensions = new Map();
    this.hooks = new Map();
    this.isInitialized = false;
  }

  /**
   * تسجيل توسعة جديدة
   */
  register(extension) {
    if (!extension.name || !extension.version) {
      throw new Error('Extension must have name and version');
    }

    // التحقق من التوافق
    if (!this.isCompatible(extension)) {
      console.warn(`Extension ${extension.name} is not compatible`);
      return false;
    }

    this.extensions.set(extension.name, extension);
    console.log(`✅ Extension registered: ${extension.name} v${extension.version}`);
    return true;
  }

  /**
   * تهيئة جميع التوسعات
   */
  async initialize() {
    if (this.isInitialized) {
      console.warn('Extension Manager already initialized');
      return;
    }

    console.log('🚀 Initializing Extension Manager...');
    
    for (const [name, extension] of this.extensions) {
      try {
        if (extension.init && typeof extension.init === 'function') {
          await extension.init();
          console.log(`✅ Extension initialized: ${name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to initialize extension ${name}:`, error);
      }
    }

    this.isInitialized = true;
    console.log('🎉 Extension Manager initialized successfully');
  }

  /**
   * تشغيل hook معين
   */
  async runHook(hookName, data = {}) {
    const results = [];
    
    for (const [name, extension] of this.extensions) {
      if (extension.hooks && extension.hooks[hookName]) {
        try {
          const result = await extension.hooks[hookName](data);
          results.push({ extension: name, result });
        } catch (error) {
          console.error(`❌ Hook ${hookName} failed in ${name}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * الحصول على توسعة معينة
   */
  getExtension(name) {
    return this.extensions.get(name);
  }

  /**
   * الحصول على جميع التوسعات
   */
  getAllExtensions() {
    return Array.from(this.extensions.values());
  }

  /**
   * التحقق من توافق التوسعة
   */
  isCompatible(extension) {
    // التحقق من الإصدار المطلوب
    if (extension.requiredVersion) {
      const currentVersion = '1.0.0'; // إصدار النظام الحالي
      return this.compareVersions(currentVersion, extension.requiredVersion) >= 0;
    }
    return true;
  }

  /**
   * مقارنة الإصدارات
   */
  compareVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;
      
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    
    return 0;
  }

  /**
   * إلغاء تحميل توسعة
   */
  unload(name) {
    const extension = this.extensions.get(name);
    if (extension && extension.destroy) {
      extension.destroy();
    }
    this.extensions.delete(name);
    console.log(`🗑️ Extension unloaded: ${name}`);
  }

  /**
   * إعادة تحميل توسعة
   */
  async reload(name) {
    const extension = this.extensions.get(name);
    if (extension) {
      this.unload(name);
      this.register(extension);
      if (extension.init) {
        await extension.init();
      }
      console.log(`🔄 Extension reloaded: ${name}`);
    }
  }

  /**
   * الحصول على معلومات النظام
   */
  getSystemInfo() {
    return {
      extensionCount: this.extensions.size,
      isInitialized: this.isInitialized,
      extensions: Array.from(this.extensions.keys()),
      version: '1.0.0'
    };
  }
}

// إنشاء مثيل واحد من مدير التوسعات
export const extensionManager = new ExtensionManager();

// تصدير الكلاس للاستخدام المتقدم
export { ExtensionManager };

/**
 * مثال على استخدام مدير التوسعات:
 * 
 * import { extensionManager } from './extensions/plugins/extensionManager.js';
 * 
 * // تسجيل توسعة جديدة
 * extensionManager.register({
 *   name: 'MyExtension',
 *   version: '1.0.0',
 *   init() {
 *     console.log('My extension initialized');
 *   },
 *   hooks: {
 *     beforeRender: (data) => {
 *       // منطق قبل الرندر
 *     }
 *   }
 * });
 * 
 * // تهيئة جميع التوسعات
 * await extensionManager.initialize();
 */

