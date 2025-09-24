/**
 * مكون التعليمات الصوتية للمراجعين
 * يوفر تعليمات صوتية باللهجة الخليجية
 */

class VoiceInstructions {
    constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.currentUtterance = null;
        this.voices = [];
        this.preferredVoice = null;
        
        if (this.isSupported) {
            this.loadVoices();
            // تحديث الأصوات عند تحميلها
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = speechSynthesis.getVoices();
        // البحث عن صوت عربي مناسب
        this.preferredVoice = this.voices.find(voice => 
            voice.lang.includes('ar') || 
            voice.name.toLowerCase().includes('arabic') ||
            voice.name.toLowerCase().includes('saudi')
        ) || this.voices.find(voice => voice.lang.includes('ar'));
    }

    speak(text, options = {}) {
        if (!this.isSupported) {
            console.warn('التعليمات الصوتية غير مدعومة في هذا المتصفح');
            return false;
        }

        // إيقاف أي تشغيل حالي
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // إعدادات الصوت
        utterance.lang = options.lang || 'ar-SA';
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;
        
        if (this.preferredVoice) {
            utterance.voice = this.preferredVoice;
        }

        // معالجة الأحداث
        utterance.onstart = () => {
            console.log('بدء التشغيل الصوتي');
            if (options.onStart) options.onStart();
        };

        utterance.onend = () => {
            console.log('انتهاء التشغيل الصوتي');
            this.currentUtterance = null;
            if (options.onEnd) options.onEnd();
        };

        utterance.onerror = (event) => {
            console.error('خطأ في التشغيل الصوتي:', event.error);
            if (options.onError) options.onError(event);
        };

        this.currentUtterance = utterance;
        speechSynthesis.speak(utterance);
        return true;
    }

    stop() {
        if (this.isSupported && speechSynthesis.speaking) {
            speechSynthesis.cancel();
            this.currentUtterance = null;
        }
    }

    pause() {
        if (this.isSupported && speechSynthesis.speaking) {
            speechSynthesis.pause();
        }
    }

    resume() {
        if (this.isSupported && speechSynthesis.paused) {
            speechSynthesis.resume();
        }
    }

    isPlaying() {
        return this.isSupported && speechSynthesis.speaking;
    }

    isPaused() {
        return this.isSupported && speechSynthesis.paused;
    }

    // إنشاء زر التعليمات الصوتية
    createVoiceButton(text, container, options = {}) {
        const button = document.createElement('button');
        button.className = 'voice-instruction-btn';
        button.innerHTML = `
            <i class="fas fa-volume-up"></i>
            <span>${options.buttonText || 'استمع للتعليمات'}</span>
        `;
        
        button.onclick = () => {
            if (this.isPlaying()) {
                this.stop();
                button.innerHTML = `
                    <i class="fas fa-volume-up"></i>
                    <span>${options.buttonText || 'استمع للتعليمات'}</span>
                `;
            } else {
                this.speak(text, {
                    onStart: () => {
                        button.innerHTML = `
                            <i class="fas fa-stop"></i>
                            <span>إيقاف</span>
                        `;
                    },
                    onEnd: () => {
                        button.innerHTML = `
                            <i class="fas fa-volume-up"></i>
                            <span>${options.buttonText || 'استمع للتعليمات'}</span>
                        `;
                    }
                });
            }
        };

        if (container) {
            container.appendChild(button);
        }

        return button;
    }

    // رسائل صوتية محددة مسبقاً
    speakWelcome() {
        this.speak('أهلاً وسهلاً بك في المركز الطبي. يرجى اختيار نوع الفحص المطلوب.');
    }

    speakClinicDirection(clinicName, floor, location) {
        const message = `توجه إلى ${clinicName}. الموقع: ${floor}، ${location}`;
        this.speak(message);
    }

    speakWaitingTime(minutes) {
        const message = `الوقت المتوقع للانتظار: ${minutes} دقيقة تقريباً`;
        this.speak(message);
    }

    speakExamComplete() {
        this.speak('تم إكمال الفحص بنجاح. يمكنك الحصول على التقرير من المكتب الرئيسي.');
    }
}

// إنشاء مثيل عام
const voiceInstructions = new VoiceInstructions();

// إضافة أنماط CSS للأزرار
const style = document.createElement('style');
style.textContent = `
    .voice-instruction-btn {
        background: linear-gradient(135deg, #007BFF, #0056b3);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0, 123, 255, 0.3);
        margin: 5px;
    }

    .voice-instruction-btn:hover {
        background: linear-gradient(135deg, #0056b3, #004085);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
    }

    .voice-instruction-btn:active {
        transform: translateY(0);
    }

    .voice-instruction-btn i {
        font-size: 16px;
    }

    .voice-instruction-btn:disabled {
        background: #6c757d;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;
document.head.appendChild(style);
