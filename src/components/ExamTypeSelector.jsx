import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { examTypes, getDynamicModel } from '../data/medicalExams';

export default function ExamTypeSelector({ onSelect, selectedType, gender }) {
  const dynamicModel = getDynamicModel();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Badge variant="outline" className="text-lg px-4 py-2">
          النموذج الحالي: {dynamicModel}
        </Badge>
        <p className="text-sm text-gray-600 mt-2">
          النماذج A و B و C و D ديناميكية متغيرة لكي لا يتراكم المراجعين على عيادة معينة
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.values(examTypes).map((examType) => {
          // إخفاء فحص العنصر النسائي للذكور
          if (examType.id === 'FEMALE_ALL_EXAMS' && gender !== 'FEMALE') {
            return null;
          }
          
          // للإناث، عرض فحص العنصر النسائي فقط
          if (gender === 'FEMALE' && examType.id !== 'FEMALE_ALL_EXAMS') {
            return null;
          }

          const isSelected = selectedType === examType.id;
          
          return (
            <Card 
              key={examType.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => onSelect(examType.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{examType.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    عدد العيادات: {examType.clinics.length}
                  </p>
                  
                  {/* عرض العيادات مجمعة حسب الطابق */}
                  <div className="space-y-2">
                    {['الميزانين', 'الطابق الثاني', 'الطابق الثالث'].map(floor => {
                      const floorClinics = examType.clinics.filter(clinic => clinic.floor === floor);
                      if (floorClinics.length === 0) return null;
                      
                      return (
                        <div key={floor} className="text-xs">
                          <Badge variant="secondary" className="mb-1">
                            {floor}
                          </Badge>
                          <div className="text-gray-500">
                            {floorClinics.map(clinic => clinic.name).join(' • ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {isSelected && (
                  <Button className="w-full mt-3" size="sm">
                    تم الاختيار ✓
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

