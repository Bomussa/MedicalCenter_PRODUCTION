import React, { useState } from 'react';

function SimpleApp() {
  const [step, setStep] = useState(1);
  const [militaryId, setMilitaryId] = useState('');
  const [gender, setGender] = useState('');
  const [examType, setExamType] = useState('');

  const examTypes = [
    { id: 'INTERNAL_EXTERNAL_COURSES', name: 'الدورات الداخلية والخارجية' },
    { id: 'COMPREHENSIVE_EXAM', name: 'فحص شامل' },
    { id: 'RECRUITMENT_PROMOTION_TRANSFER', name: 'التجنيد والترفيع والنقل والتحويل وتجديد التعاقد' },
    { id: 'AVIATION_ANNUAL', name: 'الطيران السنوي' },
    { id: 'COOKS', name: 'الطباخين' }
  ];

  const handleSubmit = () => {
    if (militaryId && gender) {
      setStep(2);
    }
  };

  const handleExamSelection = (type) => {
    setExamType(type);
    setStep(3);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src="/logo.png" alt="شعار المركز" style={{ width: '80px', height: '80px', marginBottom: '10px' }} />
        <h1 style={{ color: '#1E40AF', marginBottom: '10px' }}>المركز الطبي التخصصي العسكري – العطار</h1>
        <p style={{ color: '#3B82F6' }}>قسم اللجنة الطبية العسكرية</p>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>نظام إدارة الفحوصات الطبية</p>
      </div>

      {step === 1 && (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: 'white' }}>
          <h2 style={{ textAlign: 'center', color: '#1E40AF', marginBottom: '20px' }}>تسجيل بيانات المراجع</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الرقم العسكري / الشخصي</label>
            <input
              type="text"
              value={militaryId}
              onChange={(e) => setMilitaryId(e.target.value)}
              placeholder="أدخل الرقم العسكري أو الشخصي"
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '4px', textAlign: 'center' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الجنس</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => setGender('male')}
                style={{
                  padding: '12px',
                  border: gender === 'male' ? '2px solid #3B82F6' : '1px solid #D1D5DB',
                  borderRadius: '4px',
                  backgroundColor: gender === 'male' ? '#3B82F6' : 'white',
                  color: gender === 'male' ? 'white' : 'black',
                  cursor: 'pointer'
                }}
              >
                ذكر
              </button>
              <button
                onClick={() => setGender('female')}
                style={{
                  padding: '12px',
                  border: gender === 'female' ? '2px solid #EC4899' : '1px solid #D1D5DB',
                  borderRadius: '4px',
                  backgroundColor: gender === 'female' ? '#EC4899' : 'white',
                  color: gender === 'female' ? 'white' : 'black',
                  cursor: 'pointer'
                }}
              >
                أنثى
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!militaryId || !gender}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: (!militaryId || !gender) ? '#9CA3AF' : '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: (!militaryId || !gender) ? 'not-allowed' : 'pointer'
            }}
          >
            موافق ←
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: 'white' }}>
          <h2 style={{ textAlign: 'center', color: '#1E40AF', marginBottom: '20px' }}>اختيار نوع الفحص</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            {examTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleExamSelection(type.id)}
                style={{
                  padding: '20px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontSize: '14px',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#F3F4F6';
                  e.target.style.borderColor = '#3B82F6';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#D1D5DB';
                }}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: 'white' }}>
          <h2 style={{ textAlign: 'center', color: '#1E40AF', marginBottom: '20px' }}>تم اختيار الفحص</h2>
          <div style={{ textAlign: 'center' }}>
            <p><strong>الرقم العسكري:</strong> {militaryId}</p>
            <p><strong>الجنس:</strong> {gender === 'male' ? 'ذكر' : 'أنثى'}</p>
            <p><strong>نوع الفحص:</strong> {examTypes.find(t => t.id === examType)?.name}</p>
            
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#F0FDF4', borderRadius: '8px' }}>
              <h3 style={{ color: '#15803D' }}>رقم دورك الحالي</h3>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#15803D' }}>15</div>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '8px' }}>
              <h3 style={{ color: '#D97706' }}>الوقت المتبقي</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#D97706' }}>4:32</div>
            </div>

            <button
              onClick={() => setStep(1)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              بدء فحص جديد
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleApp;
