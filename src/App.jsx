import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Stethoscope, Volume2, VolumeX, Settings, ArrowRight, Clock, CheckCircle } from 'lucide-react'
import AdminPanel from './components/AdminPanel.jsx'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showFullAdmin, setShowFullAdmin] = useState(false)
  const [militaryId, setMilitaryId] = useState('')
  const [gender, setGender] = useState('')
  const [examType, setExamType] = useState('')
  const [currentClinic, setCurrentClinic] = useState(0)
  const [queueNumber, setQueueNumber] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [dailyCodes, setDailyCodes] = useState([
    { clinic: 'المختبر', code: '87' },
    { clinic: 'القلب', code: '67' },
    { clinic: 'العيون', code: '75' },
    { clinic: 'الأنف والأذن والحنجرة', code: '48' },
    { clinic: 'الأسنان', code: '21' }
  ])

  const examTypes = [
    { id: 'RECRUITMENT', name: 'تجنيد' },
    { id: 'PROMOTION', name: 'ترفيع' },
    { id: 'TRANSFER', name: 'نقل' },
    { id: 'CONVERSION', name: 'تحويل' },
    { id: 'AVIATION', name: 'طيران' },
    { id: 'COOKS', name: 'طباخين' }
  ]

  const clinics = [
    { id: 'lab', name: 'المختبر', floor: 'الميزانين' },
    { id: 'cardiology', name: 'القلب', floor: 'الطابق الثاني' },
    { id: 'ophthalmology', name: 'العيون', floor: 'الطابق الثاني' },
    { id: 'ent', name: 'الأنف والأذن والحنجرة', floor: 'الطابق الثاني' },
    { id: 'dentistry', name: 'الأسنان', floor: 'الطابق الثالث' }
  ]

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining])

  const handleSubmit = () => {
    if (!militaryId || !gender) {
      alert('يرجى إدخال جميع البيانات المطلوبة')
      return
    }

    if (gender === 'female') {
      playFemaleNotice()
      return
    }

    setCurrentStep(2)
  }

  const handleExamSelection = (type) => {
    setExamType(type)
    setCurrentStep(3)
    setQueueNumber(Math.floor(Math.random() * 50) + 1)
    setTimeRemaining(300) // 5 minutes
  }

  const playFemaleNotice = () => {
    if (soundEnabled) {
      // Simulate audio playback
      console.log('Playing female notice audio')
    }
  }

  const testAudio = () => {
    playFemaleNotice()
  }

  const generateDailyCodes = () => {
    const newCodes = dailyCodes.map(code => ({
      ...code,
      code: String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')
    }))
    setDailyCodes(newCodes)
  }

  const getProgress = () => {
    return ((currentClinic) / clinics.length) * 100
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Female notice step
  if (gender === 'female') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-4" dir="rtl">
        <div className="max-w-2xl mx-auto">
          <Card className="border-pink-200 shadow-lg">
            <CardHeader className="text-center bg-pink-50">
              <CardTitle className="text-pink-800 text-xl">إشعار خاص للمراجعات</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Alert className="border-pink-200 bg-pink-50">
                <AlertDescription className="text-pink-800 text-lg text-center">
                  يرجى التوجّه إلى استقبال المركز الطبي للتسجيل في العيادات بالطابق الثالث
                </AlertDescription>
              </Alert>
              <div className="mt-6 text-center">
                <Button 
                  onClick={() => setGender('')}
                  variant="outline"
                  className="mr-2"
                >
                  العودة
                </Button>
                <Button 
                  onClick={testAudio}
                  variant="outline"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  تشغيل الإشعار الصوتي
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Admin panel
  if (showAdmin && !showFullAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة الإدارة</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات اليوم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>الزوار: {dailyCodes.length > 0 ? '1' : '0'}</div>
                    <div>العيادات النشطة: 5</div>
                    <div>الفحوصات المكتملة: 1</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>الأكواد اليومية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dailyCodes.map((code, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{code.clinic}</span>
                        <Badge variant="outline">{code.code}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={generateDailyCodes}
                    className="w-full mt-4"
                  >
                    تجديد الأكواد
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setShowAdmin(false)}
                      variant="outline"
                      className="w-full"
                    >
                      العودة للواجهة الرئيسية
                    </Button>
                    <Button 
                      onClick={() => setShowFullAdmin(true)}
                      className="w-full"
                    >
                      لوحة الإدارة الشاملة
                    </Button>
                    <Button 
                      onClick={testAudio}
                      variant="outline"
                      className="w-full"
                    >
                      اختبار الصوت
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full Admin Panel
  if (showFullAdmin) {
    return (
      <AdminPanel 
        onBack={() => setShowFullAdmin(false)}
        dailyCodes={dailyCodes}
        setDailyCodes={setDailyCodes}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        testAudio={testAudio}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Stethoscope className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">المركز الطبي العسكري</h1>
          <p className="text-blue-600 text-lg">نظام إدارة الفحوصات الطبية</p>
          
          {/* Admin Toggle */}
          <div className="mt-4">
            <Button 
              onClick={() => setShowAdmin(!showAdmin)}
              variant="outline"
              className="mr-2"
            >
              <Settings className="w-4 h-4 mr-2" />
              لوحة الإدارة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {soundEnabled ? 'إيقاف الصوت' : 'تفعيل الصوت'}
            </Button>
          </div>
        </div>

        {/* Step 1: Registration */}
        {currentStep === 1 && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-blue-800">تسجيل بيانات المراجع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرقم العسكري / الشخصي
                </label>
                <Input
                  type="text"
                  value={militaryId}
                  onChange={(e) => setMilitaryId(e.target.value)}
                  placeholder="أدخل الرقم العسكري أو الشخصي"
                  className="text-center"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الجنس
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={gender === 'male' ? 'default' : 'outline'}
                    onClick={() => setGender('male')}
                    className="h-12"
                  >
                    ذكر
                  </Button>
                  <Button
                    variant={gender === 'female' ? 'default' : 'outline'}
                    onClick={() => setGender('female')}
                    className="h-12"
                  >
                    أنثى
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit}
                className="w-full h-12 text-lg"
                disabled={!militaryId || !gender}
              >
                موافق
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Exam Type Selection */}
        {currentStep === 2 && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-blue-800">اختيار نوع الفحص</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {examTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant="outline"
                    onClick={() => handleExamSelection(type.id)}
                    className="h-16 text-lg"
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Medical Path */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">تقدم الفحص</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={getProgress()} className="h-3" />
                  <div className="text-center text-sm text-gray-600">
                    {currentClinic} من {clinics.length} عيادات
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Queue */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="text-center p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">رقم دورك الحالي</h3>
                <div className="text-4xl font-bold text-green-600">{queueNumber}</div>
              </CardContent>
            </Card>

            {/* Timer */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="text-center p-6">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-800 font-medium">الوقت المتبقي</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 mt-2">
                  {formatTime(timeRemaining)}
                </div>
              </CardContent>
            </Card>

            {/* Medical Path */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-purple-800">المسار الطبي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clinics.map((clinic, index) => (
                    <div 
                      key={clinic.id}
                      className={`flex items-center p-4 rounded-lg border-2 ${
                        index < currentClinic 
                          ? 'bg-green-50 border-green-200' 
                          : index === currentClinic 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        index < currentClinic 
                          ? 'bg-green-500 text-white' 
                          : index === currentClinic 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index < currentClinic ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{clinic.name}</h4>
                        <p className="text-sm text-gray-600">{clinic.floor}</p>
                      </div>
                      {index === currentClinic && (
                        <Badge variant="default">الحالي</Badge>
                      )}
                      {index < currentClinic && (
                        <Badge variant="secondary">مكتمل</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
