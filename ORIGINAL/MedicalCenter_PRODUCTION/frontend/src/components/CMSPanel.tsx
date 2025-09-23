import React, { useState, useEffect } from 'react';

interface CMSConfig {
  [key: string]: any;
}

interface CMSText {
  key: string;
  ar: string;
  en: string;
}

const CMSPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'texts' | 'icons'>('config');
  const [config, setConfig] = useState<CMSConfig>({});
  const [texts, setTexts] = useState<CMSText[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'config') {
      fetchConfig();
    } else if (activeTab === 'texts') {
      fetchTexts();
    }
  }, [activeTab]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cms/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        setError(null);
      } else {
        setError('فشل في تحميل الإعدادات');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const fetchTexts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cms/texts');
      if (response.ok) {
        const data = await response.json();
        setTexts(data);
        setError(null);
      } else {
        setError('فشل في تحميل النصوص');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key: string, value: any) => {
    try {
      const response = await fetch(`/api/cms/config/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });
      
      if (response.ok) {
        setConfig(prev => ({ ...prev, [key]: value }));
        setError(null);
      } else {
        setError('فشل في تحديث الإعداد');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
    }
  };

  const updateText = async (key: string, ar: string, en: string) => {
    try {
      const response = await fetch(`/api/cms/texts/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ar, en }),
      });
      
      if (response.ok) {
        setTexts(prev => prev.map(text => 
          text.key === key ? { ...text, ar, en } : text
        ));
        setError(null);
      } else {
        setError('فشل في تحديث النص');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
    }
  };

  return (
    <div className="cms-panel">
      <h3>إدارة المحتوى (CMS)</h3>
      
      <div className="cms-tabs">
        <button 
          className={activeTab === 'config' ? 'active' : ''}
          onClick={() => setActiveTab('config')}
        >
          الإعدادات
        </button>
        <button 
          className={activeTab === 'texts' ? 'active' : ''}
          onClick={() => setActiveTab('texts')}
        >
          النصوص
        </button>
        <button 
          className={activeTab === 'icons' ? 'active' : ''}
          onClick={() => setActiveTab('icons')}
        >
          الأيقونات
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      
      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : (
        <div className="cms-content">
          {activeTab === 'config' && (
            <div className="config-section">
              <h4>إعدادات التطبيق</h4>
              {Object.entries(config).map(([key, value]) => (
                <div key={key} className="config-item">
                  <label>{key}:</label>
                  <input
                    type="text"
                    value={JSON.stringify(value)}
                    onChange={(e) => {
                      try {
                        const newValue = JSON.parse(e.target.value);
                        updateConfig(key, newValue);
                      } catch (err) {
                        // Handle invalid JSON
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'texts' && (
            <div className="texts-section">
              <h4>النصوص متعددة اللغات</h4>
              {texts.map((text) => (
                <div key={text.key} className="text-item">
                  <h5>{text.key}</h5>
                  <div className="text-inputs">
                    <div>
                      <label>العربية:</label>
                      <input
                        type="text"
                        value={text.ar}
                        onChange={(e) => updateText(text.key, e.target.value, text.en)}
                      />
                    </div>
                    <div>
                      <label>English:</label>
                      <input
                        type="text"
                        value={text.en}
                        onChange={(e) => updateText(text.key, text.ar, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'icons' && (
            <div className="icons-section">
              <h4>إدارة الأيقونات</h4>
              <p>قريباً...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CMSPanel;

