import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save,
  RefreshCw,
  Hospital,
  FileText,
  Palette,
  Clock,
  Users,
  BarChart3,
  Volume2,
  ArrowLeft
} from 'lucide-react'

const AdminPanel = ({ 
  onBack, 
  dailyCodes, 
  setDailyCodes, 
  soundEnabled, 
  setSoundEnabled,
  testAudio 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [editingClinic, setEditingClinic] = useState(null)
  const [editingExam, setEditingExam] = useState(null)
  const [newClinic, setNewClinic] = useState({ name: '', floor: '', active: true })
  const [newExam, setNewExam] = useState({ name: '', clinics: [] })
  
  // إدارة العيادات - مع الحفاظ على البيانات الحالية
  const [clinics, setClinics] = useState([
    { id: 'lab', name: 'المختبر', floor: 'الميزانين', active: true },
    { id: 'cardiology', name: 'القلب', floor: 'الطابق الثاني', active: true },
    { id: 'ophthalmology', name: 'العيون', floor: 'الطابق الثاني', active: true },
    { id: 'ent', name: 'الأنف والأذن والحنجرة', floor: 'الطابق الثاني', active: true },
    { id: 'dentistry', name: 'الأسنان', floor: 'الطابق الثالث', active: true },
    // العيادات المطلوب إضافتها حسب المرفقات
    { id: 'radiology', name: 'الأشعة', floor: 'الميزانين', active: true },
    { id: 'measurements', name: 'القياسات الحيوية', floor: 'الطابق الثاني', active: true },
    { id: 'internal', name: 'الباطنية', floor: 'الطابق الثاني', active: true },
    { id: 'surgery', name: 'الجراحة العامة', floor: 'الطابق الثاني', active: true },
    { id: 'orthopedics', name: 'العظام والمفاصل', floor: 'الطابق الثاني', active: true },
    { id: 'psychiatry', name: 'النفسية', floor: 'الطابق الثاني', active: true },
    { id: 'ecg', name: 'تخطيط القلب', floor: 'الطابق الثاني', active: true },
    { id: 'audiology', name: 'السمع', floor: 'الطابق الثاني', active: true },
    { id: 'dermatology', name: 'الجلدية', floor: 'الطابق الثالث', active: true }
  ])

  // إدارة أنواع الفحوصات - مع الحفاظ على البيانات الحالية
  const [examTypes, setExamTypes] = useState([
    { 
      id: 'RECRUITMENT', 
      name: 'تجنيد', 
      active: true,
      maleClinics: ['lab', 'radiology', 'measurements', 'ophthalmology', 'internal', 'surgery', 'orthopedics', 'ent', 'psychiatry', 'dentistry'],
      femaleClinics: ['lab', 'measurements', 'ent', 'surgery', 'orthopedics', 'psychiatry', 'dentistry', 'internal', 'ophthalmology', 'dermatology']
    },
    { 
      id: 'PROMOTION', 
      name: 'ترفيع', 
      active: true,
      maleClinics: ['lab', 'radiology', 'measurements', 'ophthalmology', 'internal', 'surgery', 'orthopedics', 'ent', 'psychiatry', 'dentistry'],
      femaleClinics: ['lab', 'measurements', 'ent', 'surgery', 'orthopedics', 'psychiatry', 'dentistry', 'internal', 'ophthalmology', 'dermatology']
    },
    { 
      id: 'TRANSFER', 
      name: 'نقل', 
      active: true,
      maleClinics: ['lab', 'radiology', 'measurements', 'ophthalmology', 'internal', 'surgery', 'orthopedics', 'ent', 'psychiatry', 'dentistry'],
      femaleClinics: ['lab', 'measurements', 'ent', 'surgery', 'orthopedics', 'psychiatry', 'dentistry', 'internal', 'ophthalmology', 'dermatology']
    },
    { 
      id: 'CONVERSION', 
      name: 'تحويل', 
      active: true,
      maleClinics: ['lab', 'radiology', 'measurements', 'ophthalmology', 'internal', 'surgery', 'orthopedics', 'ent', 'psychiatry', 'dentistry'],
      femaleClinics: ['lab', 'measurements', 'ent', 'surgery', 'orthopedics', 'psychiatry', 'dentistry', 'internal', 'ophthalmology', 'dermatology']
    },
    { 
      id: 'AVIATION', 
      name: 'طيران', 
      active: true,
      maleClinics: ['lab', 'ophthalmology', 'internal', 'ent', 'ecg', 'audiology'],
      femaleClinics: ['lab', 'ophthalmology', 'internal', 'ent', 'ecg', 'audiology', 'dermatology']
    },
    { 
      id: 'COOKS', 
      name: 'طباخين', 
      active: true,
      maleClinics: ['lab', 'internal', 'ent', 'surgery'],
      femaleClinics: ['lab', 'internal', 'ent', 'surgery', 'dermatology']
    },
    { 
      id: 'COURSES', 
      name: 'الدورات الداخلية والخارجية', 
      active: true,
      maleClinics: ['lab', 'measurements', 'ophthalmology', 'internal', 'surgery', 'orthopedics', 'ent'],
      femaleClinics: ['lab', 'measurements', 'ent', 'surgery', 'orthopedics', 'internal', 'ophthalmology', 'dermatology']
    }
  ])

  // إعدادات النظام
  const [systemSettings, setSystemSettings] = useState({
    timerDuration: 300,
    primaryColor: '#0f5fad',
    secondaryColor: '#1a73e8',
    femaleNoticeText: 'يرجى التوجّه إلى استقبال المركز الطبي للتسجيل في العيادات بالطابق الثالث',
    autoRefreshCodes: true,
    codeRefreshTime: '05:00'
  })

  // إحصائيات النظام
  const [stats, setStats] = useState({
    todayVisitors: 15,
    activeExams: examTypes.filter(e => e.active).length,
    completedExams: 12,
    activeClinics: clinics.filter(c => c.active).length,
    systemUptime: '99.9%'
  })

  // تحديث الإحصائيات عند تغيير البيانات
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      activeExams: examTypes.filter(e => e.active).length,
      activeClinics: clinics.filter(c => c.active).length
    }))
  }, [examTypes, clinics])

  // إدارة العيادات
  const handleAddClinic = () => {
    if (newClinic.name && newClinic.floor) {
      const clinic = {
        id: Date.now().toString(),
        name: newClinic.name,
        floor: newClinic.floor,
        active: newClinic.active
      }
      setClinics([...clinics, clinic])
      setNewClinic({ name: '', floor: '', active: true })
    }
  }

  const handleEditClinic = (clinic) => {
    setEditingClinic({ ...clinic })
  }

  const handleSaveClinic = () => {
    setClinics(clinics.map(c => c.id === editingClinic.id ? editingClinic : c))
    setEditingClinic(null)
  }

  const handleDeleteClinic = (clinicId) => {
    if (confirm('هل أنت متأكد من حذف هذه العيادة؟')) {
      setClinics(clinics.filter(c => c.id !== clinicId))
    }
  }

  const toggleClinicStatus = (clinicId) => {
    setClinics(clinics.map(c => 
      c.id === clinicId ? { ...c, active: !c.active } : c
    ))
  }

  // إدارة أنواع الفحوصات
  const handleAddExamType = () => {
    if (newExam.name) {
      const exam = {
        id: Date.now().toString(),
        name: newExam.name,
        active: true,
        maleClinics: [],
        femaleClinics: []
      }
      setExamTypes([...examTypes, exam])
      setNewExam({ name: '', clinics: [] })
    }
  }

  const handleEditExam = (exam) => {
    setEditingExam({ ...exam })
  }

  const handleSaveExam = () => {
    setExamTypes(examTypes.map(e => e.id === editingExam.id ? editingExam : e))
    setEditingExam(null)
  }

  const handleDeleteExam = (examId) => {
    if (confirm('هل أنت متأكد من حذف نوع الفحص هذا؟')) {
      setExamTypes(examTypes.filter(e => e.id !== examId))
    }
  }

  const toggleExamStatus = (examId) => {
    setExamTypes(examTypes.map(e => 
      e.id === examId ? { ...e, active: !e.active } : e
    ))
  }

  // تحديث الإعدادات
  const handleUpdateSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings))
    alert('تم حفظ الإعدادات بنجاح')
  }

  // تجديد الأكواد
  const generateDailyCodes = () => {
    const newCodes = dailyCodes.map(code => ({
      ...code,
      code: String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')
    }))
    setDailyCodes(newCodes)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Settings className="w-8 h-8 ml-3 text-blue-600" />
              لوحة الإدارة الشاملة
            </h1>
            <div className="flex space-x-2">
              <Button onClick={testAudio} variant="outline">
                <Volume2 className="w-4 h-4 ml-2" />
                اختبار الصوت
              </Button>
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للواجهة الرئيسية
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="w-4 h-4 ml-2" />
              لوحة المعلومات
            </TabsTrigger>
            <TabsTrigger value="clinics" className="flex items-center">
              <Hospital className="w-4 h-4 ml-2" />
              إدارة العيادات
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex items-center">
              <FileText className="w-4 h-4 ml-2" />
              إدارة الفحوصات
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <Edit className="w-4 h-4 ml-2" />
              إدارة المحتوى
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              <Palette className="w-4 h-4 ml-2" />
              المظهر والألوان
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 ml-2" />
              إعدادات النظام
            </TabsTrigger>
          </TabsList>

          {/* لوحة المعلومات */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">زوار اليوم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.todayVisitors}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">أنواع الفحوصات النشطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.activeExams}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">الفحوصات المكتملة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.completedExams}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">العيادات النشطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.activeClinics}</div>
                </CardContent>
              </Card>
            </div>

            {/* الأكواد اليومية */}
            <Card>
              <CardHeader>
                <CardTitle>الأكواد اليومية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                  {dailyCodes.map((code, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{code.clinic}</span>
                      <Badge variant="outline" className="text-lg font-bold">{code.code}</Badge>
                    </div>
                  ))}
                </div>
                <Button onClick={generateDailyCodes} className="w-full">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  تجديد جميع الأكواد
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* إدارة العيادات */}
          <TabsContent value="clinics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* إضافة عيادة جديدة */}
              <Card>
                <CardHeader>
                  <CardTitle>إضافة عيادة جديدة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="اسم العيادة"
                    value={newClinic.name}
                    onChange={(e) => setNewClinic({...newClinic, name: e.target.value})}
                  />
                  <Input
                    placeholder="الطابق (مثال: الطابق الثاني)"
                    value={newClinic.floor}
                    onChange={(e) => setNewClinic({...newClinic, floor: e.target.value})}
                  />
                  <Button onClick={handleAddClinic} className="w-full">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة العيادة
                  </Button>
                </CardContent>
              </Card>

              {/* قائمة العيادات */}
              <Card>
                <CardHeader>
                  <CardTitle>العيادات الحالية ({clinics.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {clinics.map((clinic) => (
                      <div key={clinic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        {editingClinic?.id === clinic.id ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              value={editingClinic.name}
                              onChange={(e) => setEditingClinic({...editingClinic, name: e.target.value})}
                            />
                            <Input
                              value={editingClinic.floor}
                              onChange={(e) => setEditingClinic({...editingClinic, floor: e.target.value})}
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSaveClinic}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingClinic(null)}>
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <div className="font-medium">{clinic.name}</div>
                              <div className="text-sm text-gray-600">{clinic.floor}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={clinic.active ? "default" : "secondary"}>
                                {clinic.active ? "نشط" : "متوقف"}
                              </Badge>
                              <Button size="sm" variant="outline" onClick={() => toggleClinicStatus(clinic.id)}>
                                {clinic.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditClinic(clinic)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteClinic(clinic.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* إدارة الفحوصات */}
          <TabsContent value="exams">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* إضافة نوع فحص جديد */}
              <Card>
                <CardHeader>
                  <CardTitle>إضافة نوع فحص جديد</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="اسم نوع الفحص"
                    value={newExam.name}
                    onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                  />
                  <Button onClick={handleAddExamType} className="w-full">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة نوع الفحص
                  </Button>
                </CardContent>
              </Card>

              {/* قائمة أنواع الفحوصات */}
              <Card>
                <CardHeader>
                  <CardTitle>أنواع الفحوصات الحالية ({examTypes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {examTypes.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        {editingExam?.id === exam.id ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              value={editingExam.name}
                              onChange={(e) => setEditingExam({...editingExam, name: e.target.value})}
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSaveExam}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingExam(null)}>
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <div className="font-medium">{exam.name}</div>
                              <div className="text-xs text-gray-500">
                                ذكور: {exam.maleClinics?.length || 0} عيادة | 
                                إناث: {exam.femaleClinics?.length || 0} عيادة
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={exam.active ? "default" : "secondary"}>
                                {exam.active ? "نشط" : "متوقف"}
                              </Badge>
                              <Button size="sm" variant="outline" onClick={() => toggleExamStatus(exam.id)}>
                                {exam.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditExam(exam)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteExam(exam.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* إدارة المحتوى */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>تخصيص النصوص والرسائل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">رسالة التوجيه للإناث</label>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    rows="3"
                    value={systemSettings.femaleNoticeText}
                    onChange={(e) => setSystemSettings({...systemSettings, femaleNoticeText: e.target.value})}
                  />
                </div>
                <Button onClick={handleUpdateSettings}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* المظهر والألوان */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>تخصيص الألوان والمظهر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">اللون الأساسي</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={systemSettings.primaryColor}
                        onChange={(e) => setSystemSettings({...systemSettings, primaryColor: e.target.value})}
                        className="w-12 h-12 rounded border"
                      />
                      <Input
                        value={systemSettings.primaryColor}
                        onChange={(e) => setSystemSettings({...systemSettings, primaryColor: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">اللون الثانوي</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={systemSettings.secondaryColor}
                        onChange={(e) => setSystemSettings({...systemSettings, secondaryColor: e.target.value})}
                        className="w-12 h-12 rounded border"
                      />
                      <Input
                        value={systemSettings.secondaryColor}
                        onChange={(e) => setSystemSettings({...systemSettings, secondaryColor: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleUpdateSettings}>
                  <Save className="w-4 h-4 ml-2" />
                  تطبيق الألوان
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* إعدادات النظام */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات النظام العامة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">مدة المؤقت (بالثواني)</label>
                    <Input
                      type="number"
                      value={systemSettings.timerDuration}
                      onChange={(e) => setSystemSettings({...systemSettings, timerDuration: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">وقت تجديد الأكواد التلقائي</label>
                    <Input
                      type="time"
                      value={systemSettings.codeRefreshTime}
                      onChange={(e) => setSystemSettings({...systemSettings, codeRefreshTime: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleUpdateSettings}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الإعدادات
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الصوت</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>تفعيل الصوت</span>
                    <Button
                      variant={soundEnabled ? "default" : "outline"}
                      onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      {soundEnabled ? 'مفعل' : 'معطل'}
                    </Button>
                  </div>
                  <Button onClick={testAudio} className="w-full">
                    <Volume2 className="w-4 h-4 ml-2" />
                    اختبار الصوت
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPanel

