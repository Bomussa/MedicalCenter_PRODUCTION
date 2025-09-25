import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { CheckCircle, Clock, Lock, Volume2, VolumeX, User, Stethoscope, FileText, Settings } from 'lucide-react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [militaryId, setMilitaryId] = useState('')
  const [gender, setGender] = useState('')
  const [examType, setExamType] = useState('')
  const [currentClinic, setCurrentClinic] = useState(0)
  const [pin, setPin] = useState('')
  const [queueNumber, setQueueNumber] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const [isAdmin, setIsAdmin] = useState(false)
  const [dailyCodes, setDailyCodes] = useState([])

  const examTypes = [
    { id: 'recruitment', name: 'تجنيد', icon: '🎖️', color: 'bg-blue-500' },
    { id: 'promotion', name: 'ترفيع', icon: '⬆️', color: 'bg-green-500' },
    { id: 'transfer', name: 'نقل', icon: '🔄', color: 'bg-yellow-500' },
    { id: 'conversion', name: 'تحويل', icon: '🔀', color: 'bg-purple-500' },
    { id: 'aviation', name: 'طيران', icon: '✈️', color: 'bg-sky-500' },
    { id: 'cooks', name: 'طباخين', icon: '👨‍🍳', color: 'bg-orange-500' }
  ]

  const clinics = [
    { id: 1, name: 'مختبر', floor: 'الميزانين', status: 'active', instructions: 'يمكن الوصول لطابق الميزانين عبر المصعد بالضغط على زر M أو عبر الدرج بجانب البوابة الخلفية' },
    { id: 2, name: 'عيادة القلب', floor: 'الطابق الثاني', status: 'locked', instructions: 'يرجى التوجّه إلى الطابق الثاني لإكمال الفحص الطبي' },
    { id: 3, name: 'عيادة العيون', floor: 'الطابق الثاني', status: 'locked', instructions: 'يرجى التوجّه إلى الطابق الثاني لإكمال الفحص الطبي' },
    { id: 4, name: 'عيادة الأنف والأذن', floor: 'الطابق الثاني', status: 'locked', instructions: 'يرجى التوجّه إلى الطابق الثاني لإكمال الفحص الطبي' },
    { id: 5, name: 'عيادة الأسنان', floor: 'الطابق الثاني', status: 'locked', instructions: 'يرجى التوجّه إلى الطابق الثاني لإكمال الفحص الطبي' }
  ]

  // Timer countdown effect
  useEffect(() => {
    if (currentStep === 3 && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, timeRemaining])

  // Generate daily codes (simulated)
  useEffect(() => {
    const generateDailyCodes = () => {
      const codes = clinics.map(clinic => ({
        clinicId: clinic.id,
        clinicName: clinic.name,
        code: String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')
      }))
      setDailyCodes(codes)
    }
    generateDailyCodes()
  }, [])

  // تشغيل الملفات الصوتية المسجلة
  const playAudioFile = (audioFile) => {
    if (soundEnabled) {
      try {
        const audio = new Audio(audioFile)
        audio.volume = 0.9
        audio.play().catch(error => {
          console.log('فشل في تشغيل الملف الصوتي:', error)
          // العودة إلى النص المنطوق في حالة فشل تشغيل الملف
          playSound(getMessageFromAudioFile(audioFile))
        })
      } catch (error) {
        console.log('خطأ في تحميل الملف الصوتي:', error)
        playSound(getMessageFromAudioFile(audioFile))
      }
    }
  }

  // الحصول على النص المقابل للملف الصوتي
  const getMessageFromAudioFile = (audioFile) => {
    if (audioFile.includes('female_notice')) {
      return 'يرجى التوجّه إلى استقبال المركز الطبي للتسجيل في العيادات بالطابق الثالث'
    } else if (audioFile.includes('lab_instruction')) {
      return 'يرجى التوجه إلى طابق الميزانين لفحص المختبر'
    } else if (audioFile.includes('second_floor_instruction')) {
      return 'يرجى التوجّه إلى الطابق الثاني لإكمال الفحص الطبي'
    }
    return audioFile
  }

  const playSound = (message) => {
    if (soundEnabled && 'speechSynthesis' in window) {
      // انتظار تحميل الأصوات
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices()
        const utterance = new SpeechSynthesisUtterance(message)
        
        // البحث عن صوت أنثوي عربي
        const arabicFemaleVoice = voices.find(voice => 
          voice.lang.includes('ar') && 
          (voice.name.includes('female') || voice.name.includes('Female') || 
           voice.name.includes('woman') || voice.name.includes('Woman') ||
           voice.name.includes('Zira') || voice.name.includes('Hoda') ||
           voice.name.includes('Laila') || voice.name.includes('Mira'))
        )
        
        // إذا لم يتم العثور على صوت أنثوي عربي، استخدم أي صوت أنثوي
        const femaleVoice = arabicFemaleVoice || voices.find(voice => 
          voice.name.includes('female') || voice.name.includes('Female') || 
          voice.name.includes('woman') || voice.name.includes('Woman') ||
          voice.name.includes('Zira') || voice.name.includes('Samantha') ||
          voice.name.includes('Victoria') || voice.name.includes('Karen')
        )
        
        if (femaleVoice) {
          utterance.voice = femaleVoice
        }
        
        utterance.lang = 'ar-SA'
        utterance.rate = 0.8  // سرعة أبطأ للوضوح
        utterance.pitch = 1.1  // نبرة أعلى قليلاً
        utterance.volume = 0.9
        
        speechSynthesis.speak(utterance)
      }
      
      // إذا كانت الأصوات محملة، استخدمها مباشرة
      if (speechSynthesis.getVoices().length > 0) {
        loadVoices()
      } else {
        // انتظار تحميل الأصوات
        speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }

  const handleStart = () => {
    if (!militaryId || !gender) {
      alert('يرجى إدخال جميع البيانات المطلوبة')
      return
    }

    if (gender === 'female') {
      const message = 'يرجى التوجّه إلى استقبال المركز الطبي – للتسجيل في العيادات بالطابق الثالث'
      alert(message)
      playAudioFile('/src/assets/female_notice.wav')
      return
    }

    setCurrentStep(2)
  }

  const handleExamSelection = (type) => {
    setExamType(type)
    setCurrentStep(3)
    setQueueNumber(Math.floor(Math.random() * 50) + 1)
    setTimeRemaining(300) // Reset timer
    
    playAudioFile('/src/assets/lab_instruction.wav')
  }

  const handlePinEntry = () => {
    if (pin.length !== 2) {
      alert('يرجى إدخال رمز مكون من رقمين')
      return
    }

    // Verify PIN against daily codes
    const currentClinicCode = dailyCodes.find(code => code.clinicId === clinics[currentClinic].id)
    if (currentClinicCode && pin === currentClinicCode.code) {
      setCurrentClinic(currentClinic + 1)
      setPin('')
      setQueueNumber(Math.floor(Math.random() * 30) + 1)
      setTimeRemaining(300) // Reset timer
      
      if (currentClinic < clinics.length - 1) {
        playAudioFile('/src/assets/second_floor_instruction.wav')
      } else {
        setCurrentStep(4)
      }
    } else {
      alert('رمز التأكيد غير صحيح')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return ((currentClinic) / clinics.length) * 100
  }

  const AdminPanel = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            لوحة الإدارة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">أكواد اليوم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dailyCodes.map(code => (
                    <div key={code.clinicId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{code.clinicName}</span>
                      <Badge variant="secondary" className="font-mono text-lg">
                        {code.code}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => {
                    const newCodes = clinics.map(clinic => ({
                      clinicId: clinic.id,
                      clinicName: clinic.name,
                      code: String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')
                    }))
                    setDailyCodes(newCodes)
                  }}
                  className="w-full mt-4"
                >
                  تجديد الأكواد
                </Button>
                <Button 
                  onClick={() => {
                    setSoundEnabled(true)
                    playAudioFile('/src/assets/female_notice.wav')
                  }}
                  variant="outline"
                  className="w-full mt-2"
                >
                  اختبار الصوت
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">إحصائيات اليوم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>إجمالي الزوار:</span>
                    <Badge>{Math.floor(Math.random() * 100) + 50}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط وقت الانتظار:</span>
                    <Badge variant="secondary">12 دقيقة</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>العيادات النشطة:</span>
                    <Badge variant="outline">{clinics.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )

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
              variant="outline"
              size="sm"
              onClick={() => setIsAdmin(!isAdmin)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {isAdmin ? 'عرض المراجع' : 'لوحة الإدارة'}
            </Button>
          </div>
        </div>

        {/* Admin Panel */}
        {isAdmin && <AdminPanel />}

        {/* Public Flow */}
        {!isAdmin && (
          <>
            {/* Step 1: Initial Registration */}
            {currentStep === 1 && (
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <User className="w-5 h-5" />
                    بيانات المراجع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">الرقم العسكري/الشخصي</label>
                    <Input
                      value={militaryId}
                      onChange={(e) => setMilitaryId(e.target.value)}
                      placeholder="أدخل رقمك العسكري أو الشخصي"
                      className="text-center text-lg h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">الجنس</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={gender === 'male' ? 'default' : 'outline'}
                        onClick={() => setGender('male')}
                        className="h-12 text-lg"
                      >
                        ذكر
                      </Button>
                      <Button
                        variant={gender === 'female' ? 'default' : 'outline'}
                        onClick={() => setGender('female')}
                        className="h-12 text-lg"
                      >
                        أنثى
                      </Button>
                    </div>
                  </div>

                  {gender === 'female' && (
                    <Alert className="border-pink-200 bg-pink-50">
                      <AlertDescription className="text-pink-800 text-center">
                        <strong>ملاحظة:</strong> يرجى التوجّه إلى استقبال المركز الطبي – للتسجيل في العيادات بالطابق الثالث
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={handleStart} className="w-full h-12 text-lg" size="lg">
                    موافق
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Exam Type Selection */}
            {currentStep === 2 && (
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-green-600 text-white rounded-t-lg">
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5" />
                    نوع الفحص
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {examTypes.map((exam) => (
                      <Button
                        key={exam.id}
                        variant="outline"
                        onClick={() => handleExamSelection(exam.id)}
                        className={`h-24 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform ${exam.color} hover:text-white border-2`}
                      >
                        <span className="text-3xl">{exam.icon}</span>
                        <span className="text-sm font-medium">{exam.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Medical Path */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Sound Control */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="flex items-center gap-2"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span>{soundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}</span>
                  </Button>
                </div>

                {/* Progress Bar */}
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center mb-2">
                      <span className="text-sm text-gray-600">تقدم الفحص</span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-3" />
                    <div className="text-center mt-2">
                      <span className="text-sm font-medium">{currentClinic} من {clinics.length}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Queue Number */}
                <Card className="bg-green-50 border-green-200 shadow-lg">
                  <CardContent className="text-center py-6">
                    <div className="text-sm text-green-600 mb-2">رقم دورك الحالي</div>
                    <div className="text-4xl font-bold text-green-800">{queueNumber}</div>
                  </CardContent>
                </Card>

                {/* Timer */}
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="text-center py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-800 font-medium text-lg">{formatTime(timeRemaining)}</span>
                    </div>
                    <div className="text-sm text-orange-600 mt-1">الوقت المتبقي</div>
                  </CardContent>
                </Card>

                {/* Clinics List */}
                <Card className="shadow-xl border-0">
                  <CardHeader className="bg-purple-600 text-white rounded-t-lg">
                    <CardTitle className="text-center">المسار الطبي</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    {clinics.map((clinic, index) => (
                      <div
                        key={clinic.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          index === currentClinic
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : index < currentClinic
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-lg">{clinic.name}</div>
                            <div className="text-sm text-gray-600">{clinic.floor}</div>
                          </div>
                          <div>
                            {index < currentClinic ? (
                              <CheckCircle className="w-8 h-8 text-green-500" />
                            ) : index === currentClinic ? (
                              <Badge variant="default" className="text-lg px-3 py-1">نشط</Badge>
                            ) : (
                              <Lock className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Current Clinic Instructions */}
                {currentClinic < clinics.length && (
                  <Alert className="border-blue-200 bg-blue-50 shadow-lg">
                    <AlertDescription className="text-blue-800">
                      <strong>يرجى التوجه إلى {clinics[currentClinic].name} في {clinics[currentClinic].floor}</strong>
                      <div className="mt-2 text-sm">
                        {clinics[currentClinic].instructions}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* PIN Entry */}
                <Card className="shadow-xl border-0">
                  <CardHeader className="bg-red-600 text-white rounded-t-lg">
                    <CardTitle className="text-center">إدخال رمز التأكيد</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="text-center text-sm text-gray-600 mb-4">
                      أدخل الرمز المكون من رقمين من موظف {clinics[currentClinic]?.name}
                    </div>
                    <Input
                      type="text"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      placeholder="XX"
                      maxLength={2}
                      className="text-center text-3xl h-16 font-mono"
                    />
                    <Button 
                      onClick={handlePinEntry} 
                      className="w-full h-12 text-lg" 
                      disabled={pin.length !== 2}
                    >
                      تأكيد
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Completion */}
            {currentStep === 4 && (
              <Card className="shadow-xl border-0 bg-green-50 border-green-200">
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-green-800 mb-4">
                    تم إنهاء الفحص الطبي بنجاح ✅
                  </h2>
                  <p className="text-green-600 text-lg mb-6">
                    شكراً لك على زيارة المركز الطبي العسكري
                  </p>
                  <Button 
                    onClick={() => {
                      setCurrentStep(1)
                      setMilitaryId('')
                      setGender('')
                      setExamType('')
                      setCurrentClinic(0)
                      setPin('')
                      setQueueNumber(null)
                      setTimeRemaining(300)
                    }}
                    className="text-lg px-8 py-3"
                    size="lg"
                  >
                    بدء جديد
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
