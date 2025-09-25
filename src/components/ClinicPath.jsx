import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { getClinicsForExam, floorInfo } from '../data/medicalExams';

export default function ClinicPath({ examType, gender, currentClinic, queueNumber }) {
  const clinics = getClinicsForExam(examType, gender);
  const progress = ((currentClinic + 1) / clinics.length) * 100;

  // تجميع العيادات حسب الطابق
  const clinicsByFloor = clinics.reduce((acc, clinic) => {
    if (!acc[clinic.floor]) {
      acc[clinic.floor] = [];
    }
    acc[clinic.floor].push(clinic);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* شريط التقدم العام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            تقدم الفحص الطبي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>العيادة الحالية: {currentClinic + 1}</span>
              <span>إجمالي العيادات: {clinics.length}</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-center text-sm text-gray-600">
              {Math.round(progress)}% مكتمل
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مسار العيادات مجمع حسب الطابق */}
      {Object.entries(clinicsByFloor).map(([floor, floorClinics]) => {
        const floorData = floorInfo[floor];
        
        return (
          <Card key={floor} className="overflow-hidden">
            <CardHeader 
              className="pb-3"
              style={{ backgroundColor: floorData?.color || '#f8f9fa' }}
            >
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {floorData?.name || floor}
              </CardTitle>
              {floorData?.subtitle && (
                <p className="text-sm text-gray-600">{floorData.subtitle}</p>
              )}
              {floorData?.access && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800">{floorData.access}</p>
                </div>
              )}
              {floorData?.note && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-orange-800">{floorData.note}</p>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {floorClinics.map((clinic, index) => {
                  const globalIndex = clinics.findIndex(c => c.id === clinic.id);
                  const isCompleted = globalIndex < currentClinic;
                  const isCurrent = globalIndex === currentClinic;
                  const isPending = globalIndex > currentClinic;

                  return (
                    <div
                      key={clinic.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : isCompleted
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : isCurrent ? (
                          <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {queueNumber || globalIndex + 1}
                            </span>
                          </div>
                        ) : (
                          <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs">
                              {globalIndex + 1}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          isCurrent ? 'text-blue-900' : 
                          isCompleted ? 'text-green-900' : 'text-gray-700'
                        }`}>
                          {clinic.name}
                        </h4>
                        {clinic.note && (
                          <p className="text-xs text-orange-600 mt-1">
                            {clinic.note}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            مكتمل
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge className="bg-blue-600">
                            الحالي
                          </Badge>
                        )}
                        {isPending && (
                          <Badge variant="outline">
                            في الانتظار
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

